import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdPersonAddAlt1 } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
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
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmDialogType, setConfirmDialogType] = useState(null);
    const [confirmingUserId, setConfirmingUserId] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);

    const [activeTab, setActiveTab] = useState("All");
    const [allUsers, setAllUsers] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [activateLoading, setActivateLoading] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("all");

    const usersPerPage = 10;
    const roles = ["Admin", "Manager", "Customer"];
    const tabs = ["All", "Admin", "Manager", "Customer", "Deleted"];
    const searchFields = [
        { value: "all", label: "All Fields" },
        { value: "firstName", label: "First Name" },
        { value: "lastName", label: "Last Name" },
        { value: "email", label: "Email" },
        { value: "contactNumber", label: "Phone Number" }
    ];

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
        const filteredUsers = filterAndSearchUsers();
        setDisplayedUsers(filteredUsers);
        setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));
        setCurrentPage(1);
    }, [activeTab, allUsers, searchTerm, searchField]);

    const filterAndSearchUsers = () => {
        const activeUsers = allUsers.filter(user => user.isActive === true);
        const deletedUsers = allUsers.filter(user => user.isActive === false);

        let filtered;
        if (activeTab === "All") {
            filtered = [...activeUsers];
        } else if (activeTab === "Deleted") {
            filtered = [...deletedUsers];
        } else {
            filtered = activeUsers.filter(user => {
                const userRole = String(user.role || "").toLowerCase();
                const tabRole = activeTab.toLowerCase();
                return userRole === tabRole;
            });
        }

        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();

            return filtered.filter(user => {
                if (searchField === "all") {
                    return (
                        user.firstName?.toLowerCase().includes(term) ||
                        user.lastName?.toLowerCase().includes(term) ||
                        user.email?.toLowerCase().includes(term) ||
                        user.contactNumber?.includes(term)
                    );
                } else {
                    const fieldValue = String(user[searchField] || "").toLowerCase();
                    return fieldValue.includes(term);
                }
            });
        }

        return filtered;
    };

    useEffect(() => {
        filterUsers(activeTab);
    }, [activeTab, allUsers]);

    const filterUsers = (tab) => {

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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchFieldChange = (e) => {
        setSearchField(e.target.value);
    };

    const handleRowClick = (user) => {
        setViewingUser(user);
        setShowViewModal(true);
    };

    const handleViewModalClose = () => {
        setShowViewModal(false);
        setViewingUser(null);
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

    const clearSearch = () => {
        setSearchTerm("");
        setSearchField("all");
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

        setConfirmingUserId(user_ID);
        setConfirmDialogType('delete');
        setConfirmDialogOpen(true);
    };

    const handleActivate = async (user_ID) => {
        if (!user_ID) {
            console.error("Invalid user ID for Activation");
            return;
        }

        setConfirmingUserId(user_ID);
        setConfirmDialogType('activate');
        setConfirmDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        if (confirmDialogType === 'delete') {
            setDeleteLoading(confirmingUserId);

            try {
                await axios.patch(`/api/users/${confirmingUserId}/deactivate`);

                setAllUsers(prev => prev.map(user =>
                    user.user_ID === confirmingUserId
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
        } else if (confirmDialogType === 'activate') {
            setActivateLoading(confirmingUserId);

            try {
                await axios.patch(`/api/users/${confirmingUserId}/reactivate`);

                setAllUsers(prev => prev.map(user =>
                    user.user_ID === confirmingUserId
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
        }

        setConfirmDialogOpen(false);
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
                                    placeholder="Search users..."
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
                        {displayedUsers.length === 0 ?
                            <span className="ml-2 text-red-500">No results found</span> :
                            <span className="ml-2 text-green-600">{displayedUsers.length} result(s) found</span>
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
                            ) : (
                                <>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                        <MdPersonAddAlt1 className="h-6 w-6 text-green-600" />
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
                                    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                    }`}
                                onClick={handleConfirmAction}
                            >
                                {confirmDialogType === 'delete' ? 'Deactivate' : 'Reactivate'}
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
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} cursor-pointer hover:bg-gray-100`}
                                    onClick={() => handleRowClick(user)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">{user.firstName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.lastName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.contactNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{String(user.role || "Customer")}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(user);
                                                }}
                                                className="text-blue-800 font-medium py-2 px-2 rounded bg-blue-200 hover:bg-blue-400 border border-blue-500"
                                                title="Edit user"
                                            >
                                                <MdModeEditOutline className="h-5 w-5" />
                                            </button>

                                            {activeTab === 'Deleted' ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleActivate(user.user_ID);
                                                    }}
                                                    disabled={activateLoading === user.user_ID}
                                                    className={`text-green-800 border border-green-500 font-medium py-2 px-2 rounded ${activateLoading === user.user_ID
                                                        ? 'bg-green-200 cursor-not-allowed'
                                                        : 'bg-green-200 hover:bg-green-400'
                                                        }`}
                                                    title="Reactivate user"
                                                >
                                                    {activateLoading === user.user_ID ? (
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <MdPersonAddAlt1 className="h-5 w-5" />
                                                    )}
                                                </button>

                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(user.user_ID);
                                                    }}
                                                    disabled={deleteLoading === user.user_ID}
                                                    className={`text-red-700 border border-red-500 font-medium py-2 px-2 rounded ${deleteLoading === user.user_ID
                                                        ? 'bg-red-100 cursor-not-allowed'
                                                        : 'bg-red-200 hover:bg-red-400'
                                                        }`}
                                                    title="Delete user"
                                                >
                                                    {deleteLoading === user.user_ID ? (
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <RiDeleteBin6Line className="h-5 w-5" />
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

            {showViewModal && viewingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-0 w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Profile</h2>
                            <button
                                className="text-white hover:text-gray-200 focus:outline-none"
                                onClick={handleViewModalClose}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="bg-gray-50 flex justify-center py-6">
                            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                                <span className="text-blue-600 text-3xl font-bold">
                                    {viewingUser.firstName.charAt(0)}{viewingUser.lastName.charAt(0)}
                                </span>
                            </div>
                        </div>

                        <div className="px-6 py-4">
                            <div className="bg-white rounded-lg p-4 divide-y divide-gray-200">
                                <div className="pb-3 text-center">
                                    <h3 className="text-lg font-bold text-gray-800">{viewingUser.firstName} {viewingUser.lastName}</h3>
                                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${viewingUser.isActive
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                        } mt-2`}>
                                        {viewingUser.isActive ? "Active" : "Deactivated"}
                                    </span>
                                </div>

                                <div className="py-3">
                                    <div className="grid grid-cols-6 gap-1 mb-2">
                                        <div className="col-span-2 text-gray-500">Role</div>
                                        <div className="col-span-4 font-medium">{viewingUser.role || "Customer"}</div>
                                    </div>
                                    <div className="grid grid-cols-6 gap-1 mb-2">
                                        <div className="col-span-2 text-gray-500">Email</div>
                                        <div className="col-span-4 font-medium text-blue-600">{viewingUser.email}</div>
                                    </div>
                                    <div className="grid grid-cols-6 gap-1 mb-2">
                                        <div className="col-span-2 text-gray-500">Phone</div>
                                        <div className="col-span-4 font-medium">{viewingUser.contactNumber}</div>
                                    </div>
                                    <div className="grid grid-cols-6 gap-1">
                                        <div className="col-span-2 text-gray-500">Address</div>
                                        <div className="col-span-4 font-medium">{viewingUser.address}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition duration-200"
                                onClick={handleViewModalClose}
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 flex items-center"
                                onClick={() => {
                                    handleViewModalClose();
                                    handleEdit(viewingUser);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit User
                            </button>
                        </div>
                    </div>
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