import React from "react";
import burgersImage from '../assets/burgers.jpg';
import { IoIosCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FaAnglesDown, FaLocationDot, FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FiFacebook } from "react-icons/fi";
import logo from '../assets/logo.png';

const Home = () => {
    return (
        <div className="h-[92vh] w-full bg-cover bg-center overflow-auto scrollbar-hide" style={{ backgroundImage: `url(${burgersImage})`,backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-[4px]"></div>
            <section className="h-[92vh] relative text-stone-100 font-medium z-10">
                <div className="h-[10rem] w-[15rem]"><img src={logo} alt="logo" /></div>
                <div className="flex justify-center mt-[7%] text-7xl drop-shadow-2xl">Happy Dining</div>
                <div className="flex justify-center w-screen absolute left-0 bottom-0"><FaAnglesDown onClick={() => document.getElementById('intro').scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer w-[5rem] h-[5rem]"/></div>
            </section>
            <section id="intro" className="h-[92vh] bg-white flex justify-center">
                <div className="w-[50%]"></div>
                <div className="w-[30%] flex">
                    <div className="w-[50%]"><img src={logo} alt="" /></div>
                    <div><img src={logo} alt="" /></div>
                    <div><img src={logo} alt="" /></div>
                </div>
            </section>
            <section className="h-[92vh] bg-white flex justify-center">
                <div className="m-auto h-[80%] w-[50%] rounded-md border-yellow-600 border-[0.07rem]"><iframe className="h-full w-full rounded-md" title="BurgerBuddyLocation" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.6941342594578!2d80.39315087448142!3d6.6847593212694365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3bf111d64c933%3A0xea3370121b2f13ec!2sSri%20Khemananda%20Mawatha%2C%20Ratnapura!5e0!3m2!1sen!2slk!4v1730978043849!5m2!1sen!2slk"></iframe></div>
                <div className="m-auto h-[80%] w-[30%]">
                    <h1 className="text-3xl font-semibold text-yellow-700">Get in touch</h1>
                    <table className="m-auto mt-8 border-separate border-spacing-3">
                        <tr>
                            <td><div className="rounded-full h-[2rem] w-[2rem] bg-slate-300 flex justify-center items-center"><IoIosCall/></div></td>
                            <td>071 123 4567</td>
                        </tr>
                        <tr>
                            <td><div className="rounded-full h-[2rem] w-[2rem] bg-slate-300 flex justify-center items-center"><MdEmail/></div></td>
                            <td>info@burgerbuddy.com</td>
                        </tr>
                        <tr>
                            <td><div className="rounded-full h-[2rem] w-[2rem] bg-slate-300 flex justify-center items-center"><FaLocationDot/></div></td>
                            <td>No 2/11, Sri Khemananda Mawatha, Ratnapura</td>
                        </tr>
                    </table>
                    <h1 className="text-lg font-semibold mt-8">Follow Us</h1>
                    <div className="flex mt-3 justify-center w-[60%] mx-auto">
                        <div className="rounded-full cursor-pointer h-[3rem] w-[3rem] mx-auto border-2 border-yellow-600 flex justify-center items-center text-2xl text-yellow-600 hover:text-white hover:bg-yellow-600 transition duration-300 ease-in-out"><FaInstagram /></div>
                        <div className="rounded-full cursor-pointer h-[3rem] w-[3rem] mx-auto border-2 border-yellow-600 flex justify-center items-center text-2xl text-yellow-600 hover:text-white hover:bg-yellow-600 transition duration-300 ease-in-out"><FiFacebook /></div>
                        <div className="rounded-full cursor-pointer h-[3rem] w-[3rem] mx-auto border-2 border-yellow-600 flex justify-center items-center text-2xl text-yellow-600 hover:text-white hover:bg-yellow-600 transition duration-300 ease-in-out"><FaXTwitter /></div>
                    </div>
                    <div className="flex mt-10 justify-center w-[80%] mx-auto">
                        <table>
                            <tr>
                                <td>Open : </td>
                                <td>
                                    Weekdays & saturday, 9.00am - 6.00pm
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </section>
        </div>

    );
};

export default Home