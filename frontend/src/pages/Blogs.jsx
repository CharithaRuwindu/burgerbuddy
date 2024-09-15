import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";

const Blogs = () => {
    const [menus, setMenus] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/Menus`);
                setMenus(response.data);
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <h1 className="font-bold">Hello, this is the blog</h1>
            <div className="flex flex-wrap">

            {menus ? (
                menus.map((menu) => (
                    menu.isAvailable ? (
                    
                    <ItemCard
                        key={menu.menu_ID}
                        itemName={menu.name}
                        itemCategory={menu.category}
                        itemPrice={`LKR ${menu.price}`}
                        itemAvailability="Available"
                    />
                ) : null
                    
                    
                    
                ))
            ) : (
                <div>Loading...</div>
            )}
            </div>
        </>
    );
};

export default Blogs;
