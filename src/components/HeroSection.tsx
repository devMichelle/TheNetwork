import axios from "axios";
import { profile } from "console";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthProvider";

type Props = {
  profileName: string;
  profileBanner: string;
  profileAvatar: string;
  following: {}[];
};

const HeroSection = (props: Props) => {
  const { userData, token } = useAuthContext();
  const [delay, setdelay] = useState(0);
  const userNameRef = useRef(userData);
  const [userName, setUserName] = useState("");
  const [isfollowing, setIsFollowing] = useState(false);

  const [profileFollowers, setProfileFollowers] = useState({
    followers: [
      {
        name: "",
        avatar: "",
      },
    ],
  });

  const [currentLoginFollowers, setCurrentLoginFollowers] = useState({
    following: [
      {
        name: "",
        avatar: "",
      },
    ],
  });

  const getProfileFollowers = async () => {
    const PROFILE_API = axios.create({
      baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      const response = await PROFILE_API.get(
        `${props.profileName}?_following=true&_followers=true`
      );

      setProfileFollowers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLoginUserFollowers = async () => {
    const PROFILE_API = axios.create({
      baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      const response = await PROFILE_API.get(
        `${userData.name}?_following=true&_followers=true`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const follow = async () => {
    const PROFILE_API = axios.create({
      baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      const response = await PROFILE_API.put(`${props.profileName}/follow`);

      window.location.reload();
      toast.success("Follow successful");
    } catch (error: any) {
      const errorMessage = error.response.data.errors;
      errorMessage.map((e: any) => toast.error(e.message));
    }
  };

  const unfollow = async () => {
    const PROFILE_API = axios.create({
      baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      const response = await PROFILE_API.put(`${props.profileName}/unfollow`);
      toast.error("Unfollow successful");
      window.location.reload();
    } catch (error: any) {
      const errorMessage = error.response.data.errors;
      errorMessage.map((e: any) => toast.error(e.message));
    }
  };

  useEffect(() => {
    getProfileFollowers();
    getCurrentLoginUserFollowers().then((data) => {
      console.log(data);
    });
  }, [token]);

  return (
    <>
      <div className="hero">
        <div className="relative hero-content flex-col lg:flex-row gap-x-72 border-b border-gray-300  ">
          <img
            src={
              props.profileBanner
                ? props.profileBanner
                : require("../assets/banner_place_hold.png")
            }
            className="max-w-sm w-80 rounded-lg shadow-2xl"
          />
          <div className="absolute avatar flex-initial bottom-56 md:bottom-40 lg:left-60 lg:bottom-14">
            <div className="w-40 rounded-lg">
              <img
                className="w-64 h-64 rounded-full absolute"
                src={
                  props.profileAvatar
                    ? props.profileAvatar
                    : require("../assets/profile_picture_placeholder.jpg")
                }
              />
              <div className="w-50 h- group hover:bg-gray-200 opacity-60 rounded-full absolute flex justify-center items-center cursor-pointer transition duration-500">
                <img
                  className="hidden group-hover:block w-12"
                  src="https://www.svgrepo.com/show/33565/upload.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="mt-3 lg:mt-80 text-center">
            <h1 className="text-2xl font-bold ">{props.profileName}</h1>
            <p className="py-6">Student at Noroff | Oslo</p>

            <div className="flex gap-2">
              <div>
                {" "}
                <p>Follow or unfollow</p>
              </div>

              <input
                onClick={unfollow}
                type="radio"
                name="radio-5"
                className="radio radio-error "
              />
              <div>
                <input
                  onClick={follow}
                  type="radio"
                  name="radio-5"
                  className="radio radio-success"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
