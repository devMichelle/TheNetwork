import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useRef, useContext } from "react";

const API_LOGIN = "https://api.noroff.dev/api/v1/social/auth/login";

type Props = {};

export default function Login({}: Props) {
  const navigate = useNavigate();

  const loginButtonSpinnerRef = useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState({
    loginEmail: "",
    loginPassword: "",
  });

  const { loginEmail, loginPassword } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Start spinner by adding a className "loading"
    loginButtonSpinnerRef.current?.classList.add("loading");

    const loginData = {
      email: loginEmail,
      password: loginPassword,
    };

    //Initiate login

    try {
      const response = await axios.post(API_LOGIN, loginData);

      if (response.data) {
        console.log(response.data);

        localStorage.setItem("userData", JSON.stringify(response.data));
        loginButtonSpinnerRef.current?.classList.remove("loading");
        //Navigate to profile page
        navigate("/view-all-posts");
      }
    } catch (error: any) {
      const errorMessage = error.response.data.errors;
      errorMessage.map((e: any) => toast.error(e.message));
      // Remove loading spinner
      loginButtonSpinnerRef.current?.classList.remove("loading");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="email"
            className="input input-bordered"
            required
            id="loginEmail"
            name="email"
            onChange={onChange}
            value={loginEmail}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="password"
            className="input input-bordered"
            onChange={onChange}
            required
            id="loginPassword"
            name="password"
            value={loginPassword}
          />
          <label className="label">
            <a href="#" className="label-text-alt link link-hover">
              Forgot password?
            </a>
          </label>
        </div>
        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn btn-the-network"
            ref={loginButtonSpinnerRef}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
