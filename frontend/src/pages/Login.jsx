import React from "react";

const Login = () => {
    return (
        <div className="flex bg-slate-300">
            <div className="rounded shadow-md m-auto bg-red-200">
                <form action="">
                    <label htmlFor="">Email
                        <input type="text" />
                    </label>
                    <label htmlFor="">
                        Password
                        <input type="text" />
                    </label>
                    <button>Login</button>
                    <p className="text-sky-500">Forgot password?</p>
                    <p>Don't have an account?<span className="text-sky-600">Signup</span></p>
                </form>
            </div>
        </div>
    );
};

export default Login;