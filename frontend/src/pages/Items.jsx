import React, { useState, useEffect } from "react";

const Items = () => {

    const tabs = ["All", "Burgers", "Meals", "Sides", "Drinks", "Desserts"];
    const [activeTab, setActiveTab] = useState("All");

    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Items Management</h1>
                    </div>
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
            </div>
        </>
    );
};

export default Items;