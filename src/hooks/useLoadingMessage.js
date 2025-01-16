import { useState } from "react";

const useLoadingMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const showLoadingMessage = (message) => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoadingMessage = () => {
    setLoadingMessage("");
    setIsLoading(false);
  };

  return {
    isLoading,
    loadingMessage,
    showLoadingMessage,
    hideLoadingMessage,
  };
};

export default useLoadingMessage;
