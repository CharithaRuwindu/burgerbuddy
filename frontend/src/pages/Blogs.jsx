import React, { useEffect, useState } from "react";
import axios from "axios";

const Blogs = () => {

    const [menus, setMenus] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get(`/api/Menus`);
                setMenus(response.data);
            }catch(error)
            {
                console.log("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    
    return (
        <>
        <h1 className="font-bold">Hello this is the blog</h1>

        {menus ? (
                <div>hi</div>
            ) : (
                <div>Loading</div>
            )
        }
        </>

    );

};

export default Blogs;