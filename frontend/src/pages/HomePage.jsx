import { Fragment, useContext } from "react";
import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";
import { AuthContext } from "../shared/context/auth-context";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
const HomePage = () => {
  const { loading } = useContext(AuthContext);
  return (
    <Fragment>
      {loading && <LoadingSpinner asOverlay />}
      <div className="rounded-lg">
        <main className="flex flex-row items-center scroll-mt-40">
          <Sidebar />
          <MessageContainer />
        </main>
      </div>
    </Fragment>
  );
};

export default HomePage;
