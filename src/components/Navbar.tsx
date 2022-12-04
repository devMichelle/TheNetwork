import { BsPlusCircle } from "react-icons/bs";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import profilePlaceholder from "../assets/profile_picture_placeholder.jpg";

type Props = {
  title: string;
  avatar?: string;
  token?: string;
  colorClassName?: string;
  topMargin?: string;
};

const Navbar = ({ title, token, avatar, colorClassName, topMargin }: Props) => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear();
    toast.success("You have been Successfully logged out");
    navigate("/");
  };

  return (
    <>
      <header className="the-network-bg shadow-lg">
        <div className="px-2 mx-auto pt-5 pb-3 max-width">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between ">
            <div className="mb-4 lg:mb-0">
              <a
                onClick={() => {
                  navigate("/view-all-posts");
                }}
              >
                {" "}
                <img
                  src={require("../assets/logo.png")}
                  className="w-[120px] mx-auto lg:mr-auto cursor-pointer "
                />
              </a>
            </div>
            <div className="flex flex-wrap items-end justify-between">
              {token && (
                <div className="space-x-4 mb-5 md:w-180 md:mb-5 flex">
                  <div className="pt-2">
                    <button
                      className="btn btn-sm font-bold text-center btn-the-network color__hover"
                      onClick={() => {
                        navigate("/view-all-posts");
                      }}
                    >
                      View all posts
                    </button>
                  </div>
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                      <BsPlusCircle size={35} />
                    </label>
                    <div
                      tabIndex={0}
                      className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow"
                    >
                      <div className="card-body">
                        <button
                          className="font-bold text-lg hover:bg-slate-200 rounded-md py-1"
                          onClick={() => {
                            navigate("/add-post");
                          }}
                        >
                          Add Post{" "}
                        </button>
                      </div>
                      <div className="card-body">
                        <button
                          className="font-bold text-lg hover:bg-slate-200 rounded-md py-1"
                          onClick={() => {
                            navigate("/find-connections");
                          }}
                        >
                          Find Connections
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="dropdown  dropdown-end">
                    <label
                      tabIndex={0}
                      className="btn btn-ghost btn-circle avatar w-10"
                    >
                      <div className="w-10 rounded-full">
                        <img
                          src={
                            avatar
                              ? avatar
                              : require("../assets/profile_picture_placeholder.jpg")
                          }
                        />
                      </div>
                    </label>
                    <ul
                      tabIndex={0}
                      className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <a
                          className="justify-between"
                          onClick={() => {
                            navigate("/profile");
                          }}
                        >
                          My profile
                        </a>
                      </li>

                      <li>
                        <a
                          className="justify-between"
                          onClick={() => {
                            navigate("/edit-profile");
                          }}
                        >
                          Edit Profile
                        </a>
                      </li>

                      <li>
                        <a onClick={handleLogOut}>Logout</a>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
