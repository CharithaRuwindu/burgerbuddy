import { useEffect, cartdata, ImBin, useState, axios, CartRow } from '../utils/Imports';

const Cart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        getItemInfo();
    }, []);

    const getItemInfo = () => {
        var itemlist = cartdata.map(item => item.id).join(',');

        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/Menus/items?ids=${itemlist}`);
                setCart(response.data);
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };
        fetchData();
    };
    return (
        <div className="flex justify-center overflow-auto h-[92vh]" style={{ backgroundColor: '#F6F6F6' }}>

            <div className='mt-[5%] w-[60%]'>
                <div className='h-[8%] flex items-center text-slate-600 bg-white rounded-xl shadow-lg'>
                    <input type="checkbox" name="" id="" className='ml-7' />
                    <div className='ml-3'>Select All</div>
                    <div className='ml-auto mr-5 flex cursor-pointer hover:text-red-400'>
                        <div className='content-center mr-2'><ImBin /></div>
                        <div>Delete</div>
                    </div>
                </div>
                <div className='bg-white rounded-xl shadow-lg pb-5 mt-[2%]'>
                    <table className='w-full pt-1 border-separate border-spacing-y-4'>
                        <thead className='font-semibold h-10'>
                            <tr className='text-center'>
                                <td className='w-[7%]'></td>
                                <td className='w-[22%]'>Food Item</td>
                                <td className='w-[21%]'>Price</td>
                                <td className='w-[21%]'>Quantity</td>
                                <td className='w-[21%]'>Total Price (LKR)</td>
                                <td className='w-[8%]'></td>
                            </tr>
                        </thead>
                        <tbody className=''>
                            {cart ? (
                                cart.map((cartitem) => (

                                    <CartRow
                                        menu_ID={cartitem.menu_ID}
                                        itemImage={cartitem.itemImage}
                                        name={cartitem.name}
                                        price={cartitem.price}
                                        qty={2}
                                    />

                                ))
                            ) : null
                            }

                        </tbody>
                    </table>
                </div>
            </div>
            <div className='mt-[5%] ml-[3%] w-[25%]'>
                <div className='h-[70%] bg-white rounded-xl shadow-lg'>
                    <p className='pt-[4%] ml-[5%] text-xl'>
                        Summary
                    </p>
                    <hr />
                    <table className='w-[80%] ml-5 border-separate border-spacing-y-10 text-slate-600'>
                        <tbody>
                            <tr>
                                <td className='w-[70%]'>Subtotal</td>
                                <td>Rs. 0</td>
                            </tr>
                            <tr>
                                <td className='w-[70%]'>Delivery Charges</td>
                                <td>Rs. 0</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className='w-[80%] mt-[15%] ml-5 text-lg'>
                        <tbody>
                            <tr>
                                <td className='w-[70%]'>Total</td>
                                <td>Rs. 0</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='mt-[5%]'>
                        <div className='bg-yellow-600 text-center font-semibold text-stone-100 py-3 w-[90%] mx-auto cursor-pointer rounded-md hover:bg-yellow-700 transition-colors delay-100'>
                            Proceed to checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Cart