import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { profileFollowers, profilePostType } from "../helpers/TheNetWorkTypes";

type ConnectionsType = {
  children: React.ReactNode;
};

type ConnectionsContextType = {
  fetchPostsByConnection: (token: string, name: string) => void;
  userProfileData: any;
  getProfileFollowersAndFollowing: (token: string, name: string) => void;
  followersData: any;
};

//Create Connection Context
export const theNetworkContext = createContext<ConnectionsContextType>(null!);
export const useTheNetworkContext = () =>
  useContext<ConnectionsContextType>(theNetworkContext);

const TheNetWorkProvider = ({ children }: ConnectionsType) => {
  const [userProfileData, setUserProfileData] = useState<profilePostType>();
  const [followersData, setFollowersData] = useState<profileFollowers>();

  //Fetch Posts By Connection

  const fetchPostsByConnection = async (token: string, name: string) => {
    const PROFILE_API = axios.create({
      baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      const response = await PROFILE_API.get(`${name}/posts`);
      console.log("Fetched Data from Network Provider");
      console.log(response.data);
      setUserProfileData(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  //Get Connection Followers and Following

  const getProfileFollowersAndFollowing = async (
    token: string,
    name: string
  ) => {
    const PROFILE_API = axios.create({
      baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      const response = await PROFILE_API.get(
        `${name}?_following=true&_followers=true`
      );
      console.log("Fetching.... Followers & Following");
      console.log(response.data);
      setFollowersData(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    fetchPostsByConnection,
    userProfileData,
    getProfileFollowersAndFollowing,
    followersData,
  };

  return (
    <theNetworkContext.Provider value={value}>
      {children}
    </theNetworkContext.Provider>
  );
};

export default TheNetWorkProvider;
