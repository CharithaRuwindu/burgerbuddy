import React from "react";
import { useDispatch } from 'react-redux';
import { addToCart } from '../reducers/cartSlice';

const ItemViewModal = ({ item, onClose }) => {
  const dispatch = useDispatch();

  if (!item) return null;

  const handleAddToCart = () => {
    let parsedPrice;
    if (typeof item.price === 'string') {
      parsedPrice = parseFloat(item.price.replace(/[^\d.-]/g, ''));
    } else {
      parsedPrice = parseFloat(item.price);
    }

    const cartItem = {
      id: item.id,
      title: item.name,
      price: parsedPrice || 0,
      image: item.image
    };
    
    dispatch(addToCart(cartItem));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative mx-4">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          onClick={onClose}
        >
          <span className="text-2xl">&times;</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center items-center">
            {item.image ? (
              <img
                src={`data:image/jpeg;base64,${item.image}`}
                alt={item.name}
                className="rounded-lg shadow-md max-h-80 w-full object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{item.name}</h2>
              <p className="text-2xl font-semibold text-yellow-900">{item.price}</p>
            </div>

            {item.category && (
              <div>
                <span className="text-gray-600 font-semibold">Category: </span>
                <span className="text-gray-800">{item.category}</span>
              </div>
            )}

            {item.description && (
              <div>
                <h3 className="text-gray-600 font-semibold mb-2">Description:</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>
            )}

            <div className="flex gap-2">
              {item.isActive !== undefined && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              )}

              {item.isAvailable !== undefined && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.isAvailable
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </span>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-3 px-6 rounded-full transition-colors flex-1"
              >
                Add to Cart
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-full transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemViewModal;