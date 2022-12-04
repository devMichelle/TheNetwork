import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Login from "./Login";
import Register from "./Register";



export const Home: React.FC = () => {
  return (
    <>

    <div className=" flex justify-center container md:justify-center mt-12 mx-auto lg:justify-center " >
    <div><img src={ require("../assets/logo.png")} /></div>
    </div>
      {/* <!-- Hero Section --> */}
      <section id="hero the-network-bg ">
        {/* <!-- Hero Container --> */}
        <div className="container  mx-auto p-6 lg:flex-col mt-20">
    
          {/* <!-- Content Container --> */}

          <div className="mb-24 w-full md:mt-10 mx-auto md:w-180 lg:mb-0 lg:w-1/3">
            <div className="card mx-auto flex-shrink-0 w-full max-w-sm shadow-2xl">
            
              <div className="card-body">
                {/* Login Component */}
                <Login />
                {/* Register Component */}
                <Register />
              </div>
            </div>
          </div>
        </div>
      </section>
     
    </>
  );
};

export default Home;
