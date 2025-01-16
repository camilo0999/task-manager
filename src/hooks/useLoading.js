import { useState } from "react";

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const showLoading = (message) => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setLoadingMessage("");
    setIsLoading(true);
  };

  return {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
  };
};

export default useLoading;
