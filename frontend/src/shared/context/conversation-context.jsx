import { createContext, useState } from "react";

const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [search, setSearch] = useState("");

  return (
    <ConversationContext.Provider
      value={{
        messages,
        setMessages,
        currentConversation,
        setCurrentConversation,
        search,
        setSearch,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationContext;
