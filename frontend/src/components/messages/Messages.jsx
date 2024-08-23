/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
/* eslint-disable no-empty */
import { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import ConversationContext from "../../shared/context/conversation-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import useMessagesRealtime from "../../utils/useMessagesRealtime";

const Messages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { currentConversation, messages, setMessages } =
    useContext(ConversationContext);
  useMessagesRealtime();

  const { sendRequest } = useHttpClient();

  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/messages/read/${
            auth.userId
          }/${currentConversation.id}`
        );
        if (responseData.messages) {
          setMessages(responseData.messages);
        }
      } catch (err) {
        setMessages(null);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentConversation?.id) fetchMessages();
  }, [sendRequest, auth.userId, currentConversation.id, setMessages]);

  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!isLoading &&
        messages?.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}

      {isLoading &&
        [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!isLoading && !messages && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  );
};
export default Messages;
