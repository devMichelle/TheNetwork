import axios from "axios";
import { useAuthContext } from "./AuthProvider";

const { token } = useAuthContext();

const PROFILE_API = axios.create({
  baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
  headers: { Authorization: `Bearer ${token}` },
});

// Fetch Profiles

export const fetchProfiles = async () => {
  try {
    const response = await PROFILE_API.get("");
    console.log("Fetched Data From Action");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
