import Navbar from "./Navbar";
import { useAuthContext } from "../context/AuthProvider";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useConnectionsContext } from "../context/ConnectionsProvider";
import { useEffect, useState } from "react";

const connectString = {
  connection: " Connection",
  connections: " Connections",
};

type connectionDataType = {
  name: string;
  avatar: string;
  _count: {
    followers: Number;
    following: Number;
  };
};

const FindConnetions = () => {
  const { token } = useAuthContext();
  const { fetchConnectionsData } = useConnectionsContext();
  const [connectionsData, setConnectionsData] = useState([
    {
      name: "",
      avatar: "",
      banner: "",
      _count: { followers: 0, following: 0 },
    },
  ]);

  const navigate = useNavigate();

  const PROFILE_API = axios.create({
    baseURL: "https://api.noroff.dev/api/v1/social/profiles/",
    headers: { Authorization: `Bearer ${token}` },
  });

  const getConnectionsData = async () => {
    try {
      const response = await PROFILE_API.get("");
      console.log("Fetched Data In Find Connection");
      console.log(response.data);
      setConnectionsData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getConnectionsData();
  }, [token]);

  //Get Following Connections
  // const getFollowingConnections = async () => {

  //   try {

  //     const getAllConnectionResponse = await PROFILE_API.get(
  //       `${userData.name}?_following=true&_followers=true`
  //     );

  //   } catch (error) {
  //     console.log("Errors from Get Following Connections")
  //     console.log(error)
  //   }
  // }
  //Get Profile

  return (
    <>
      <Navbar title="TheNetWork" token={token} />
      <div className="flex flex-col gap-5 md:flex-row  justify-center md:gap-10 lg:gap-10 shrink-0  mx-10 mt-20">
        <div className="flex flex-col gap-10 ">
          {connectionsData.map((profile, index) => (
            <div
              key={index}
              className="flex space-x-10 hover:bg-slate-200 rounded-md px-10 py-2 hover:shadow"
            >
              <div className="flex gap-5">
                <div className="avatar placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                    <img
                      src={
                        profile.avatar
                          ? profile.avatar
                          : require("../assets/profile_picture_placeholder.jpg")
                      }
                      alt="Profile Avatar image"
                    />
                  </div>
                </div>
                <div className="shrink, grow-0">
                  {/* <h3 className="font-bold"> */}
                  <a
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/user-profile", {
                        state: {
                          profileName: profile.name,
                          profileAvatar: profile.avatar,
                          profileBanner: profile.banner,
                        },
                      });
                      console.log("I am clicked");
                    }}
                  >
                    <h3 className="font-bold text-color__hover">
                      {" "}
                      {profile.name}{" "}
                    </h3>

                    {/* <h3 className="font-bold"><Link to="/user-profile" state={profile.name}> {profile.name} </Link></h3> */}
                    <p>Student at Noroff | Oslo</p>
                    <p className=" text-sm pt-1 font-bold">
                      {profile._count.followers <= 0 ||
                      profile._count.followers <= 1
                        ? profile._count.followers + connectString.connection
                        : profile._count.followers + connectString.connections}
                    </p>
                  </a>
                </div>
              </div>
              <div className="hidden">follow button</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FindConnetions;
