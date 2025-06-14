import { MdError } from "react-icons/md";
import { React, useState, axios } from "../utils/Imports";
import { useNavigate } from "react-router-dom";
import { TiTick } from "react-icons/ti";

const Login = () => {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(true);
  const [errLoginMail, setErrLoginMail] = useState(false);
  const [errSignupMail, setErrSignupMail] = useState(false);
  const [contactErr, setContactErr] = useState();
  const [errSignupContact, setErrSignupContact] = useState(false);
  const [firstNameErr, setFirstNameErr] = useState();
  const [errSignupFirstName, setErrSignupFirstName] = useState(false);
  const [lastNameErr, setLastNameErr] = useState();
  const [errSignupLastName, setErrSignupLastName] = useState(false);
  const [passwordErr, setPasswordErr] = useState();
  const [errSignupPassword, setErrSignupPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [signupInput, setSignupInput] = useState({
    firstName: "",
    lastName: "",
    address: "",
    contactNumber: "",
    email: "",
    password: "",
  });

  axios.defaults.withCredentials = true;

  const displayAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  const signin = async (event) => {
    event.preventDefault();
    if (signinvalidate() === true) {
      setIsLoading(true);

      try {
        const response = await axios.post(`api/Auth/login`, {
          email: loginInput.email,
          password: loginInput.password,
        });

        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));

        displayAlert("Login successful! Redirecting...", "success");

        const userRole = response.data.user.role;
        setTimeout(() => {
          switch (userRole) {
            case "Admin":
              navigate("/admsidebar");
              break;
            case "Customer":
              navigate("/menu");
              break;
            default:
              navigate("/menu");
          }
        }, 1000);
      } catch (error) {
        if (error.response) {
          const errorMessage =
            error.response.data.message ||
            "Invalid credentials. Please try again.";
          displayAlert(errorMessage, "error");
        } else if (error.request) {
          displayAlert(
            "No response from server. Please check your connection.",
            "error"
          );
        } else {
          displayAlert("Error setting up request. Please try again.", "error");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      displayAlert("Please check your email and password", "error");
    }
  };

  const signinvalidate = () => {
    if (loginInput.email.trim() === "" || loginInput.password.trim() === "") {
      return false;
    } else if (
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(loginInput.email)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const signup = async (event) => {
    event.preventDefault();
    if (signupvalidate() === true) {
      setIsLoading(true);

      const data = {
        firstName: signupInput.firstName,
        lastName: signupInput.lastName,
        email: signupInput.email,
        password: signupInput.password,
        contactNumber: signupInput.contactNumber,
        address: signupInput.address,
        role: "Customer",
        isActive: true,
      };

      try {
        const response = await fetch(`/api/Users`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          displayAlert(
            "Registration successful! You can now login.",
            "success"
          );
          setIsRegistered(true);
        } else {
          displayAlert("Registration failed. Please try again.", "error");
        }
      } catch (error) {
        console.log("Error registering user data:", error);
      }
      setIsLoading(false);
    } else {
      console.log("validation error");
    }
  };

  const signupvalidate = () => {
    if (
      signupInput.contactNumber.trim() === "" ||
      signupInput.lastName.trim() === "" ||
      signupInput.firstName.trim() === "" ||
      signupInput.password.trim() === "" ||
      signupInput.email.trim() === ""
    ) {
      return false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        signupInput.email
      )
    ) {
      return false;
    } else if (signupInput.address.trim() === "") {
      return false;
    } else if (
      !/^[a-zA-Z]*$/.test(signupInput.firstName) ||
      !/^[a-zA-Z]*$/.test(signupInput.lastName) ||
      !/^(0\d{9})$/.test(signupInput.contactNumber)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleLoginInput = (e) => {
    if (e.target.name === "password") {
      setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
    } else if (e.target.name === "email") {
      if (
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value)
      ) {
        setErrLoginMail(false);
        setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
      } else {
        setLoginInput({ ...loginInput, [e.target.name]: "" });
        setErrLoginMail(true);
      }
    }
  };

  const handleSignupInput = (e) => {
    if (e.target.name === "email") {
      if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value)
      ) {
        setSignupInput({ ...signupInput, [e.target.name]: "" });
        setErrSignupMail(true);
      } else {
        setErrSignupMail(false);
        setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
      }
    } else if (e.target.name === "password") {
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          e.target.value
        )
      ) {
        setSignupInput({ ...signupInput, [e.target.name]: "" });
        setPasswordErr(
          "Password should contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
        );
        setErrSignupPassword(true);
      } else {
        setErrSignupPassword(false);
        setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
      }
    } else if (e.target.name === "contactNumber") {
      if (!/^(\d+)$/.test(e.target.value)) {
        setSignupInput({ ...signupInput, [e.target.name]: "" });
        setContactErr("Phone number must contain only numbers");
        setErrSignupContact(true);
      } else if (!/^(0\d{9})$/.test(e.target.value)) {
        setSignupInput({ ...signupInput, [e.target.name]: "" });
        setContactErr("Phone number must be 10 digits and start with 0");
        setErrSignupContact(true);
      } else {
        setErrSignupContact(false);
        setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
      }
    } else if (e.target.name === "firstName") {
      if (!/^[a-zA-Z]*$/.test(e.target.value)) {
        setSignupInput({ ...signupInput, [e.target.name]: "" });
        setFirstNameErr("Name must only contain letters from A to Z");
        setErrSignupFirstName(true);
      } else {
        setErrSignupFirstName(false);
        setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
      }
    } else if (e.target.name === "lastName") {
      if (!/^[a-zA-Z]*$/.test(e.target.value)) {
        setSignupInput({ ...signupInput, [e.target.name]: "" });
        setLastNameErr("Name must only contain letters from A to Z");
        setErrSignupLastName(true);
      } else {
        setErrSignupLastName(false);
        setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
      }
    } else if (e.target.name === "address") {
      setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
    }
  };

  const toggleLoginPassword = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  const toggleSignupPassword = () => {
    setShowSignupPassword(!showSignupPassword);
  };

  return (
    <div
      className="flex overflow-auto h-[92vh]"
      style={{ backgroundColor: "#F6F6F6" }}
    >

      {showAlert &&
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all">
            <div className="text-center">
              {alertType === 'error' ? (
                <>
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <MdError className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">ERROR</h3>
                  <div className="mt-2">
                    <p className="text-lg text-gray-500">
                      {alertMessage}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <TiTick className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">SUCCESS</h3>
                  <div className="mt-2">
                    <p className="text-lg text-gray-500">
                      {alertMessage}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      }
      <div
        className={`rounded shadow-md drop-shadow-xl m-auto bg-white p-4 h-[50vh] w-[28rem] ${isRegistered ? "flex" : "hidden"
          }`}
      >
        <form onSubmit={signin} className="my-auto w-full">
          <label>
            Email
            <input
              type="text"
              name="email"
              onChange={handleLoginInput}
              className="w-full border h-[6vh] pl-2"
              required
              placeholder="Enter your email"
            />
            {errLoginMail ? (
              <p className="text-red-600 text-xs">
                Input a valid email. Example: this@mail.com
              </p>
            ) : (
              ""
            )}
          </label>
          <div className="mt-6">
            <label>
              Password
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  name="password"
                  onChange={handleLoginInput}
                  className="w-full border h-[6vh] pl-2"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={toggleLoginPassword}
                >
                  {showLoginPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-600 h-[5vh] mt-6 text-stone-100 font-medium rounded"
          >
            {isLoading ?
              (
                <svg className="animate-spin h-5 w-5 m-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Log in"
              )}
          </button>
          <p className="text-sky-500 mt-6">Forgot password?</p>
          <p>
            Don't have an account?{" "}
            <span
              className="text-sky-600 mt-2 cursor-pointer"
              onClick={() => setIsRegistered(false)}
            >
              Signup
            </span>
          </p>
        </form>
      </div>

      <div
        className={`rounded shadow-md drop-shadow-xl m-auto bg-white p-4 min-h-[90vh] w-[28rem] ${isRegistered ? "hidden" : "flex"
          }`}
      >
        <form onSubmit={signup} className="my-auto w-full">
          <div>
            <label>
              First Name
              <input
                type="text"
                name="firstName"
                onChange={handleSignupInput}
                className="w-full border h-[6vh] pl-2"
                required
                placeholder="Enter your First Name"
              />
              {errSignupFirstName ? (
                <p className="text-red-600 text-xs">{firstNameErr}</p>
              ) : (
                ""
              )}
            </label>
          </div>
          <div className="mt-5">
            <label>
              Last Name
              <input
                type="text"
                name="lastName"
                onChange={handleSignupInput}
                className="w-full border h-[6vh] pl-2"
                required
                placeholder="Enter your Last Name"
              />
              {errSignupLastName ? (
                <p className="text-red-600 text-xs">{lastNameErr}</p>
              ) : (
                ""
              )}
            </label>
          </div>
          <div className="mt-5">
            <label>
              Email
              <input
                type="text"
                name="email"
                onChange={handleSignupInput}
                className="w-full border h-[6vh] pl-2"
                required
                placeholder="Enter your email"
              />
              {errSignupMail ? (
                <p className="text-red-600 text-xs">
                  Input a valid email. Example: this@mail.com
                </p>
              ) : (
                ""
              )}
            </label>
          </div>
          <div className="mt-5">
            <label>
              Password
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  name="password"
                  onChange={handleSignupInput}
                  className="w-full border h-[6vh] pl-2"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={toggleSignupPassword}
                >
                  {showSignupPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {errSignupPassword ? (
                <p className="text-red-600 text-xs">{passwordErr}</p>
              ) : (
                ""
              )}
            </label>
          </div>
          <div className="mt-5">
            <label>
              Contact Number
              <input
                type="text"
                name="contactNumber"
                onChange={handleSignupInput}
                className="w-full border h-[6vh] pl-2"
                required
                placeholder="Enter your contact number"
              />
              {errSignupContact ? (
                <p className="text-red-600 text-xs">{contactErr}</p>
              ) : (
                ""
              )}
            </label>
          </div>
          <div className="mt-5">
            <label>
              Address
              <input
                type="text"
                name="address"
                onChange={handleSignupInput}
                className="w-full border h-[6vh] pl-2"
                required
                placeholder="Enter your Address"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-600 h-[5vh] mt-6 text-stone-100 font-medium rounded"
          >
            {isLoading ?
              (
                <svg className="animate-spin h-5 w-5 m-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Sign up"
              )}
          </button>
          <p className="mt-2">
            Already have an account?{" "}
            <span
              className="text-sky-600 cursor-pointer"
              onClick={() => setIsRegistered(true)}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;