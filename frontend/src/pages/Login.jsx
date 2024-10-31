import { React, useState } from '../utils/Imports';

const Login = () => {

    const [isRegistered, setIsRegistered] = useState(true);
    // const [isSigninValid, setIsSigninValid] = useState(false);
    // const [isSignupValid, setIsSignupValid] = useState(false);
    const [errLoginMail, setErrLoginMail] = useState(false);
    const [errSignupMail, setErrSignupMail] = useState(false);
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
        if(signinvalidate() === true){
            console.log(loginInput);
        }
        else {
            console.log("Ane api iwarai aiye");
        }
    }

    const signinvalidate = () => {
        if(loginInput.email.trim()===''|| loginInput.password.trim()===''){
            return false;
        }
        else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(loginInput.email)){
            return true;
        }
        else {
            return false;
        }
    }

    const signup = (event) => {
        event.preventDefault();
        if(signupvalidate() === true){
            console.log(signupInput);
        }
        else {
            console.log("kawada bn");
        }
        
    }

    const signupvalidate = () => {
        if(signupInput.email.trim()===''|| signupInput.password.trim()==='' || signupInput.firstName.trim()==='' || signupInput.lastName.trim()==='' || signupInput.contactNumber.trim()==='' || signupInput.address.trim()===''){
            return false;
        }
        else if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(signupInput.email))){
            return false;
        }
        else if (!(/^[a-zA-Z]*$/.test(signupInput.firstName)) || !(/^[a-zA-Z]*$/.test(signupInput.lastName)) || !(/^(0\d{9})$/.test(signupInput.contactNumber))){
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
        setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
    }

    return (
        <div className="flex h-[92vh]" style={{ backgroundColor: '#F6F6F6' }}>
            <div className={`rounded shadow-md drop-shadow-xl m-auto bg-white p-4 h-[50vh] w-[28rem] ${isRegistered ? "flex" : "hidden"}`}>
                <form onSubmit={signin} className="my-auto w-full">
                    <label>Email
                        <input type="text" name='email' onChange={handleLoginInput} className="w-full border h-[6vh]" required placeholder="Enter your email" />
                        {errLoginMail ? (
                            <p className='text-red-600'>Input a valid email. Example: this@mail.com</p>
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


            <div className={`rounded shadow-md drop-shadow-xl m-auto bg-white p-4 h-[90vh] w-[28rem] ${isRegistered ? "hidden" : "flex"}`}>
                <form onSubmit={signup} className="my-auto w-full">
                    <div>
                        <label>First Name
                            <input type="text" name='firstName' onChange={handleSignupInput} className="w-full border h-[6vh]" required placeholder="Enter your First Name" />
                        </label>
                    </div>
                    <div className="mt-5">
                        <label>Last Name
                            <input type="text" name='lastName' onChange={handleSignupInput} className="w-full border h-[6vh]" required placeholder="Enter your Last Name" />
                        </label>
                    </div>
                    <div className="mt-5">
                        <label>Email
                            <input type="text" name='email' onChange={handleSignupInput} className="w-full border h-[6vh]" required placeholder="Enter your email" />
                        </label>
                    </div>
                    <div className="mt-5">
                        <label>
                            Password
                            <input type="password" name='password' onChange={handleSignupInput} className="w-full border h-[6vh]" placeholder="Enter your password" required />
                        </label>
                    </div>
                    <div className="mt-5">
                        <label>Contact Number
                            <input type="text" name='contactNumber' onChange={handleSignupInput} className="w-full border h-[6vh]" required placeholder="Enter your contact number" />
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