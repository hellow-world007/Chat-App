import { useContext, useEffect } from "react";
import { useSocketContext } from "../shared/context/SocketContext";
import ConversationContext from "../shared/context/conversation-context";

const useMessagesRealtime = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useContext(ConversationContext);

  useEffect(() => {
    if (socket == null) return;

    const notificationSound = new Audio("/notification.mp3");

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      notificationSound.play();
    });

    return () => socket.off("message");
  }, [socket, messages, setMessages]);
};

export default useMessagesRealtime;
