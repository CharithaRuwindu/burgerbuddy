import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosAddCircle } from "react-icons/io";
import { TbHomeMove } from "react-icons/tb";
import { RiChatDeleteLine, RiDeleteBin6Line } from "react-icons/ri";
import { MdModeEditOutline } from "react-icons/md";
import { ImageHandler } from "../components/ImageHandler";

const Items = () => {

    const tabs = ["All", "Burgers", "Meals", "Sides", "Drinks", "Desserts", "Unavailable", "Deleted"];
    const [activeTab, setActiveTab] = useState("All");
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("all");
    const [displayedItems, setDisplayedItems] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmDialogType, setConfirmDialogType] = useState(null);
    const [confirmingItemId, setConfirmingItemId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [activateLoading, setActivateLoading] = useState(null);
    const [unavailableLoading, setUnavailableLoading] = useState(null);
    const [availableLoading, setAvailableLoading] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [activateMessage, setActivateMessage] = useState("");
    const [makeavailableMessage, setMakeAvailableMessage] = useState("");
    const [makeunavailableMessage, setMakeUnavailableMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        menu_ID: "",
        name: "",
        category: "Burgers",
        price: "",
        itemImage: null,
        isActive: true,
        isAvailable: true
    });

    const searchFields = [
        { value: "all", label: "All Fields" },
        { value: "name", label: "Item Name" },
        { value: "category", label: "Category" },
        { value: "price", label: "Price" }
    ];

    const itemsPerPage = 10;
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/Menus`);
                setItems(response.data);
            } catch (error) {
                console.log("Error fetching data:", error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filteredItems = filterAndSearchItems();
        setDisplayedItems(filteredItems);
        setTotalPages(Math.ceil(filteredItems.length / itemsPerPage));
        setCurrentPage(1);
    }, [activeTab, items, searchTerm, searchField]);

    const filterAndSearchItems = () => {
        const activeItems = items.filter(item => item.isActive === true && item.isAvailable === true);
        const deletedItems = items.filter(item => item.isActive === false);
        const unavailableItems = items.filter(item => item.isAvailable === false && item.isActive === true);

        let filtered;
        if (activeTab === "All") {
            filtered = [...activeItems];
        } else if (activeTab === "Deleted") {
            filtered = [...deletedItems];
        } else if (activeTab === "Unavailable") {
            filtered = [...unavailableItems];
        } else {
            filtered = activeItems.filter(item => {
                const itemCategory = String(item.category || "").toLowerCase();
                const tabCategory = activeTab.toLowerCase();
                return itemCategory === tabCategory;
            });
        }

        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();

            return filtered.filter(item => {
                if (searchField === "all") {
                    return (
                        item.name?.toLowerCase().includes(term) ||
                        item.category?.toLowerCase().includes(term) ||
                        String(item.price)?.includes(term)
                    );
                } else {
                    const fieldValue = String(item[searchField] || "").toLowerCase();
                    return fieldValue.includes(term);
                }
            });
        }

        return filtered;
    };

    useEffect(() => {
        filterItems(activeTab);
    }, [activeTab, items]);

    const filterItems = (tab) => {

        const activeItems = items.filter(item => item.isActive === true && item.isAvailable === true);
        const deletedItems = items.filter(item => item.isActive === false);
        const unavailableItems = items.filter(item => item.isAvailable === false && item.isActive === true);

        let filtered;
        if (activeTab === "All") {
            filtered = [...activeItems];
        } else if (activeTab === "Deleted") {
            filtered = [...deletedItems];
        } else if (activeTab === "Unavailable") {
            filtered = [...unavailableItems];
        } else {
            filtered = activeItems.filter(item => {
                const itemCategory = String(item.category || "").toLowerCase();
                const tabCategory = activeTab.toLowerCase();
                return itemCategory === tabCategory;
            });
        }

        setDisplayedItems(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1);
    };

    const getCurrentItems = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return displayedItems.slice(indexOfFirstItem, indexOfLastItem);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchFieldChange = (e) => {
        setSearchField(e.target.value);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    const clearSearch = () => {
        setSearchTerm("");
        setSearchField("all");
    };

    const handleDelete = async (menu_ID) => {
        if (!menu_ID) {
            console.error("Invalid item for deactivation");
            return;
        }

        setConfirmingItemId(menu_ID);
        setConfirmDialogType('delete');
        setConfirmDialogOpen(true);
    };

    const handleActivate = async (menu_ID) => {
        if (!menu_ID) {
            console.error("Invalid item for Activation");
            return;
        }

        setConfirmingItemId(menu_ID);
        setConfirmDialogType('activate');
        setConfirmDialogOpen(true);
    };

    const handleMakeAvailable = async (menu_ID) => {
        if (!menu_ID) {
            console.error("Invalid item to make available");
            return;
        }

        setConfirmingItemId(menu_ID);
        setConfirmDialogType('makeavailable');
        setConfirmDialogOpen(true);
    };

    const handleMakeUnAvailable = async (menu_ID) => {
        if (!menu_ID) {
            console.error("Invalid item to make unavailable");
            return;
        }

        setConfirmingItemId(menu_ID);
        setConfirmDialogType('makeunavailable');
        setConfirmDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        if (confirmDialogType === 'delete') {
            setDeleteLoading(confirmingItemId);

            try {
                await axios.patch(`/api/menus/${confirmingItemId}/deactivate`);

                setItems(prev => prev.map(item =>
                    item.menu_ID === confirmingItemId
                        ? { ...item, isActive: false }
                        : item
                ));

                setDeleteMessage("Item deactivated successfully");
                setTimeout(() => {
                    setDeleteMessage("");
                }, 3000);

            } catch (error) {
                alert("Failed to deactivate item. Please try again.");
            } finally {
                setDeleteLoading(null);
            }
        } else if (confirmDialogType === 'activate') {
            setActivateLoading(confirmingItemId);

            try {
                await axios.patch(`/api/menus/${confirmingItemId}/reactivate`);

                setItems(prev => prev.map(item =>
                    item.menu_ID === confirmingItemId
                        ? { ...item, isActive: true }
                        : item
                ));

                setActivateMessage("Item activated successfully");
                setTimeout(() => {
                    setActivateMessage("");
                }, 3000);

            } catch (error) {
                alert("Failed to activate item. Please try again.");
            } finally {
                setActivateLoading(null);
            }
        } else if (confirmDialogType === 'makeavailable') {
            setAvailableLoading(confirmingItemId);

            try {
                await axios.patch(`/api/menus/${confirmingItemId}/makeavailable`);

                setItems(prev => prev.map(item =>
                    item.menu_ID === confirmingItemId
                        ? { ...item, isAvailable: true }
                        : item
                ));

                setMakeAvailableMessage("Item made available successfully");
                setTimeout(() => {
                    setMakeAvailableMessage("");
                }, 3000);

            } catch (error) {
                alert("Failed to make item available. Please try again.");
            } finally {
                setAvailableLoading(null);
            }
        } else if (confirmDialogType === 'makeunavailable') {
            setUnavailableLoading(confirmingItemId);

            try {
                await axios.patch(`/api/menus/${confirmingItemId}/makeunavailable`);

                setItems(prev => prev.map(item =>
                    item.menu_ID === confirmingItemId
                        ? { ...item, isAvailable: false }
                        : item
                ));

                setMakeUnavailableMessage("Item made unavailable successfully");
                setTimeout(() => {
                    setMakeUnavailableMessage("");
                }, 3000);
            } catch (error) {
                alert("Failed to make item unavailable. Please try again.");
            } finally {
                setUnavailableLoading(null);
            }
        }

        setConfirmDialogOpen(false);
    };

    const handleAddItem = () => {
        resetForm();
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            menu_ID: "",
            name: "",
            category: "Burgers",
            price: "",
            itemImage: "",
            isActive: true,
            isAvailable: true
        });
    };

    const handleModalClose = () => {
        setShowModal(false);
        resetForm();
    };

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

        if (!formData.price.trim()) {
            newErrors.price = "Price is required";
        } else if (!/^\d+$/.test(formData.price)) {
            newErrors.price = "Price should contain only numbers";
        }

        if (!formData.category) {
            newErrors.category = "Category is required";
        }
        if (!formData.isActive) {
            newErrors.isActive = "Status is required";
        }
        if (!formData.isAvailable) {
            newErrors.isAvailable = "Availability is required";
        }
        if (!formData.itemImage) {
            newErrors.itemImage = "Image is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            // Create FormData object for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('isActive', formData.isActive);
            formDataToSend.append('isAvailable', formData.isAvailable);

            // Only append the image if it exists
            if (formData.itemImage) {
                formDataToSend.append('itemImage', formData.itemImage);
            }

            // Make the POST request
            const response = await axios.post('/api/Menus', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle successful response
            console.log('Item created successfully:', response.data);

            // Optionally: update the items list, close modal, and reset form
            setItems(prevItems => [...prevItems, response.data]);
            setShowModal(false);
            resetForm();

            // Show success message
            alert('Item added successfully!');

        } catch (error) {
            console.error('Error creating item:', error);

            // Handle specific error cases
            if (error.response) {
                // The request was made and the server responded with a status code
                alert(`Error: ${error.response.data.message || 'Failed to create item'}`);
            } else if (error.request) {
                // The request was made but no response was received
                alert('Error: No response from server');
            } else {
                // Something happened in setting up the request
                alert('Error: ' + error.message);
            }
        }
    };

    const handleImageSelect = (imageFile) => {
        setFormData({
            ...formData,
            itemImage: imageFile
        });

        // Clear error if exists
        if (errors.itemImage) {
            setErrors({
                ...errors,
                itemImage: null
            });
        }
    };

    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Items Management</h1>
                        <p className="text-gray-600">
                            Viewing: {activeTab} items
                            {displayedItems.length > 0 && ` (${displayedItems.length} items found)`}
                        </p>
                    </div>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        onClick={handleAddItem}
                    >
                        Add Item
                    </button>
                </div>

                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <div className="flex-grow">
                            <div className="flex">
                                <div className="w-full md:w-64">
                                    <select
                                        value={searchField}
                                        onChange={handleSearchFieldChange}
                                        className="w-full px-3 py-2 border border-r-0 rounded-l border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {searchFields.map(field => (
                                            <option key={field.value} value={field.value}>
                                                {field.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-grow">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        placeholder="Search items..."
                                        className="w-full px-3 py-2 border rounded-r border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {searchTerm && (
                        <div className="mt-2 text-sm text-gray-600">
                            Searching for "{searchTerm}" in {searchFields.find(f => f.value === searchField)?.label || "All Fields"}
                            {displayedItems.length === 0 ?
                                <span className="ml-2 text-red-500">No results found</span> :
                                <span className="ml-2 text-green-600">{displayedItems.length} result(s) found</span>
                            }
                        </div>
                    )}
                </div>

                {deleteMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {deleteMessage}
                    </div>
                )}

                {activateMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {activateMessage}
                    </div>
                )}

                {makeavailableMessage && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                        {makeavailableMessage}
                    </div>
                )}

                {makeunavailableMessage && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
                        {makeunavailableMessage}
                    </div>
                )}

                {confirmDialogOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all">
                            <div className="text-center">
                                {confirmDialogType === 'delete' ? (
                                    <>
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                            <RiDeleteBin6Line className="h-6 w-6 text-red-600" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Deactivate User</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to deactivate this user? Their account will be moved to the deleted users section.
                                            </p>
                                        </div>
                                    </>
                                ) : confirmDialogType === 'makeavailable' ? (
                                    <>
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                                            <TbHomeMove className="h-6 w-6 text-yellow-600" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Make Item Available</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to make available this item?
                                            </p>
                                        </div>
                                    </>
                                ) : confirmDialogType === 'makeunavailable' ? (
                                    <>
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                                            <RiChatDeleteLine className="h-6 w-6 text-yellow-600" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Make Item Unavailable</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to make unavailable this item? Their item will be moved to the unavailable items section.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                            <IoIosAddCircle className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Reactivate User</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to reactivate this user? They will be able to access their account again.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="button"
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm ${confirmDialogType === 'delete'
                                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                        : confirmDialogType === 'makeavailable' || confirmDialogType === 'makeunavailable' ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                        }`}
                                    onClick={handleConfirmAction}
                                >
                                    {confirmDialogType === 'delete' ? 'Deactivate' : confirmDialogType === 'makeavailable' ? 'Make Available' : confirmDialogType === 'makeunavailable' ? 'Make Unavailable' : 'Reactivate'}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                    onClick={() => setConfirmDialogOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="border-b border-gray-200 mb-6">
                    <ul className="flex flex-wrap -mb-px">
                        {tabs.map(tab => (
                            <li key={tab} className="mr-2">
                                <button
                                    className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === tab

                                        ? 'text-blue-600 border-blue-600'
                                        : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                                        }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* table */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (LKR)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                                        </div>
                                        <p className="mt-2 text-gray-500">Loading items...</p>
                                    </td>
                                </tr>
                            ) : getCurrentItems().length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        {activeTab === "All"
                                            ? "No items found in the system"
                                            : `No items with role "${activeTab}" found`}
                                    </td>
                                </tr>
                            ) : (
                                getCurrentItems().map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} cursor-pointer hover:bg-gray-100`}
                                    // onClick={() => handleRowClick(item)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2">

                                                <button
                                                    // onClick={(e) => {
                                                    //     e.stopPropagation();
                                                    //     handleEdit(user);
                                                    // }}
                                                    className="text-blue-800 font-medium py-2 px-2 rounded bg-blue-200 hover:bg-blue-400 border border-blue-500"
                                                    title="Edit user"
                                                >
                                                    <MdModeEditOutline className="h-5 w-5" />
                                                </button>

                                                {activeTab === 'Deleted' ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleActivate(item.menu_ID);
                                                        }}
                                                        disabled={activateLoading === item.menu_ID}
                                                        className={`text-green-800 border border-green-500 font-medium py-2 px-2 rounded ${activateLoading === item.menu_ID
                                                            ? 'bg-green-200 cursor-not-allowed'
                                                            : 'bg-green-200 hover:bg-green-400'
                                                            }`}
                                                        title="Reactivate item"
                                                    >
                                                        {activateLoading === item.menu_ID ? (
                                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            <IoIosAddCircle className="h-5 w-5" />
                                                        )}
                                                    </button>

                                                ) : activeTab === 'Unavailable' ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMakeAvailable(item.menu_ID);
                                                            }}
                                                            disabled={availableLoading === item.menu_ID}
                                                            className={`text-yellow-700 border border-yellow-500 font-medium py-2 px-2 rounded ${availableLoading === item.menu_ID
                                                                ? 'bg-yellow-100 cursor-not-allowed'
                                                                : 'bg-yellow-200 hover:bg-yellow-400'
                                                                }`}
                                                            title="Make available"
                                                        >
                                                            {availableLoading === item.menu_ID ? (
                                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <TbHomeMove className="h-5 w-5" />
                                                            )}
                                                        </button>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(item.menu_ID);
                                                            }}
                                                            disabled={deleteLoading === item.menu_ID}
                                                            className={`text-red-700 border border-red-500 font-medium py-2 px-2 rounded ${deleteLoading === item.menu_ID
                                                                ? 'bg-red-100 cursor-not-allowed'
                                                                : 'bg-red-200 hover:bg-red-400'
                                                                }`}
                                                            title="Delete item"
                                                        >
                                                            {deleteLoading === item.menu_ID ? (
                                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <RiDeleteBin6Line className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                    </div>

                                                ) : (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMakeUnAvailable(item.menu_ID);
                                                            }}
                                                            disabled={unavailableLoading === item.menu_ID}
                                                            className={`text-yellow-800 border border-yellow-500 font-medium py-2 px-2 rounded ${unavailableLoading === item.menu_ID
                                                                ? 'bg-yellow-100 cursor-not-allowed'
                                                                : 'bg-yellow-200 hover:bg-yellow-400'
                                                                }`}
                                                            title="Make available"
                                                        >
                                                            {unavailableLoading === item.menu_ID ? (
                                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <RiChatDeleteLine className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(item.menu_ID);
                                                            }}
                                                            disabled={deleteLoading === item.menu_ID}
                                                            className={`text-red-700 border border-red-500 font-medium py-2 px-2 rounded ${deleteLoading === item.menu_ID
                                                                ? 'bg-red-100 cursor-not-allowed'
                                                                : 'bg-red-200 hover:bg-red-400'
                                                                }`}
                                                            title="Delete item"
                                                        >
                                                            {deleteLoading === item.menu_ID ? (
                                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <RiDeleteBin6Line className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                )
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* pagination */}
                {!loading && displayedItems.length > 0 && (
                    <div className="flex justify-center mt-6">
                        <nav className="inline-flex rounded-md shadow">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-l-md border ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Previous
                            </button>

                            {getPageNumbers().map(number => (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`px-3 py-1 border-t border-b ${currentPage === number
                                        ? 'bg-blue-50 text-blue-600 border-blue-500'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-r-md border ${currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}


                {/* add item form model starts here */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                onClick={handleModalClose}
                            >
                                <span className="text-2xl">&times;</span>
                            </button>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="col-span-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Item Image*
                                        </label>

                                        <ImageHandler
                                            onImageSelect={handleImageSelect}
                                            aspectRatio={3 / 2}
                                            errorMessage={errors.itemImage}
                                        />

                                        {/* <input
                                            type="file"
                                            name="itemImage"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded ${errors.itemImage ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.itemImage && (
                                            <p className="text-red-500 text-xs mt-1">{errors.itemImage}</p>
                                        )}
                                        {formData.itemImage && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600">File selected: {formData.itemImage.name}</p>
                                            </div>
                                        )} */}
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

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                                            onClick={handleModalClose}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"

                                        >Submit</button>

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div >
                )}
                {/* add item form model ends here */}

            </div >
        </>
    );
};

export default Items;