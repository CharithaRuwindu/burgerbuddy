import React from "react";

const ItemDetailModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <span className="text-2xl">&times;</span>
        </button>

        <h2 className="text-2xl font-bold mb-6">{item.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center items-center">
            {item.itemImage ? (
              <img
                src={`data:image/jpeg;base64,${item.itemImage}`}
                alt={item.name}
                className="rounded-lg shadow-md max-h-64 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600 font-semibold">Category:</div>
              <div>{item.category}</div>

              <div className="text-gray-600 font-semibold">Price:</div>
              <div>LKR {item.price}</div>

              <div className="text-gray-600 font-semibold">Status:</div>
              <div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="text-gray-600 font-semibold">Availability:</div>
              <div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.isAvailable
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;