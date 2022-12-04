import { FacebookCounter, FacebookSelector } from "@charkour/react-reactions";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../context/AuthProvider";

type Props = {};

type Connections = {
  name: string;
  banner: String;
  avatar: String;
  followers: [{ name: string; avatar: string }];
  _count: { followers: number; following: number };
};

type UserDataType = {
  name: string;
  email: string;
  avatar: string;
  banner: string;
  accessToken: string;
};

const ViewAllPost = (props: Props) => {
  const { token } = useAuthContext();
  const [userData, setUserData] = useState<UserDataType>();
  const [fetchPostsData, setFetchedPostsData] = useState([
    {
      id: 0,
      reactions: {
        symbol: "",
        count: 0,
        postid: "",
        message: "",
      },
      author: { name: "", avatar: "", banner: "" },
      body: "",
      title: "",
      media: "",
      _count: {
        comments: 0,
        reactions: 0,
      },
    },
  ]);

  const navigate = useNavigate();

  const fetchAllPosts = async () => {
    const PROFILE_API = axios.create({
      baseURL: "https://api.noroff.dev/api/v1/social/",
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      const response = await PROFILE_API.get(
        `posts?_author=true&_comments=true&_reactions=true`
      );
      console.log("Fetching..... UserData");
      console.log(response.data);
      setFetchedPostsData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllPosts();
    const savedUserData = JSON.parse(localStorage.getItem("userData") || "");
    setUserData(savedUserData);
  }, [userData?.accessToken]);

  console.log(fetchPostsData);

  return (
    <>
      <Navbar title="TheNetWork" token={token} avatar={userData?.avatar} />

      {/* Post card section*/}
      <div className="flex flex-col items-center m-auto">
        <div className="flex flex-col gap-10 my-12 mx-2 items-center">
          {fetchPostsData.map((post) => (
            <div key={post.id} className="card md:w-96 bg-base-100 shadow-xl">
              <a
                href=""
                onClick={() => {
                  navigate("/user-profile", {
                    state: {
                      profileName: post.author.name,
                      profileAvatar: post.author.avatar,
                      profileBanner: post.author.banner,
                    },
                  });
                }}
              >
                <div className="flex gap-5 px-8 pt-5 bg-color__hover">
                  <div>
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-14">
                        <span>
                          {" "}
                          <img
                            src={
                              post.author.avatar
                                ? post.author.avatar
                                : require("../assets/profile_picture_placeholder.jpg")
                            }
                            alt="User avatar image"
                          />{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 font-bold">{post.author.name}</div>
                </div>
              </a>

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
                    console.log("I am clicked");
                  }}
                >
                  View and comment
                </button>{" "}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ViewAllPost;
