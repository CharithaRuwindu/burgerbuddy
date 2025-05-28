import { useDispatch } from 'react-redux';
import { addToCart } from '../reducers/cartSlice';

export default function ItemCard({ itemId, itemName, itemPrice, itemImage, onItemClick }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    let parsedPrice;
    if (typeof itemPrice === 'string') {
      parsedPrice = parseFloat(itemPrice.replace(/[^\d.-]/g, ''));
    } else {
      parsedPrice = parseFloat(itemPrice);
    }

    console.log('Adding item to cart:', {
      id: itemId,
      name: itemName,
      originalPrice: itemPrice,
      parsedPrice: parsedPrice
    });

    const item = {
      id: itemId,
      title: itemName,
      price: parsedPrice || 0,
      image: itemImage
    };
    
    dispatch(addToCart(item));
  };

  const handleCardClick = () => {
    if (onItemClick) {
      onItemClick({
        id: itemId,
        name: itemName,
        price: itemPrice,
        image: itemImage
      });
    }
  };

  return (
    <div 
      className="w-60 border-slate-150 border-2 rounded-md mx-auto my-3 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCardClick}
    >
      <div className="w-full h-44">
        <img 
          src={`data:image/jpeg;base64,${itemImage}`} 
          alt="MenuImage" 
          className="max-h-full m-auto" 
        />
      </div>
      <h2 className="mt-1 ml-2 font-semibold">{itemName}</h2>
      <h3 className="ml-2 font-semibold text-yellow-900">{itemPrice}</h3>
      <span className="flex h-16">
        <button 
          className="bg-sky-700 px-10 py-1 rounded-full text-white m-auto hover:bg-sky-800 transition-colors"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </span>
    </div>
  );
}