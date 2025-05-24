import { ImBin } from '../utils/Imports';
import { removeItemCompletely, updateQuantity } from '../reducers/cartSlice';
import { useDispatch } from 'react-redux';

export default function CartRow({ menu_ID, itemImage, name, price, qty, isSelected, onSelect }) {
    const dispatch = useDispatch();

    const handleRemoveItem = (id) => {
        // Remove the entire item from cart (not just 1 quantity)
        dispatch(removeItemCompletely(id));
    };

    const handleCheckboxChange = (e) => {
        onSelect(menu_ID, e.target.checked);
    };

    const changeQuantity = (expression) => {
        let newQuantity = qty;
        
        if (expression === 'plus') {
            if (qty < 10) {
                newQuantity = qty + 1;
                dispatch(updateQuantity({ id: menu_ID, quantity: newQuantity }));
            }
        } else if (expression === 'minus') {
            if (qty > 1) {
                newQuantity = qty - 1;
                dispatch(updateQuantity({ id: menu_ID, quantity: newQuantity }));
            }
        }
    };

    // Calculate total price based on current props
    const totalPrice = price * qty;

    return (
        <tr className='text-center' key={menu_ID}>
            <td>
                <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                />
            </td>
            <td>
                <img src={`data:image/jpeg;base64,${itemImage}`} className='h-36 m-auto' alt="fooditem" />
                <p>{name}</p>
            </td>
            <td>{price}</td>
            <td>
                <div className='flex justify-center items-center'>
                    <div 
                        className='w-8 bg-stone-200 rounded-sm cursor-pointer flex justify-center items-center hover:bg-stone-300' 
                        onClick={() => changeQuantity('minus')}
                    >
                        -
                    </div>
                    <div className='w-8'>{qty}</div>
                    <div 
                        className='w-8 bg-stone-200 rounded-sm cursor-pointer flex justify-center items-center hover:bg-stone-300' 
                        onClick={() => changeQuantity('plus')}
                    >
                        +
                    </div>
                </div>
            </td>
            <td>{totalPrice}</td>
            <td>
                <div 
                    className='h-10 w-10 m-auto cursor-pointer rounded-full border-2 flex justify-center items-center hover:text-red-500 hover:border-red-400' 
                    onClick={() => handleRemoveItem(menu_ID)}
                >
                    <ImBin />
                </div>
            </td>
        </tr>
    );
}