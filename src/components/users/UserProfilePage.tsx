import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";
import Navbar from "../Navbar";
import Reactions from "../Reactions";
import HeroSection from "../HeroSection";

type Props = {};

type arrayOfUserProfileData = {
  userProfileData: [];
};

const UserProfilePage = (props: Props) => {
  const { token } = useAuthContext();

  const [fetchUserPostData, setFetchedUserPostData] = useState([
    {
      author: { name: "" },
      id: 0,
      body: "",
      title: "",
      media: "",
      _count: {
        comments: 0,
        reactions: 0,
      },
    },
  ]);

  const [followingAndFollowers, setFollowingAndFollowers] = useState({
    followers: [
      {
        name: "",
        avatar: "",
      },
    ],

    following: [
      {
        name: "",
        avatar: "",
      },
    ],

    _count: {
      posts: 0,
      followers: 0,
      following: 0,
    },
  });

  //const {userProfileData } = useTheNetworkContext();
  //const [userProfileDetails, setUserProfileDetails] = useState<profileDetailType>();

  const location = useLocation();
  const { profileName, profileAvatar, profileBanner } = location.state;
  const navigate = useNavigate();
  let pName = profileName;

  const fetchPostsByConnection = async (token: string, profileName: string) => {
    const PROFILE_API = axios.create({
      baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      const response = await PROFILE_API.get(`${pName}/posts/`);
      console.log("Fetching..... UserData");
      console.log(response.data);
      setFetchedUserPostData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //...................Get Connection Followers and Following..........................

  const getProfileFollowersAndFollowing = async () => {
    const PROFILE_API = axios.create({
      baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      const response = await PROFILE_API.get(
        `${pName}?_following=true&_followers=true`
      );
      console.log("Fetching.... Followers & Following");
      console.log(response.data);
      setFollowingAndFollowers(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPostsByConnection(token, profileName);
    getProfileFollowersAndFollowing();
  }, [token]);

  //...................No posts default message..........................

  const noPostAvailable = (
    <div
      className="flex bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700"
      role="alert"
    >
      <svg
        className="w-4 h-5 inline mr-3"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <div>
        <span className="font-medium">No Post!</span> This user has no posts
        yet.
      </div>
    </div>
  );

  return (
    <>
      <Navbar title="TheNetWork" token={token} />

      <HeroSection
        profileName={profileName}
        profileBanner={profileBanner}
        profileAvatar={profileAvatar}
        following={followingAndFollowers.followers}
      />

      {/* Post card section*/}

      <div className="flex flex-col lg:flex-row my-20 justify-center gap-20 mx-5 ">
        <div className="flex flex-col gap-10 items-center">
          {fetchUserPostData.length == 0
            ? noPostAvailable
            : fetchUserPostData.map((post) => (
                <div
                  key={post.title}
                  className="card md:w-96 bg-base-100 shadow-xl"
                >
                  <div className="flex justify-between px-8 pt-5">
                    <div className="flex gap-5">
                      <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-14">
                          <span>
                            {" "}
                            <img
                              src={
                                profileAvatar
                                  ? profileAvatar
                                  : require("../../assets/profile_picture_placeholder.jpg")
                              }
                              alt="User avatar image"
                            />{" "}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 font-bold">{profileName}</div>
                    </div>
                  </div>

                  <div className="card-body">
                    <h2 className="card-title">{post.title}</h2>
                    <p>{post.body}</p>
                  </div>
                  <figure>
                    <img
                      src={
                        post.media
                          ? post.media
                          : require("../../assets/banner_place_hold.png")
                      }
                      alt="post media"
                    />
                  </figure>
                  <div className="flex justify-between  my-10 px-10 gap-5">
                    <div>
                      <p className=" text-sm mx-2">
                        {" "}
                        {post._count.reactions} Reactions
                      </p>
                    </div>
                    <div>
                      <p className=" text-sm mx-2">
                        {" "}
                        {post._count.comments} Comments
                      </p>
                    </div>
                  </div>

                  <div className="">
                    <div className="px-8 py-5">
                      {" "}
                      <button
                        className="btn btn-xs sm:btn-sm color__hover "
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/single-post-detail", {
                            state: {
                              postId: post.id,
                            },
                          });
                          //console.log("I am clicked");
                        }}
                      >
                        View and comment
                      </button>{" "}
                    </div>

                    <Reactions
                      postId={post.id}
                      fetchPostsByConnection={getProfileFollowersAndFollowing}
                    />
                  </div>
                </div>
              ))}
        </div>

        {/* Followers section*/}

        {/* ------------------------------------------------ */}
        <div>
          <div className="flex flex-col gap-10">
            <div>
              {" "}
              <h2 className="font-bold">
                <span className=" text-black">
                  {followingAndFollowers._count.followers}
                </span>{" "}
                Followers
              </h2>
            </div>

            {followingAndFollowers.followers.map((follower, index) => (
              <div key={index} className="flex space-x-10">
                <div className="flex gap-5">
                  <div className="avatar placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                      <img
                        src={
                          follower.avatar
                            ? follower.avatar
                            : require("../../assets/profile_picture_placeholder.jpg")
                        }
                        alt="User avatar image"
                      />
                    </div>
                  </div>
                  <div className="shrink, grow-0">
                    <h3 className="font-bold text-color__hover">
                      <a
                        href=""
                        onClick={() => {
                          navigate("/user-profile", {
                            state: {
                              profileName: follower.name,
                              profileAvatar: follower.avatar,
                            },
                          });
                          console.log("I am clicked");
                        }}
                      >
                        {" "}
                        {follower.name}{" "}
                      </a>
                    </h3>
                    <p>Student at Noroff | Oslo</p>
                    <p className=" text-sm pt-1 font-bold"> </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <hr className="my-10"></hr>

          {/* Following section*/}

          <div className="flex flex-col gap-10">
            <div>
              {" "}
              <h2 className="font-bold">
                {" "}
                {profileName} follow{" "}
                <span className=" text-black">
                  {followingAndFollowers._count.following}
                </span>{" "}
                people
              </h2>
            </div>

            {followingAndFollowers.following.map((follower, index) => (
              <div key={index} className="flex space-x-10">
                <div className="flex gap-5">
                  <div className="avatar placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                      <img
                        src={
                          follower.avatar
                            ? follower.avatar
                            : require("../../assets/profile_picture_placeholder.jpg")
                        }
                        alt="User avatar image"
                      />
                    </div>
                  </div>
                  <div className="shrink, grow-0">
                    <h3 className="font-bold text-color__hover">
                      <a
                        href="/user-profile"
                        onClick={() => {
                          navigate("/user-profile", {
                            state: {
                              profileName: follower.name,
                              profileAvatar: follower.avatar,
                            },
                          });
                          console.log("I am clicked");
                        }}
                      >
                        {" "}
                        {follower.name}{" "}
                      </a>
                    </h3>
                    <p>Student at Noroff | Oslo</p>
                    <p className=" text-sm pt-1 font-bold"> </p>
                  </div>
                </div>
                <div className="hidden">follow button</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
