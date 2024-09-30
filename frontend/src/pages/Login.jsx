import React from "react";

const Login = () => {
    return (
        <div>
            <div className="rounded shadow-md h-10 w-40">
                <form action="">
                    <label htmlFor="">Email
                        <input type="text" />
                    </label>
                    <label htmlFor="">
                        Password
                        <input type="text" />
                    </label>
                </form>
            </div>
        </div>
    );
};

export default Login;