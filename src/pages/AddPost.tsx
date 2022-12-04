import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import postImageStorage from "../firebase.config";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

type Props = {};

const API_LOGIN = "https://api.noroff.dev/api/v1/social/posts";

const AddPost = (props: Props) => {
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    const savedUserData = JSON.parse(localStorage.getItem("userData") || "");
    setAccessToken(savedUserData.accessToken);
  });

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const navigate = useNavigate();

  const postButtonSpinnerRef = useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const [postImageURL, setPostImageURL] = useState<string>();

  const handleUploadImageChange = async function (
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const fileList = e.target.files;

    if (!fileList) {
      toast.error("Select an Image to upload");
    } else {
      try {
        const storageRef = ref(postImageStorage, fileList[0].name);

        const uploadTask = uploadBytesResumable(storageRef, fileList[0]);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((imageURL) => {
              setPostImageURL(imageURL);
              console.log("File available at", imageURL);
            });
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLInputElement
    >
  ) => {
    console.log(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const { title, body } = formData;

  const postData = {
    title,
    body,
    media: postImageURL,
  };

  const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const formData = Object.fromEntries(form.entries());
    console.log(formData);

    try {
      postButtonSpinnerRef.current?.classList.add("loading");
      const response = await axios.post(API_LOGIN, postData, { ...options });

      if (response.data) {
        console.log(response.data);
        toast.success("Post Added Successfully");
        postButtonSpinnerRef.current?.classList.remove("loading");
        setFormData({
          title: "",
          body: "",
        });

        navigate("/profile");
      }
    } catch (error: any) {
      const errorMessage = error.response.data.errors;
      errorMessage.map((e: any) => toast.error(e.message));
      // Remove loading spinner
      postButtonSpinnerRef.current?.classList.remove("loading");
    }
  };

  return (
    <>
      <Navbar title="TheNetWork" token={accessToken} />

      {/* Add post */}

      <div className=" flex justify-center">
        <div>
          <div className="space-y-10 ">
            <div>
              <h2 className="font-bold text-5xl my-10">Add Post</h2>
            </div>
          </div>
          <form className="space-y-10" onSubmit={handleSubmitPost}>
            <div>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Post Title"
                className="input input-bordered input-lg w-full max-w-xs"
                onChange={onChange}
                value={title}
              />
            </div>

            <div>
              <textarea
                rows={5}
                cols={40}
                id="body"
                name="body"
                className=" required: textarea textarea-bordered"
                placeholder="What's on your mind?"
                value={body}
                onChange={onChange}
              ></textarea>
            </div>

            <div>
              <input
                id="file"
                name="file"
                type="file"
                required
                onChange={handleUploadImageChange}
                className="file-input file-input-bordered file-input-md w-full max-w-xs
              "
              />
            </div>

            <div>
              <button
                className="color__hover btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
                ref={postButtonSpinnerRef}
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPost;
