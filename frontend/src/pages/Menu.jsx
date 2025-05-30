import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import MenuSelector from "../components/MenuSelector";

const Menu = () => {
    const[Active, setActive] = useState(1);
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
            <h3 className="font-bold mt-2 ml-2">We got some choices for you</h3>
            <div className="flex flex-wrap">
                <span className="fixed bottom-0 right-0"><MenuSelector Active={Active} setActive={setActive}/></span>
            

            {menus ? (
                menus.map((menu) => (
                    menu.isAvailable && ((Active === 1 && menu.category === 'Burgers')||(Active === 2 && menu.category === 'Meals')||(Active === 3 && menu.category === 'Sides')||(Active === 4 && menu.category === 'Drinks')||(Active === 5 && menu.category === 'Desserts')) ? (
                    
                    <ItemCard
                        key={menu.menu_ID}
                        itemName={menu.name}
                        itemPrice={`LKR ${menu.price}`}
                        itemImage={menu.itemImage}
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

export default Menu;
