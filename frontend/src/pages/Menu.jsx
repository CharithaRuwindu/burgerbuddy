import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import MenuSelector from "../components/MenuSelector";

import ItemViewModal from '../components/ItemViewModal';

const Menu = () => {
    const [Active, setActive] = useState(1);
    const [menus, setMenus] = useState(null);

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

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

            <div className="flex flex-wrap mx-3 mt-5">
                <span className="fixed bottom-0 right-0"><MenuSelector Active={Active} setActive={setActive} /></span>


                {menus ? (
                    menus.map((menu) => (
                        menu.isAvailable && ((Active === 1 && menu.category === 'Burgers') || (Active === 2 && menu.category === 'Meals') || (Active === 3 && menu.category === 'Sides') || (Active === 4 && menu.category === 'Drinks') || (Active === 5 && menu.category === 'Desserts')) ? (
                            <div>
                                <ItemCard
                                    key={menu.menu_ID}
                                    itemId={menu.menu_ID}
                                    itemName={menu.name}
                                    itemPrice={`LKR ${menu.price}`}
                                    itemImage={menu.itemImage}
                                    onItemClick={handleItemClick}
                                />

                                {isModalOpen && (
                                    <ItemViewModal
                                        item={selectedItem}
                                        onClose={handleCloseModal}
                                    />
                                )}
                            </div>
                        ) : null



                    ))
                ) : (
                    <div>Loading...
                        <h3 className="font-bold mt-2 ml-2">We got some choices for you</h3>
                    </div>
                )}
            </div>
        </>
    );
};

export default Menu;
