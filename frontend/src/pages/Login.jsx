import React from "react";

const Login = () => {
    return (
        <div className="flex h-[92vh]" style={{backgroundColor: '#F6F6F6'}}>
            <div className="rounded shadow-md drop-shadow-xl m-auto bg-white p-4 h-[50vh] w-[28rem] flex">
                <form action="" className="my-auto w-full">
                    <label>Email
                        <input type="email" className="w-full border h-[6vh]" required placeholder="Enter your email"/>
                    </label>
                    <div className="mt-6">
                    <label>
                        Password
                        <input type="password" className="w-full border h-[6vh]" placeholder="Enter your password" required/>
                    </label>
                    </div>
                    <button className="w-full bg-yellow-600 h-[5vh] mt-6 text-stone-100 font-medium rounded">Login</button>
                    <p className="text-sky-500 mt-6">Forgot password?</p>
                    <p>Don't have an account?<span className="text-sky-600 mt-2">Signup</span></p>
                </form>
            </div>
        </div>
    );
};

export default Login;