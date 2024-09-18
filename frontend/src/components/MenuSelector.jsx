import { AiOutlineCoffee } from "react-icons/ai";
import { CiBurger } from "react-icons/ci";
import { CiFries } from "react-icons/ci";
import { BiBowlRice } from "react-icons/bi";
import { PiBowlFood } from "react-icons/pi";
import { useState, useEffect } from "react";


export default function MenuSelector() {
    const[Active, setActive] = useState(1);

    function ChangeSelection (index){
        console.log(index);
    }

    return (
        <>
        <div className="text-white">
            <div className="bg-red-400 rounded-full w-16 h-16 flex shadow-2xl" onClick={() => ChangeSelection(1)}>
                <span className="m-auto"><CiBurger className="m-auto w-8 h-8"/>
            <p className="text-xs">Burgers</p></span>
            </div>
            <div className="bg-red-400 rounded-full w-16 h-16 flex shadow-2xl" onClick={() => ChangeSelection(2)}>
            <span className="m-auto"><BiBowlRice className="m-auto w-8 h-8"/>
            <p className="text-xs">Meals</p></span>
            </div>
            <div className="bg-red-400 rounded-full w-16 h-16 flex shadow-2xl" onClick={() => ChangeSelection(3)}>
            <span className="m-auto"><CiFries className="m-auto w-8 h-8"/>
            <p className="text-xs">Sides</p></span>
            </div>
            <div className="bg-red-400 rounded-full w-16 h-16 flex shadow-2xl" onClick={() => ChangeSelection(4)}>
            <span className="m-auto"><AiOutlineCoffee className="m-auto w-8 h-8"/>
            <p className="text-xs">Drinks</p></span>
            </div>
            <div className="bg-red-400 rounded-full w-16 h-16 flex shadow-2xl" onClick={() => ChangeSelection(5)}>
            <span className="m-auto"><PiBowlFood className="m-auto w-8 h-8"/>
            <p className="text-xs">Desserts</p></span>
            </div>
        </div>
        </>
    )
}