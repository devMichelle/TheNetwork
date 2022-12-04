import { createContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useAuthContext } from "./AuthProvider";
import profilesReducer from "./ProfileReducer";

const ProfilesContext = createContext();

export const ProfilesProvider = ({ children }) => {
  const initialState = {
    profiles: [],
    profile: {},
  };

  const [state, dispatch] = useReducer(profilesReducer, initialState);

  const { token } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [allProfiles, setAllProfiles] = useState([]);

  const PROFILE_API = axios.create({
    baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
    headers: { Authorization: `Bearer ${token}` },
  });

  return (
    <ProfilesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProfilesContext.Provider>
  );
};

export default ProfilesContext;
