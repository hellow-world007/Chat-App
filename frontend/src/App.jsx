/* eslint-disable no-empty */
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContext } from "./shared/context/auth-context";
import { ConversationProvider } from "./shared/context/conversation-context";
import { useAuth } from "./shared/hooks/auth-hook";

import Auth from "./pages/Auth";
import AuthRequired from "./pages/AuthRequired";
import HomePage from "./pages/HomePage";
import "./App.css";
import { SocketProvider } from "./shared/context/SocketContext";
import Layout from "./components/sidebar/Layout";
import { useHttpClient } from "./shared/hooks/http-hook";
import { useEffect, useState } from "react";
import Error from "./shared/components/UIElements/Error";
import NotFound from "./shared/components/UIElements/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <AuthRequired />,
        children: [
          {
            path: "/",
            element: <HomePage />,
            errorElement: <Error />,
          },
        ],
      },
      {
        path: "/auth",
        element: <Auth />,
        errorElement: <Error />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  const { token, login, logout, userId, loading } = useAuth();
  const [loggedInUser, setLoggedInUser] = useState();

  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/${userId}`
        );

        setLoggedInUser(responseData.user);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, userId]);

  const darkMode = localStorage.getItem("theme") === "dark";

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        loggedInUser: loggedInUser && loggedInUser,
        userId: userId,
        loading: loading,
        login: login,
        logout: logout,
      }}
    >
      <ConversationProvider>
        <SocketProvider>
          <div
            className={`p-4 h-screen flex items-center justify-center ${
              darkMode ? "dark" : ""
            }`}
          >
            <RouterProvider router={router} />
          </div>
        </SocketProvider>
      </ConversationProvider>
    </AuthContext.Provider>
  );
}

export default App;
