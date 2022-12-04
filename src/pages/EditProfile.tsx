import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../context/AuthProvider";
import postImageStorage from "../firebase.config";

type Props = {};

const EditProfile = (props: Props) => {
  const { userData, token } = useAuthContext();

  const API_LOGIN = `https://api.noroff.dev/api/v1/social/profiles/${userData.name}/media`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const navigate = useNavigate();

  const postButtonSpinnerRef = useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState({
    bannerURL: "",
  });

  const [bannerURL, setbannerURL] = useState<string>();
  const [avatarURL, setAvatarURL] = useState<string>();

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
              setbannerURL(imageURL);
              console.log("File available at", imageURL);
            });
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUploadAvatarChange = async function (
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
              setAvatarURL(imageURL);
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

  const postData = {
    banner: bannerURL,
    avatar: avatarURL,
  };

  const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const formData = Object.fromEntries(form.entries());
    console.log(formData);

    try {
      postButtonSpinnerRef.current?.classList.add("loading");
      const response = await axios.put(API_LOGIN, postData, { ...options });

      if (response.data) {
        console.log(response.data);
        toast.success("Media Updated Successfully");
        postButtonSpinnerRef.current?.classList.remove("loading");

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
      <Navbar title="TheNetWork" token={token} />

      {/* Add post */}

      <div className=" flex justify-center">
        <div>
          <div className="space-y-10 ">
            <div>
              <h2 className="font-bold text-5xl my-10">Edit Profile</h2>
            </div>
          </div>
          <form className="space-y-10" onSubmit={handleSubmitPost}>
            <div>
              <div className=" mb-2">Choose profile Image</div>
              <input
                type="file"
                id="profile-image"
                name="profile-image"
                onChange={handleUploadAvatarChange}
                className="file-input file-input-bordered file-input-xs w-full max-w-xs"
              />
            </div>

            <div>
              <div className=" mb-2">Choose profile banner</div>
              <input
                id="banner"
                name="banner"
                type="file"
                onChange={handleUploadImageChange}
                className="file-input file-input-bordered file-input-md w-full max-w-xs"
              />
            </div>

            <div>
              <button
                className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg  normal-case color__hover"
                ref={postButtonSpinnerRef}
              >
                Submit update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
