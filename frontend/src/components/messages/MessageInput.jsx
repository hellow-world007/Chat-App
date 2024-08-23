/* eslint-disable no-mixed-spaces-and-tabs */
import { IoSendSharp } from "react-icons/io5";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useContext, useState } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import ConversationContext from "../../shared/context/conversation-context";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { BsEmojiSmile } from "react-icons/bs";

const MessageInput = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const { currentConversation, messages, setMessages } =
    useContext(ConversationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!message) return;

    setIsLoading(true);
    const responseData = await sendRequest(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/messages/send/${
        auth.userId
      }/${currentConversation.id}`,
      "POST",
      JSON.stringify({
        message: message,
      }),
      {
        "Content-Type": "application/json",
      }
    );
    setMessages([...messages, responseData.message]);
    setIsLoading(false);
    setMessage("");
    console.log(responseData);
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prevInput) => prevInput + emojiData.native);
  };

  return (
    <form className="px-4 my-3" onSubmit={sendMessageHandler}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {showPicker && <Picker data={data} onEmojiSelect={onEmojiClick} />}
      </div>

      <div className="w-full relative flex items-center">
        <p className="w-1/12 cursor-pointer" onClick={() => setShowPicker(!showPicker)}>
          <BsEmojiSmile className="text-teal-400 text-2xl" />
        </p>

        <input
          type="text"
          className="border text-sm rounded-lg block w-4/5 p-2.5  bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          {isLoading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <IoSendSharp className="text-teal-400 text-2xl" />
          )}
        </button>
      </div>
    </form>
  );
};
export default MessageInput;
