import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { AuthContext } from "./auth-context";

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const { loggedInUser, userId } = useContext(AuthContext);

  useEffect(() => {
    if (loggedInUser) {
      const newSocket = io("http://localhost:5000", {
        query: {
          userId: userId,
        },
      });
      setSocket(newSocket);

      newSocket.on("getActiveUsers", (users) => {
        setActiveUsers(users);
      });
      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [loggedInUser, userId]);

  return (
    <SocketContext.Provider value={{ socket, activeUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
