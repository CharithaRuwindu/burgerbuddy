import fooditem from '../assets/burgers.jpg'
const Cart = () => {
    return (
        <div className="flex justify-center overflow-auto h-[92vh]" style={{ backgroundColor: '#F6F6F6' }}>
            <div className='flex justify-center overflow-auto align-middle mt-[5%] mb-2 w-[60%] rounded-xl bg-white shadow-2xl'>
                <table className='w-[95%] mt-[2%] mb-5'>
                    <thead className='font-semibold h-10'>
                        <tr className='text-center'>
                            <td className='w-[10%]'>Select All <p><input type="checkbox" name="" id="" /></p></td>
                            <td className='w-[24%]'>Food Item</td>
                            <td className='w-[22%]'>Price</td>
                            <td className='w-[22%]'>Quantity</td>
                            <td className='w-[22%]'>Total Price</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='text-center max-h-5'>
                            <td><input type="checkbox" name="" id="" /></td>
                            <td><img src={fooditem} alt="fooditem" /></td>
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