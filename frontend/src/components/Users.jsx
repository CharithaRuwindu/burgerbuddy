import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        user_ID: "",
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
    const [deleteMessage, setDeleteMessage] = useState("");
    const [activateMessage, setActivateMessage] = useState("");
    const [editMode, setEditMode] = useState(false);

    const [activeTab, setActiveTab] = useState("All");
    const [allUsers, setAllUsers] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [activateLoading, setActivateLoading] = useState(null);

    const usersPerPage = 10;
    const roles = ["Admin", "Manager", "Customer"];
    const tabs = ["All", "Admin", "Manager", "Customer", "Deleted"];

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/users");

                const processedUsers = response.data.map(user => ({
                    ...user,
                    role: user.role || "Customer"
                }));

                setAllUsers(processedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
                setAllUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers(activeTab);
    }, [activeTab, allUsers]);

    const filterUsers = (tab) => {
        console.log("Filtering by tab:", tab);
        console.log("All users before filtering:", allUsers);

        const activeUsers = allUsers.filter(user => user.isActive === true);
        const deletedUsers = allUsers.filter(user => user.isActive === false);

        let filtered;
        if (tab === "All") {
            filtered = [...activeUsers];
        } else if (tab === "Deleted") {
            filtered = [...deletedUsers];
        } else {
            filtered = activeUsers.filter(user => {
                const userRole = String(user.role || "").toLowerCase();
                const tabRole = tab.toLowerCase();
                return userRole === tabRole;
            });
        }

        setDisplayedUsers(filtered);
        setTotalPages(Math.ceil(filtered.length / usersPerPage));
        setCurrentPage(1);
    };

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

        if (!editMode) {
            if (!formData.password.trim()) {
                newErrors.password = "Password is required";
            } else if (formData.password.length < 6) {
                newErrors.password = "Password should be at least 6 characters";
            }
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
            const userData = { ...formData };

            if (editMode) {
                delete userData.password;
            }

            let response;
            let successMsg;

            if (editMode) {
                response = await axios.put(`/api/users/${userData.user_ID}`, userData);
                successMsg = "User updated successfully!";

                const updatedUser = {
                    ...response.data,
                    role: userData.role || "Customer"
                };

                setAllUsers(prev =>
                    prev.map(user =>
                        user.user_ID === userData.user_ID ? updatedUser : user
                    )
                );
            } else {
                response = await axios.post("/api/users", userData);
                successMsg = "User added successfully!";

                const newUser = {
                    ...response.data,
                    role: userData.role || "Customer"
                };

                setAllUsers(prev => [...prev, newUser]);
            }

            setSuccessMessage(successMsg);
            setTimeout(() => {
                setSuccessMessage("");
                setShowModal(false);
                resetForm();
            }, 2000);
        } catch (error) {
            console.error("Error saving user:", error);
            setErrors({ submit: `Failed to ${editMode ? 'update' : 'add'} user. Please try again.` });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            user_ID: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            contactNumber: "",
            address: "",
            role: "Customer",
            isActive: true
        });
        setEditMode(false);
        setErrors({});
    };

    const handleEdit = (user) => {
        setFormData({
            user_ID: user.user_ID,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: "",
            contactNumber: user.contactNumber,
            address: user.address,
            role: user.role || "Customer",
            isActive: user.isActive
        });
        setEditMode(true);
        setShowModal(true);
    };

    const handleAddUser = () => {
        resetForm();
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        resetForm();
    };

    const handleDelete = async (user_ID) => {
        if (!user_ID) {
            console.error("Invalid user ID for deactivation");
            return;
        }

        if (!window.confirm("Are you sure you want to deactivate this user?")) {
            return;
        }

        setDeleteLoading(user_ID);

        try {
            await axios.patch(`/api/users/${user_ID}/deactivate`);

            setAllUsers(prev => prev.map(user =>
                user.user_ID === user_ID
                    ? { ...user, isActive: false }
                    : user
            ));

            setDeleteMessage("User deactivated successfully");
            setTimeout(() => {
                setDeleteMessage("");
            }, 3000);
        } catch (error) {
            console.error("Error deactivating user:", error);
            alert("Failed to deactivate user. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleActivate = async (user_ID) => {
        if (!user_ID) {
            console.error("Invalid user ID for Activation");
            return;
        }

        if (!window.confirm("Are you sure you want to Reactivate this user?")) {
            return;
        }

        setActivateLoading(user_ID);

        try {
            await axios.patch(`/api/users/${user_ID}/reactivate`);

            setAllUsers(prev => prev.map(user =>
                user.user_ID === user_ID
                    ? { ...user, isActive: true }
                    : user
            ));

            setActivateMessage("User Reactivated successfully");
            setTimeout(() => {
                setActivateMessage("");
            }, 3000);
        } catch (error) {
            console.error("Error Reactivating user:", error);
            alert("Failed to Reactivate user. Please try again.");
        } finally {
            setActivateLoading(null);
        }
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
                    onClick={handleAddUser}
                >
                    Add User
                </button>
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

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
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
                                    <p className="mt-2 text-gray-500">Loading users...</p>
                                </td>
                            </tr>
                        ) : getCurrentUsers().length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
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
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-white font-medium py-1 px-2 rounded bg-blue-500 hover:bg-blue-600"
                                                title="Edit user"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            
                                            {activeTab === 'Deleted' ? (
                                            <button
                                                onClick={() => handleActivate(user.user_ID)}
                                                disabled={activateLoading === user.user_ID}
                                                className={`text-white font-medium py-1 px-2 rounded ${activateLoading === user.user_ID
                                                    ? 'bg-green-300 cursor-not-allowed'
                                                    : 'bg-green-500 hover:bg-green-600'
                                                    }`}
                                                title="Reactivate user"
                                            >
                                                {activateLoading === user.user_ID ? (
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>

                                            ) : (
                                            <button
                                                onClick={() => handleDelete(user.user_ID)}
                                                disabled={deleteLoading === user.user_ID}
                                                className={`text-white font-medium py-1 px-2 rounded ${deleteLoading === user.user_ID
                                                    ? 'bg-red-300 cursor-not-allowed'
                                                    : 'bg-red-500 hover:bg-red-600'
                                                    }`}
                                                title="Delete user"
                                            >
                                                {deleteLoading === user.user_ID ? (
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
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

            {!loading && displayedUsers.length > 0 && (
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

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={handleModalClose}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>

                        <h2 className="text-xl font-bold mb-4">{editMode ? "Edit User" : "Add New User"}</h2>

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

                            {!editMode && (
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
                            )}

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
                                    onClick={handleModalClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (editMode ? "Updating..." : "Adding...") : (editMode ? "Update User" : "Add User")}
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