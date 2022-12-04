import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";
import Navbar from "../Navbar";

type Props = {};

type UserDataType = {
  name: string;
  email: string;
  avatar: string;
  banner: string;
  accessToken: string;
};

const UserSinglePost = (props: Props) => {
  const { userData, token } = useAuthContext();

  const PROFILE_API = axios.create({
    baseURL: "https://api.noroff.dev/api/v1/social/posts/",
    headers: { Authorization: `Bearer ${token}` },
  });

  const navigate = useNavigate();

  const [singlePostDetails, setSinglePostDetails] = useState({
    id: 0,
    author: {
      name: "",
      avatar: "",
      banner: "",
      email: "",
    },

    title: "",
    body: "",
    media: "",
    reactions: [
      {
        symbol: "",
        count: 0,
        postId: 0,
        message: "",
      },
    ],
    comments: [
      {
        body: "",
        replyToId: 0,
        id: 0,
        postId: 0,
        owner: "",
        author: {
          name: "",
          email: "",
          avatar: "",
        },
      },
    ],
  });

  const location = useLocation();
  const { postId, commentCount, postReactionCount, data } = location.state;
  const [localUserData, setLocalUserData] = useState<UserDataType>();
  const [replyToNumber, setReplyToNumber] = useState<Number>();
  const [count, setSetCount] = useState({ _count: { reactions: 0 } });
  const removeHiddenClass = useRef();

  const [responseDataForCommenting, setResponseDataForCommenting] = useState({
    body: "",
    replyToId: 0,
    id: 0,
    owner: "",
    author: {
      name: "",
      avatar: "",
    },
  });

  const SavedPostId = postId;
  const savedPostCommentCount = commentCount;
  const savedPostReactionCount = postReactionCount;

  //..................Reactions........................................................//

  // const emojiSymbols = {
  //   satisfaction: "👍",
  //   love: "❤️",
  //   happy: "😄",
  //   surprise: "🎉",
  //   angry: "😕",
  //   sad: "👎",
  // };

  // const reaction = async (symbol: string, postId: number) => {
  //   console.log(symbol);
  //   try {
  //     const response = await PROFILE_API.put(`${postId}/react/${symbol}`);
  //     setSetCount(response.data);
  //     window.location.reload();
  //     console.log("Reacting");
  //     console.log(response.data);

  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //...................Get Connection Followers and Following..........................

  const getSinglePostDetails = async () => {
    try {
      const response = await PROFILE_API.get(
        `${SavedPostId}?_author=true&_comments=true&_reactions=true`
      );

      // console.log("Fetching...Post Details");
      // console.log(response.data);

      setSinglePostDetails(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  //...................Handling Comments..........................

  const onSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const commentData = {
      body: data.comment,
    };

    try {
      const response = await PROFILE_API.post(
        `${SavedPostId}/comment`,
        commentData
      );
      //console.log("Start Commenting.....");

      setResponseDataForCommenting(response.data);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const onReplyComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const commentData = {
      body: data.replyTo,
      replyToId: replyToNumber,
    };

    try {
      const response = await PROFILE_API.post(
        `${SavedPostId}/comment`,
        commentData
      );
      console.log("Start Replying Comment.....");
      setResponseDataForCommenting(response.data);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  console.log();
  useEffect(() => {
    const savedUserData = JSON.parse(localStorage.getItem("userData") || "");
    setLocalUserData(savedUserData);

    getSinglePostDetails();
  }, [token]);

  console.log("ReplyTo");
  console.log(singlePostDetails.comments);

  return (
    <>
      <Navbar title="TheNetWork" token={token} avatar={localUserData?.avatar} />

      {/* Post card section*/}

      <div className="hero">
        <div className="relative hero-content flex-col lg:flex-row gap-x-72 border-b border-gray-300  ">
          <img
            src={
              singlePostDetails.author.banner
                ? singlePostDetails.author.banner
                : require("../../assets/banner_place_hold.png")
            }
            className="max-w-sm w-80 rounded-lg shadow-2xl"
          />

          <div className="absolute avatar flex-initial bottom-56 md:bottom-40 lg:left-60 lg:bottom-14">
            <div className="w-40 rounded-lg">
              <img
                className="w-64 h-64 rounded-full absolute"
                src={
                  singlePostDetails.author.avatar
                    ? singlePostDetails.author.avatar
                    : require("../../assets/profile_picture_placeholder.jpg")
                }
                alt="User avatar image"
              />
            </div>
          </div>
          <div className="mt-3 lg:mt-80 text-center">
            <h1 className="text-2xl font-bold ">
              {singlePostDetails.author.name}
            </h1>
            <p className="py-6">Student at Noroff | Oslo</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate("/user-profile", {
                  state: {
                    profileName: singlePostDetails.author.name,
                    profileAvatar: singlePostDetails.author.avatar,
                    profileBanner: singlePostDetails.author.banner,
                  },
                });
              }}
              className="btn btn-xs normal-case color__hover"
            >
              Go to profile
            </button>
          </div>
        </div>
      </div>

      {/* <!-- post card -->  */}

      <div className=" flex flex-col md:flex-col gap-10  my-12 mx-auto container  items-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{singlePostDetails.title}</h2>
            <p>{singlePostDetails.body}</p>
          </div>
          <figure>
            <img
              src={
                singlePostDetails.media
                  ? singlePostDetails.media
                  : require("../../assets/banner_place_hold.png")
              }
              alt="Post media"
            />
          </figure>
          <div className="flex justify-between  my-10 px-10 gap-5"></div>
        </div>
      </div>

      {/* <!-- post card -->  */}
      {/* <div className="flex bg-white shadow-md rounded-lg mx-4 md:mx-auto my-20 max-w-md md:max-w-2xl ">
        <div className="flex items-start px-4 py-6">
          <img
            className="w-12 h-12 rounded-full object-cover mr-4 shadow"
            src={
              singlePostDetails.author.avatar
                ? singlePostDetails.author.avatar
                : require("../../assets/blank-profile-pic.webp")
            }
            alt="avatar"
          />
          <div className="">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 -mt-1">
                {singlePostDetails.title}{" "}
              </h2>
              <small className="text-sm text-gray-700 hidden">22h ago</small>
            </div>
            <p className="text-gray-700 hidden">Joined 12 SEP 2012. </p>
            <p className="mt-3 text-gray-700 text-sm">
              {singlePostDetails.body}
            </p>
            <div className="mt-4 flex items-center">
              <div className=" hidden flex mr-2 text-gray-700 text-sm mr-3">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 mr-1"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{savedPostReactionCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Comment section */}

      <section className="bg-white dark:bg-gray-900 py-5 lg:py-5">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
              Discussion
            </h2>
          </div>
          <form onSubmit={onSubmitComment} className="mb-6">
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <label htmlFor="comment" className="sr-only">
                Write your comment
              </label>
              <textarea
                id="comment"
                rows={1}
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..."
                required
                name="comment"
              ></textarea>
            </div>
            <button
              type="submit"
              className="color__hover inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white  bg-slate-900 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            >
              Post comment
            </button>
          </form>

          {/*<!-- first comment --> */}

          {singlePostDetails.comments.map((comment) => (
            <article className="p-6  text-base bg-white rounded-lg dark:bg-gray-900">
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                    <img
                      className="mr-2 w-12 h-12 rounded-full"
                      src={
                        comment.author.avatar
                          ? comment.author.avatar
                          : require("../../assets/profile_picture_placeholder.jpg")
                      }
                      alt={comment.author.name}
                    />
                    {comment.author.name}
                  </p>
                </div>

                {/*<!-- Dropdown menu first comment --> */}

                {comment.owner == localUserData?.name ? (
                  <div className="dropdown dropdown-left dropdown-end">
                    <label tabIndex={0} className=" m-1">
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      </svg>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow  rounded-box w-52"
                    >
                      <li>
                        <a>Edit</a>
                      </li>
                      <li>
                        <a
                          onClick={async () => {
                            try {
                              const response = await PROFILE_API.delete(
                                `${comment.postId}`
                              );
                            } catch (error) {
                              console.log(error);
                            }
                          }}
                        >
                          Delete
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  ""
                )}
              </footer>

              <p className="text-gray-500 dark:text-gray-400">{comment.body}</p>

              <div className="flex items-center mt-4 space-x-4">
                <label
                  htmlFor="my-modal-3"
                  className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
                  onClick={() => {
                    setReplyToNumber(comment.replyToId);
                  }}
                >
                  <svg
                    aria-hidden="true"
                    className="mr-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                  Reply
                </label>
              </div>

              {comment.replyToId && comment.postId ? (
                <article className="p-6 mb-6 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900">
                  <footer className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                        <img
                          className="mr-2 w-6 h-6 rounded-full"
                          src={
                            comment.author.avatar
                              ? comment.author.avatar
                              : require("../../assets/profile_picture_placeholder.jpg")
                          }
                        />
                        <p className="text-gray-500 dark:text-gray-400">
                          {comment.body}
                        </p>
                      </p>
                    </div>
                    {/* <div
                      id="dropdownComment2"
                      className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                    >
                      <ul
                        className="py-1 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownMenuIconHorizontalButton"
                      >
                        <li>
                          <a
                            href="#"
                            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Remove
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Report
                          </a>
                        </li>
                      </ul>
                    </div> */}
                  </footer>

                  <p className="text-gray-500 dark:text-gray-400">
                    {comment.body}
                  </p>
                  <div className="flex items-center mt-4 space-x-4">
                    <label
                      htmlFor="my-modal-3"
                      className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
                      onClick={() => {
                        setReplyToNumber(comment.replyToId);
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        className="mr-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        ></path>
                      </svg>
                      Reply
                    </label>
                  </div>
                </article>
              ) : (
                ""
              )}
            </article>
          ))}
        </div>
        {/* Put this part before </body> tag */}

        {/* Reply to comment modal*/}

        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box relative">
            <label
              htmlFor="my-modal-3"
              className=" color__hover btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>
            <h3 className="text-lg font-bold">Reply to comment</h3>

            <form onSubmit={onReplyComment} className="my-6 py-4 ">
              <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <label htmlFor="comment" className="sr-only">
                  Your comment
                </label>
                <textarea
                  id="replyTo"
                  rows={2}
                  className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                  placeholder="Write a reply comment..."
                  required
                  name="replyTo"
                ></textarea>
              </div>
              <button
                type="submit"
                className="color__hover inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white  bg-slate-900 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
              >
                Post comment
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserSinglePost;
