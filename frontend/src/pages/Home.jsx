import React from "react";
import burgersImage from '../assets/burgers.jpg';

const Home = () => {
    return (
        <div className="h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${burgersImage})`}}>
            <h1 className="font-bold">This is home</h1>
        </div>

    );
};

export default Home