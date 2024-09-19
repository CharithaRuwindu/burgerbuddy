import { AiOutlineCoffee } from "react-icons/ai";
import { CiBurger } from "react-icons/ci";
import { CiFries } from "react-icons/ci";
import { BiBowlRice } from "react-icons/bi";
import { PiBowlFood } from "react-icons/pi";
import { useState, useEffect } from "react";


export default function MenuSelector() {
    const[Active, setActive] = useState(1);

    function ChangeSelection (index){
        setActive(index);
    }

    function getMenuItemClass(index) {
        return Active === index ? "bg-green-400 rounded-full w-20 h-20 flex shadow-2xl cursor-pointer"
        : "bg-red-400 rounded-full w-16 h-16 flex shadow-2xl cursor-pointer"; // Change to green when active
    }

    return (
        <>
        <div className="text-white">
            <div className={`${getMenuItemClass(1)}`} onClick={() => ChangeSelection(1)}>
                <span className="m-auto"><CiBurger className="m-auto w-8 h-8"/>
            <p className="text-xs">Burgers</p></span>
            </div>
            <div className={`${getMenuItemClass(2)}`} onClick={() => ChangeSelection(2)}>
            <span className="m-auto"><BiBowlRice className="m-auto w-8 h-8"/>
            <p className="text-xs">Meals</p></span>
            </div>
            <div className={`${getMenuItemClass(3)}`} onClick={() => ChangeSelection(3)}>
            <span className="m-auto"><CiFries className="m-auto w-8 h-8"/>
            <p className="text-xs">Sides</p></span>
            </div>
            <div className={`${getMenuItemClass(4)}`} onClick={() => ChangeSelection(4)}>
            <span className="m-auto"><AiOutlineCoffee className="m-auto w-8 h-8"/>
            <p className="text-xs">Drinks</p></span>
            </div>
            <div className={`${getMenuItemClass(5)}`} onClick={() => ChangeSelection(5)}>
            <span className="m-auto"><PiBowlFood className="m-auto w-8 h-8"/>
            <p className="text-xs">Desserts</p></span>
            </div>
        </div>
        </>
    )
}