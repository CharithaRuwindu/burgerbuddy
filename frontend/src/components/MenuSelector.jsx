import { AiOutlineCoffee } from "react-icons/ai";
import { CiBurger } from "react-icons/ci";
import { CiFries } from "react-icons/ci";
import { BiBowlRice } from "react-icons/bi";
import { PiBowlFood } from "react-icons/pi";

export default function MenuSelector() {
    return (
        <>
        <div>
            <div><CiBurger />
            <p>Burgers</p>
            </div>
            <div><BiBowlRice />
            <p>Meals</p>
            </div>
            <div><CiFries />
            <p>Sides</p>
            </div>
            <div><AiOutlineCoffee />
            <p>Drinks</p>
            </div>
            <div><PiBowlFood />
            <p>Desserts</p>
            </div>
        </div>
        </>
    )
}