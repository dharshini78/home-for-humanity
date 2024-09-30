import React, { createContext, useState, useContext } from "react";

const MuteContext = createContext();

export const useMute = () => {
  return useContext(MuteContext);
};

export const MuteProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <MuteContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </MuteContext.Provider>
  );
};

