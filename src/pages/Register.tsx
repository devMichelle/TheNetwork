import axios from "axios";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

const API = "https://api.noroff.dev/api/v1/social/auth/register";

type Props = {};

export default function Register({}: Props) {
  const submitButtonSpinnerRef = useRef<HTMLButtonElement>(null);
  const hideModalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { firstName, lastName, email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Start spinner by adding a className "loading"
    submitButtonSpinnerRef.current?.classList.add("loading");

    const userName: String = `${firstName}_${lastName}`;
    const userData = {
      name: userName,
      email: email,
      password: password,
    };

    //Initiate registration

    try {
      const response = await axios.post(API, userData);

      if (response.data) {
        console.log(response.data);
        toast.success("Registration successfull😊. You may login");
        hideModalRef.current?.classList.add("hidden");
      }
    } catch (error: any) {
      const errorMessage = error.response.data.errors;
      errorMessage.map((e: any) => toast.error(e.message));
      // Remove loading spinner
      submitButtonSpinnerRef.current?.classList.remove("loading");
    }
  };

  return (
    <>
      <div className="form-control " ref={hideModalRef}>
        {/* The button to open modal */}
        <label htmlFor="my-modal-3" className="btn btn-ghost normal-case">
          Not a member? Register
        </label>
        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box relative">
            <label
              htmlFor="my-modal-3"
              className="color__hover btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>

            <h3 className="mb-2 text-lg font-bold">Sign Up</h3>

            {/* Register form */}
            <form onSubmit={onSubmit}>
              <div className="mx-auto">
                <div className="flex space-x-4 item-justify justify-between mt-10">
                  <div>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      required
                      className="input input-bordered w-full max-w-xs"
                      onChange={onChange}
                      value={firstName}
                    />
                  </div>
                  <div>
                    <input
                      id="lastName"
                      type="text"
                      required
                      placeholder="Last Name"
                      className="input input-bordered w-full max-w-xs"
                      onChange={onChange}
                      value={lastName}
                    />
                  </div>
                </div>
                <div className="mt-5 w-full">
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Email"
                    className="input input-bordered w-full "
                    onChange={onChange}
                    value={email}
                  />
                </div>
                <div className="mt-5 w-full">
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="New password"
                    className="input input-bordered w-full "
                    onChange={onChange}
                    value={password}
                  />
                </div>
                <div className="form-control mt-10 mb-8">
                  <button
                    className="btn btn-the-network  normal-case"
                    ref={submitButtonSpinnerRef}
                  >
                    Register
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
