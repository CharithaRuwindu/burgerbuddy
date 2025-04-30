import React, { useState, useEffect } from "react";
import axios from "axios";

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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
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
                                                    <td className="px-6 py-4 h-24 whitespace-nowrap"><img src={`data:image/jpeg;base64,${item.itemImage}`} alt="MenuImage" className="max-h-full " /></td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
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
                
            </div>
        </>
    );
};

export default Items;