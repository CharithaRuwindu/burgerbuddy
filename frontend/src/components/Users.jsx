import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        contactNumber: "",
        address: "",
        role: "Customer",
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Tab and user data states
    const [activeTab, setActiveTab] = useState("All");
    const [allUsers, setAllUsers] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const usersPerPage = 10;
    const roles = ["Admin", "Manager", "Customer"];
    const tabs = ["All", "Admin", "Manager", "Customer"];

    // Mock data for testing - remove in production
    const mockUsers = [
        { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com", contactNumber: "1234567890", role: "Admin" },
        { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", contactNumber: "2345678901", role: "Manager" },
        { id: 3, firstName: "Mike", lastName: "Johnson", email: "mike@example.com", contactNumber: "3456789012", role: "Customer" },
        { id: 4, firstName: "Sarah", lastName: "Williams", email: "sarah@example.com", contactNumber: "4567890123", role: "Customer" },
        { id: 5, firstName: "David", lastName: "Brown", email: "david@example.com", contactNumber: "5678901234", role: "Manager" },
        { id: 6, firstName: "Lisa", lastName: "Davis", email: "lisa@example.com", contactNumber: "6789012345", role: "Admin" }
    ];

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // Try to fetch from API
                const response = await axios.get("/api/users");
                console.log("API Response:", response.data);
                
                // Process the data to ensure role property exists
                const processedUsers = response.data.map(user => ({
                    ...user,
                    role: user.role || "Customer" // Default to Customer if role is missing
                }));
                
                setAllUsers(processedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
                // Use mock data if API fails
                console.log("Using mock data instead");
                setAllUsers(mockUsers);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Apply filtering whenever activeTab or allUsers changes
    useEffect(() => {
        filterUsers(activeTab);
    }, [activeTab, allUsers]);

    // Function to filter users based on selected tab
    const filterUsers = (tab) => {
        console.log("Filtering by tab:", tab);
        console.log("All users before filtering:", allUsers);
        
        let filtered;
        if (tab === "All") {
            filtered = [...allUsers];
        } else {
            filtered = allUsers.filter(user => {
                // Fix: Ensure user.role is converted to a string before calling toLowerCase
                const userRole = String(user.role || "").toLowerCase();
                const tabRole = tab.toLowerCase();
                console.log(`User ${user.firstName} role: "${userRole}" compared to tab: "${tabRole}"`);
                return userRole === tabRole;
            });
        }
        
        console.log("Filtered result:", filtered);
        setDisplayedUsers(filtered);
        setTotalPages(Math.ceil(filtered.length / usersPerPage));
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Get current users for pagination
    const getCurrentUsers = () => {
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        return displayedUsers.slice(indexOfFirstUser, indexOfLastUser);
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (!/^[A-Za-z]+$/.test(formData.firstName)) {
            newErrors.firstName = "First name should contain only letters";
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (!/^[A-Za-z]+$/.test(formData.lastName)) {
            newErrors.lastName = "Last name should contain only letters";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = "Invalid email address";
        }
        
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password should be at least 6 characters";
        }
        
        if (!formData.contactNumber.trim()) {
            newErrors.contactNumber = "Contact number is required";
        } else if (!/^\d{10}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = "Contact number should be 10 digits";
        }
        
        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }
        
        if (!formData.role) {
            newErrors.role = "Role is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                contactNumber: formData.contactNumber,
                address: formData.address,
                role: formData.role,
                isActive: true
            };
            
            const response = await axios.post("/api/users", userData);
            
            // Add new user to allUsers state
            const newUser = response.data;
            setAllUsers(prev => [...prev, newUser]);
            
            setSuccessMessage("User added successfully!");
            setTimeout(() => {
                setSuccessMessage("");
                setShowModal(false);
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    contactNumber: "",
                    address: "",
                    role: "Customer",
                    isActive: true
                });
            }, 2000);
        } catch (error) {
            console.error("Error adding user:", error);
            setErrors({ submit: "Failed to add user. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // Generate page numbers
    const getPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Users Management</h1>
                    <p className="text-gray-600">
                        Viewing: {activeTab} users
                        {displayedUsers.length > 0 && ` (${displayedUsers.length} users found)`}
                    </p>
                </div>
                <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={() => setShowModal(true)}
                >
                    Add User
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <ul className="flex flex-wrap -mb-px">
                    {tabs.map(tab => (
                        <li key={tab} className="mr-2">
                            <button
                                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                                    activeTab === tab 
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

            {/* Users Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                                    </div>
                                    <p className="mt-2 text-gray-500">Loading users...</p>
                                </td>
                            </tr>
                        ) : getCurrentUsers().length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    {activeTab === "All" 
                                        ? "No users found in the system" 
                                        : `No users with role "${activeTab}" found`}
                                </td>
                            </tr>
                        ) : (
                            getCurrentUsers().map((user, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.firstName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.lastName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.contactNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{String(user.role || "Customer")}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!loading && displayedUsers.length > 0 && (
                <div className="flex justify-center mt-6">
                    <nav className="inline-flex rounded-md shadow">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-l-md border ${
                                currentPage === 1 
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
                                className={`px-3 py-1 border-t border-b ${
                                    currentPage === number 
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
                            className={`px-3 py-1 rounded-r-md border ${
                                currentPage === totalPages 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}

            {/* Add User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                        <button 
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowModal(false)}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                        
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>
                        
                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                {successMessage}
                            </div>
                        )}
                        
                        {errors.submit && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {errors.submit}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        First Name*
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Last Name*
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email*
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password*
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Contact Number* (10 digits)
                                </label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.contactNumber && (
                                    <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Address*
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                    rows="3"
                                ></textarea>
                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Role*
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                                {errors.role && (
                                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                                )}
                            </div>
                            
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Adding..." : "Add User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;