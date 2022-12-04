import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { ProfileType } from "../helpers/TheNetWorkTypes";
import { useAuthContext } from "./AuthProvider";

type ConnectionsType = {
  children: React.ReactNode;
};

type ConnectionsContextType = {
  fetchConnectionsData: () => {};
};

//Create Connection Context
export const connectionContext = createContext<ConnectionsContextType>(null!);
export const useConnectionsContext = () => useContext(connectionContext);

const ConnectionsProvider = ({ children }: ConnectionsType) => {
  const { token } = useAuthContext();
  const [connectionsData, setConnectionsData] = useState<ProfileType>(null!);

  const PROFILE_API = axios.create({
    baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchConnectionsData = async () => {
    try {
      const response = await PROFILE_API.get("");
      console.log("Fetched Data ConnectionsContext");
      console.log(response.data);

      setConnectionsData(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    fetchConnectionsData,
  };

  return (
    <connectionContext.Provider value={value}>
      {children}
    </connectionContext.Provider>
  );
};

export default ConnectionsProvider;
