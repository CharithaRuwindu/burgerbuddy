import { AiOutlineCoffee } from "react-icons/ai";
import { CiBurger } from "react-icons/ci";
import { CiFries } from "react-icons/ci";
import { BiBowlRice } from "react-icons/bi";
import { PiBowlFood } from "react-icons/pi";
import { useState } from "react";


export default function MenuSelector() {
    const[Active, setActive] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    function ChangeSelection (index){
        setActive(index);
    }

    function getMenuItemClass(index) {
        return Active === index ? "m-auto mb-2 bg-green-400 rounded-full w-20 h-20 flex shadow-2xl cursor-pointer duration-300"
        : "m-auto mb-2 bg-red-400 rounded-full w-16 h-16 flex shadow-2xl cursor-pointer duration-300";
    }

    function getActiveTab(condition) {
        setIsVisible(condition)
    }

    return (
        <>
        <div className="text-white duration-300 w-24" onMouseEnter={() => getActiveTab(true)} onMouseLeave={() => getActiveTab(false)}>
            <div id="1" className={`${getMenuItemClass(1)} ${isVisible || Active === 1 ? 'max-h-20 opacity-100 visible' : 'mb-0 max-h-0 opacity-0 invisible'} transition-all duration-500 overflow-hidden`} onClick={() => ChangeSelection(1)}>
                <span className="m-auto"><CiBurger className="m-auto w-8 h-8"/>
            <p className="text-xs">Burgers</p></span>
            </div>
            <div id="2" className={`${getMenuItemClass(2)} ${isVisible || Active === 2 ? 'max-h-20 opacity-100 visible' : 'mb-0 max-h-0 opacity-0 invisible'} transition-all duration-500 overflow-hidden`} onClick={() => ChangeSelection(2)}>
            <span className="m-auto"><BiBowlRice className="m-auto w-8 h-8"/>
            <p className="text-xs">Meals</p></span>
            </div>
            <div id="3" className={`${getMenuItemClass(3)} ${isVisible || Active === 3 ? 'max-h-20 opacity-100 visible' : 'mb-0 max-h-0 opacity-0 invisible'} transition-all duration-500 overflow-hidden`} onClick={() => ChangeSelection(3)}>
            <span className="m-auto"><CiFries className="m-auto w-8 h-8"/>
            <p className="text-xs">Sides</p></span>
            </div>
            <div id="4" className={`${getMenuItemClass(4)} ${isVisible || Active === 4 ? 'max-h-20 opacity-100 visible' : 'mb-0 max-h-0 opacity-0 invisible'} transition-all duration-500 overflow-hidden`} onClick={() => ChangeSelection(4)}>
            <span className="m-auto"><AiOutlineCoffee className="m-auto w-8 h-8"/>
            <p className="text-xs">Drinks</p></span>
            </div>
            <div id="5" className={`${getMenuItemClass(5)} ${isVisible || Active === 5 ? 'max-h-20 opacity-100 visible' : 'mb-0 max-h-0 opacity-0 invisible'} transition-all duration-500 overflow-hidden`} onClick={() => ChangeSelection(5)}>
            <span className="m-auto"><PiBowlFood className="m-auto w-8 h-8"/>
            <p className="text-xs">Desserts</p></span>
            </div>
        </div>
        </>
    )
}