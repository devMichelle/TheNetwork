import { BsPlusCircle } from "react-icons/bs";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


type Props = {
  title: string;
  token?: string;
};

const Navbar = ({ title, token }: Props) => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear();
    toast.success("You have been Successfully logged out");
    navigate("/");
  };

  return (
    <>
      <div className="the-network-bg">
        <div className="navbar flex justify-between md:justify-evenly lg:justify-evenly md:gap-80 ">
          <div className="">
            <button type="button" onClick={() => {navigate("/profile");}} className=" normal-case text-xl ">{title}</button>
          </div>

          {/* <!-- Right Buttons Menu --> */}

          {token && (
            <div className="space-x-4 md:w-180 lg:mb-0">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <BsPlusCircle size={35} />
                </label>
                <div
                  tabIndex={0}
                  className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow"
                >
                  <div className="card-body">
                    <button className="font-bold text-lg" onClick={() => {navigate("/add-post");}}>Add Post <span className="badge">New</span></button>
                    
                  </div>
                  <div className="card-body">
                    <button className="font-bold text-lg" onClick={() => {navigate("/find-connections");}}>Find Connections</button>
                    
                  </div>
                </div>
              </div>
            
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
