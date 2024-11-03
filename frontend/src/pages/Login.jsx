import { React, useState } from '../utils/Imports';
import axios from "axios";

const Login = () => {

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
    const [loginInput, setLoginInput] = useState({
        email: '',
        password: ''
    })

    const [signupInput, setSignupInput] = useState({
        firstName: '',
        lastName: '',
        address: '',
        contactNumber: '',
        email: '',
        password: ''
    })

    const signin = (event) => {
        event.preventDefault();
        if (signinvalidate() === true) {
            console.log(loginInput);
        }
        else {
            console.log("Ane api iwarai aiye");
        }
    }

    const signinvalidate = () => {
        if (loginInput.email.trim() === '' || loginInput.password.trim() === '') {
            return false;
        }
        else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(loginInput.email)) {
            return true;
        }
        else {
            return false;
        }
    }



    const signup = async (event) => {
        event.preventDefault();
        if (signupvalidate() === true) {

            console.log("ela")

            const data = {
                firstName: signupInput.firstName,
                lastName: signupInput.lastName,
                email: signupInput.email,
                hashedpassword: signupInput.password,
                contactNumber: signupInput.contactNumber,
                address: signupInput.address,
                isActive: true
            };

            try {
                const response = await fetch('https://localhost:7163/api/User', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    console.log("Hammata me badu shokne")
                    const result = await response.json();
                    console.log(result);
                } else {
                    console.log("Ane aiye api iwarai")
                    const errorData = await response.text();
                    console.log("Error details:", errorData);
                }
            } catch (error) {
                console.log("Error registering user data:", error);
            }
        }
        else {
            console.log("validation error");
        }

    }

    const signupvalidate = () => {

        if (signupInput.contactNumber.trim() === '' || signupInput.lastName.trim() === '' || signupInput.firstName.trim() === '' || signupInput.password.trim() === '' || signupInput.email.trim() === '') {
            console.log("ela4")
            return false;
        }

        else if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(signupInput.email))) {
            console.log("ela2")
            return false;
        }
        else if (signupInput.address.trim() === '') {
            console.log("ela5")
            return false;
        }
        else if (!(/^[a-zA-Z]*$/.test(signupInput.firstName)) || !(/^[a-zA-Z]*$/.test(signupInput.lastName)) || !(/^(0\d{9})$/.test(signupInput.contactNumber))) {
            console.log("ela3")
            return false;
        }
        else {
            return true
        }
    }

    const handleLoginInput = (e) => {
        if (e.target.name === 'password') {
            setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
        }
        else if (e.target.name === 'email') {
            if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value)) {
                setErrLoginMail(false);
                setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
            }
            else {
                setLoginInput({ ...loginInput, [e.target.name]: '' });
                setErrLoginMail(true);
            }
        }
    }

    const handleSignupInput = (e) => {
        if (e.target.name === 'email') {
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value)) {
                setSignupInput({ ...signupInput, [e.target.name]: '' })
                setErrSignupMail(true);
            }
            else {
                setErrSignupMail(false);
                setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
            }
        } else if (e.target.name === 'password') {
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(e.target.value)) {
                setSignupInput({ ...signupInput, [e.target.name]: '' })
                setPasswordErr('Password should contain at least one lowercase letter, one uppercase letter, one digit, and one special character.');
                setErrSignupPassword(true);
            }
            else {
                setErrSignupPassword(false);
                setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
            }
        } else if (e.target.name === 'contactNumber') {
            if (!(/^(\d+)$/.test(e.target.value))) {
                setSignupInput({ ...signupInput, [e.target.name]: '' })
                setContactErr('Phone number must contain only numbers')
                setErrSignupContact(true);
            }
            else if (!(/^(0\d{9})$/.test(e.target.value))) {
                setSignupInput({ ...signupInput, [e.target.name]: '' })
                setContactErr('Phone number must be 10 digits and start with 0')
                setErrSignupContact(true);
            }
            else {
                setErrSignupContact(false);
                setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
            }
        } else if (e.target.name === 'firstName') {
            if (!(/^[a-zA-Z]*$/.test(e.target.value))) {
                setSignupInput({ ...signupInput, [e.target.name]: '' })
                setFirstNameErr('Name must only contain letters from A to Z')
                setErrSignupFirstName(true);
            } else {
                setErrSignupFirstName(false);
                setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
            }
        } else if (e.target.name === 'lastName') {
            if (!(/^[a-zA-Z]*$/.test(e.target.value))) {
                setSignupInput({ ...signupInput, [e.target.name]: '' })
                setLastNameErr('Name must only contain letters from A to Z')
                setErrSignupLastName(true);
            } else {
                setErrSignupLastName(false);
                setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
            }
        } else if (e.target.name === 'address') {
            setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
        }
    }

    return (
        <div className="flex overflow-auto h-[92vh]" style={{ backgroundColor: '#F6F6F6' }}>
            <div className={`rounded shadow-md drop-shadow-xl m-auto bg-white p-4 h-[50vh] w-[28rem] ${isRegistered ? "flex" : "hidden"}`}>
                <form onSubmit={signin} className="my-auto w-full">
                    <label>Email
                        <input type="text" name='email' onChange={handleLoginInput} className="w-full border h-[6vh]" required placeholder="Enter your email" />
                        {errLoginMail ? (
                            <p className='text-red-600 text-xs'>Input a valid email. Example: this@mail.com</p>
                        ) : ''}
                    </label>
                    <div className="mt-6">
                        <label>
                            Password
                            <input type="password" name='password' onChange={handleLoginInput} className="w-full border h-[6vh]" placeholder="Enter your password" required />
                        </label>
                    </div>
                    <button type='submit' className="w-full bg-yellow-600 h-[5vh] mt-6 text-stone-100 font-medium rounded">Login</button>
                    <p className="text-sky-500 mt-6">Forgot password?</p>
                    <p>Don't have an account? <span className="text-sky-600 mt-2 cursor-pointer" onClick={() => setIsRegistered(false)}>Signup</span></p>
                </form>
            </div>


            <div className={`rounded shadow-md drop-shadow-xl m-auto bg-white p-4 min-h-[90vh] w-[28rem] ${isRegistered ? "hidden" : "flex"}`}>
                <form onSubmit={signup} className="my-auto w-full">
                    <div>
                        <label>First Name
                            <input type="text" name='firstName' onChange={handleSignupInput} className="w-full border h-[6vh]" required placeholder="Enter your First Name" />
                            {errSignupFirstName ? (
                                <p className='text-red-600 text-xs'>{(firstNameErr)}</p>
                            ) : ''}
                        </label>
                    </div>
                    <div className="mt-5">
                        <label>Last Name
                            <input type="text" name='lastName' onChange={handleSignupInput} className="w-full border h-[6vh]" required placeholder="Enter your Last Name" />
                            {errSignupLastName ? (
                                <p className='text-red-600 text-xs'>{(lastNameErr)}</p>
                            ) : ''}
                        </label>
                    </div>
                    <div className="mt-5">
                        <label>Email
                            <input type="text" name='email' onChange={handleSignupInput} className="w-full border h-[6vh]" required placeholder="Enter your email" />
                            {errSignupMail ? (
                                <p className='text-red-600 text-xs'>Input a valid email. Example: this@mail.com</p>
                            ) : ''}
                        </label>
                    </div>
                    <div className="mt-5">
                        <label>
                            Password
                            <input type="password" name='password' onChange={handleSignupInput} className="w-full border h-[6vh]" placeholder="Enter your password" required />
                            {errSignupPassword ? (
                                <p className='text-red-600 text-xs'>{(passwordErr)}</p>
                            ) : ''}
                        </label>
                    </div>
                    <div className="mt-5">
                        <label>Contact Number
                            <input type="text" name='contactNumber' onChange={handleSignupInput} className="w-full border h-[6vh]" required placeholder="Enter your contact number" />
                            {errSignupContact ? (
                                <p className='text-red-600 text-xs'>{(contactErr)}</p>
                            ) : ''}
                        </label>
                    </div>
                    <div className="mt-5">
                        <label>Address
                            <input type="text" name='address' onChange={handleSignupInput} className="w-full border h-[6vh]" required placeholder="Enter your Address" />
                        </label>
                    </div>
                    <button type='submit' className="w-full bg-yellow-600 h-[5vh] mt-6 text-stone-100 font-medium rounded">Sign up</button>
                    <p className='mt-2'>Already have an account? <span className="text-sky-600 cursor-pointer" onClick={() => setIsRegistered(true)}>Login</span></p>
                </form>
            </div>
        </div>
    );
};

export default Login;