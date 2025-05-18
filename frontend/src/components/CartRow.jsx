import { ImBin, useState, useEffect } from '../utils/Imports';
import { removeItem } from '../reducers/cartSlice';
import { useDispatch } from 'react-redux';

export default function CartRow({ menu_ID, itemImage, name, price, qty }) {
    const [quantity, setQuantity] = useState(qty);
    const [totalPrice, setTotalPrice] = useState(price * qty);
    const dispatch = useDispatch();

    const handleRemoveItem = (id) => {
        dispatch(removeItem(id));
      };

    useEffect(() => {
        setTotalPrice(price * quantity);
    }, [quantity]);
    const changeQuantity = (expression) => {
        if (expression === 'plus') {
            if (quantity < 10) {
                setQuantity((prev) => prev + 1);
            } else {

            }
        } else if (expression === 'minus') {
            if (quantity > 1) {
                setQuantity((prev) => prev - 1);
            } else {

            }
        }
    }
    return (
        <tr className='text-center' key={menu_ID}>
            <td><input type="checkbox" name="" id="" /></td>
            <td><img src={`data:image/jpeg;base64,${itemImage}`} className='h-36 m-auto' alt="fooditem" />
                <p>{name}</p>
            </td>
            <td>{price}</td>
            <td>
                <div className='flex justify-center items-center'>
                    <div className='w-8 bg-stone-200 rounded-sm cursor-pointer flex justify-center items-center' onClick={() => changeQuantity('minus')}>-</div>
                    <div className='w-8'>{quantity}</div>
                    <div className='w-8 bg-stone-200 rounded-sm cursor-pointer flex justify-center items-center' onClick={() => changeQuantity('plus')}>+</div>
                </div>
            </td>
            <td>{totalPrice}</td>
            <td><div className='h-10 w-10 m-auto cursor-pointer rounded-full border-2 flex justify-center items-center hover:text-red-500 hover:border-red-400' onClick={() => handleRemoveItem(menu_ID)}><ImBin /></div></td>
        </tr>
    );
}