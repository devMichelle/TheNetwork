import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Reactions from "../components/Reactions";

type Props = {};

type AllPostType = {
  id: Number;
  title: string;
  body: string;
  created: string;
  media: string;
  tag: string[];
  _count: { comments: number; reactions: number };
}[];

type UserDataType = {
  name: string;
  email: string;
  avatar: string;
  accessToken: string;
};

type Connections = {
  name: string;
  banner: String;
  avatar: String;
  followers: [{ name: string; avatar: string }];
  _count: { followers: number; following: number };
};

export default function Profile({}: Props) {
  const [allPosts, setAllPosts] = useState<AllPostType>();

  const [allConnection, setAllConnections] = useState<Connections>();

  const [userData, setUserData] = useState<UserDataType>();

  console.log("Avatar........... ");
  console.log(userData);

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

  //...................Get Connection Followers and Following..........................

  const getProfileFollowersAndFollowing = async () => {
    const PROFILE_API = axios.create({
      baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
      headers: { Authorization: `Bearer ${userData?.accessToken}` },
    });

    try {
      const response = await PROFILE_API.get(
        `${userData?.name}?_following=true&_followers=true`
      );

      setFollowingAndFollowers(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const PROFILE_API = axios.create({
    baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
    headers: { Authorization: `Bearer ${userData?.accessToken}` },
  });

  const getAllConnections = async () => {
    try {
      const getAllConnectionResponse = await PROFILE_API.get(
        `${userData?.name}?_following=true&_followers=true`
      );

      setAllConnections(getAllConnectionResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProfilePosts = async () => {
    try {
      const getProfilePostsResponse = await PROFILE_API.get(
        `${userData?.name}/posts`
      );

      return getProfilePostsResponse.data
        ? getProfilePostsResponse.data
        : noPostAvailable;
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postId: Number) => {
    const DELETE_API = axios.create({
      baseURL: "https://api.noroff.dev/api/v1/social/posts",
      headers: { Authorization: `Bearer ${userData?.accessToken}` },
    });

    try {
      const response = await DELETE_API.delete(`${postId}`);

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const savedUserData = JSON.parse(localStorage.getItem("userData") || "");
    setUserData(savedUserData);

    if (!!userData?.accessToken) {
      getAllProfilePosts().then((data) => {
        setAllPosts(data);
      });

      getAllConnections();
      getProfileFollowersAndFollowing();
    }
  }, [userData?.accessToken]);

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
      <Navbar
        title="TheNetWork"
        token={userData?.accessToken}
        avatar={userData?.avatar}
      />

      <div className="hero ">
        <div className="  hero-content  gap-y-56 flex-col lg:flex-row  gap-x-56 border-b border-gray-300  ">
          <div className="relative">
            <img
              src={
                allConnection?.banner
                  ? allConnection.banner
                  : require("../assets/banner_place_hold.png")
              }
              className="max-w-sm md:w-85 rounded-lg shadow-2xl"
            />
          </div>

          <div className="absolute avatar flex-initial bottom-50  left-38 md:bottom-50 ">
            <div className="w-40 rounded-lg">
              <img
                className="w-64 h-64 rounded-full absolute"
                src={
                  allConnection?.avatar
                    ? allConnection.avatar
                    : require("../assets/profile_picture_placeholder.jpg")
                }
                alt="Profile avatar image"
              />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold ">{allConnection?.name}</h1>
            <p className="py-6">Student at Noroff | Oslo</p>
            <div className="form-control"></div>
          </div>
        </div>
      </div>

      {/* Post card section*/}

      <div className="flex flex-col lg:flex-row my-20 justify-center gap-20 mx-5">
        <div className="flex flex-col gap-10 items-center">
          {allPosts?.map((post) => (
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
                            userData?.avatar
                              ? userData?.avatar
                              : require("../assets/profile_picture_placeholder.jpg")
                          }
                          alt="User avatar image"
                        />{" "}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 font-bold">{userData?.name}</div>
                </div>

                {/* ----------- Dropdown Options menu-------------- */}

                <div className="dropdown dropdown-hover flex justify-end">
                  <label tabIndex={0} className="btn btn-xs m-1 normal-case">
                    Options
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <a
                        onClick={() => {
                          deletePost(post.id);
                        }}
                      >
                        {" "}
                        Delete{" "}
                      </a>
                    </li>
                    <li>
                      <a>Edit</a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* ------------------------------------------------- */}

              <div className="card-body">
                <h2 className="card-title">{post.title}</h2>
                <p>{post.body}</p>
              </div>
              <figure>
                <img
                  src={
                    post.media
                      ? post.media
                      : require("../assets/banner_place_hold.png")
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

        <div className="flex flex-col items-center p-0">
          <div className="flex flex-col items-center gap-10">
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
                            : require("../assets/profile_picture_placeholder.jpg")
                        }
                        alt="Profile avatar image"
                      />
                    </div>
                  </div>
                  <div className="shrink, grow-0">
                    <h3 className="font-bold text-color__hover">
                      <a
                        href="/user-profile"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/user-profile", {
                            state: {
                              profileName: follower.name,
                              profileAvatar: follower.avatar,
                            },
                          });
                          //console.log("I am clicked");
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

          <div className="flex flex-col items-center gap-10">
            <div>
              {" "}
              <h2 className="font-bold">
                {" "}
                You follow{" "}
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
                            : require("../assets/profile_picture_placeholder.jpg")
                        }
                        alt="Profile avatar image"
                      />
                    </div>
                  </div>
                  <div className="shrink, grow-0">
                    <h3 className="font-bold text-color__hover">
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/user-profile", {
                            state: {
                              profileName: follower.name,
                              profileAvatar: follower.avatar,
                            },
                          });
                          //console.log("I am clicked");
                        }}
                      >
                        {follower.name}
                      </a>
                    </h3>
                    <p>Student at Noroff | Oslo</p>
                    <p className="text-sm pt-1 font-bold"> </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
