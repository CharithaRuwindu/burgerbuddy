import React, { useState } from "react";
import axios from "axios";
import ImageHandler from "./ImageHandler";

const EditItemModal = ({ item, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    menu_ID: item.menu_ID,
    name: item.name,
    category: item.category,
    price: item.price,
    itemImage: item.itemImage,
    isActive: item.isActive,
    isAvailable: item.isAvailable
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [showImageEditor, setShowImageEditor] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear errors when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (!/^\d+$/.test(String(formData.price))) {
      newErrors.price = "Price should contain only numbers";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageSelect = (file) => {
    setFormData(prev => ({
      ...prev,
      itemImage: file
    }));

    // Clear errors when a valid file is selected
    if (file && errors.itemImage) {
      setErrors(prev => ({
        ...prev,
        itemImage: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('isAvailable', formData.isAvailable);

      // Only append the image if it's a File object (new image uploaded)
      if (formData.itemImage instanceof File) {
        formDataToSend.append('itemImage', formData.itemImage);
      }

      // Make the PUT request
      const response = await axios.put(
        `/api/Menus/${formData.menu_ID}`, 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Notify parent component about the update
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
      
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to update item'}`);
      } else if (error.request) {
        alert('Error: No response from server');
      } else {
        alert('Error: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <span className="text-2xl">&times;</span>
        </button>

        <h2 className="text-lg font-semibold mb-4">Edit Item</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Item Image
              </label>

              {!showImageEditor && formData.itemImage && (
                <div className="mb-3">
                  <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={`data:image/jpeg;base64,${formData.itemImage}`}
                      alt={formData.name}
                      className="max-h-full m-auto"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowImageEditor(true)}
                    className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded text-sm"
                  >
                    Change Image
                  </button>
                </div>
              )}

              {(showImageEditor || !formData.itemImage) && (
                <ImageHandler
                  onImageSelect={handleImageSelect}
                  aspectRatio={3 / 2}
                  maintainAspectRatio={true}
                  onToggleAspectRatio={setMaintainRatio}
                  initialImage={formData.itemImage ? `data:image/jpeg;base64,${formData.itemImage}` : null}
                />
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Item Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category*
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="Burgers">Burgers</option>
                <option value="Meals">Meals</option>
                <option value="Drinks">Drinks</option>
                <option value="Sides">Sides</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Price(LKR)*
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Availability*
              </label>
              <select
                name="isAvailable"
                value={formData.isAvailable}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value={true}>Available</option>
                <option value={false}>Unavailable</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Status*
              </label>
              <select
                name="isActive"
                value={formData.isActive}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>

            <div className="col-span-2 flex justify-end mt-2">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </div>
                ) : "Update Item"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;