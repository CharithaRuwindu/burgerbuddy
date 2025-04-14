import React from "react";
import UnauthorizedErr from '../assets/unauthorizederr.png';

const Unauthorized = () => {
    
    return (
        <>
            <div>
            <img src={UnauthorizedErr} alt="Unauthorized" className="max-h-full m-auto" />
            </div>
        </>
    );
};

export default Unauthorized;