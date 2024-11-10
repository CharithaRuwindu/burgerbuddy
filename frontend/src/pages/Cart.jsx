import fooditem from '../assets/burgers.jpg'
const Cart = () => {
    return (
        <div className="flex justify-center overflow-auto h-[92vh]" style={{ backgroundColor: '#F6F6F6' }}>
            <div className='flex justify-center items-center mt-[5%] w-[60%] mb-[5%] rounded-xl bg-white'>
                <table className='m-[5%] w-full h-full'>
                    <thead>
                        <tr>
                            <td>Food Item</td>
                            <td>Price</td>
                            <td>Quantity</td>
                            <td>Total Price</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='max-h-5 max-w-5'><img src={fooditem} alt="fooditem" /></td>
                            <td>500</td>
                            <td>2</td>
                            <td>1000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default Cart