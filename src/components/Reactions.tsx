import React, { useState } from "react";
import { GithubSelector } from "@charkour/react-reactions";
import { useAuthContext } from "../context/AuthProvider";
import axios from "axios";

type Props = {
  //reactionCount: any;
  //commentCount: any;
  postId: Number;
  fetchPostsByConnection?: (token: string, profileName: string) => void;
};

const Reactions = (props: Props) => {
  const { token } = useAuthContext();
  const [update, setUpdate] = useState<Boolean>(false);

  const PROFILE_API = axios.create({
    baseURL: "https://api.noroff.dev/api/v1/social/posts/",
    headers: { Authorization: `Bearer ${token}` },
  });

  const reactToEntry = async (reactionSymbol: string) => {
    try {
      const response = await PROFILE_API.put(
        `${props.postId}/react/${reactionSymbol}`
      );
      // console.log("Reacting", response.data);
    } catch (error) {
      //console.log(error);
    }
  };

  React.useEffect(() => {
    // console.log("I run only if toggle changes (and on mount).", update);
  }, [update]);

  return (
    <>
      <div className="flex justify-center mt-2 space-x-20 bg-white  flex-shrink box-shadow ">
        <GithubSelector
          onSelect={(reaction) => {
            setUpdate(!update);
            //console.log(reaction);

            reactToEntry(reaction);
            window.location.reload();
          }}
        />
      </div>
    </>
  );
};

export default Reactions;
