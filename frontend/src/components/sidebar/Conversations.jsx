/* eslint-disable no-empty */
import { useContext, useEffect, useState } from "react";
import Conversation from "./Conversation";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ConversationSkeleton from "../skeletons/ConversationSkeleton";
import ConversationContext from "../../shared/context/conversation-context";

const Conversations = () => {
  const [loadedUsers, setLoadedUsers] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { sendRequest } = useHttpClient();
  const { search, messages } = useContext(ConversationContext);

  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users`
        );

        setLoadedUsers(responseData.users);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  const filteredUsers = loadedUsers?.filter(
    (users) => users.id !== auth.userId
  );

  const lastMessages = messages && messages[messages?.length - 1];

  return (
    <div className="py-2 flex flex-col overflow-auto">
      {!isLoading &&
        filteredUsers &&
        filteredUsers
          .filter((item) => {
            return search.toLowerCase() === ""
              ? item
              : item.fullName.toLowerCase().includes(search);
          })
          .sort((a, b) => {
            if (a.id === lastMessages?.receiverId) return -1;
            if (b.id === lastMessages?.receiverId) return 1;
            return 0;
          })
          .map((user, index) => (
            <div key={user.id}>
              <Conversation user={user} lastIndex={index === user.length - 1} />
            </div>
          ))}

      {isLoading &&
        [...Array(1)].map((_, idx) => <ConversationSkeleton key={idx} />)}
    </div>
  );
};
export default Conversations;
