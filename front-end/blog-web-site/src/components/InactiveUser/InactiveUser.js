import React, { useState, useEffect } from "react";
import "./InactiveUser.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function InactiveUser() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/FetchInactiveUser", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setUsers(response.data);
                } else {
                    console.error("Error fetching users:", response.statusText);
                    toast.error("Failed to fetch users.");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("An error occurred while fetching users.");
            }
        };
        fetchUsers();
    }, [token]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(Math.min(Math.max(1, pageNumber), totalPages));
    };

    const handlePageChange = (event) => {
        const pageNumber = parseInt(event.target.value);
        if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleActive = async (userId) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/AdminActiveUser',
                { user_id: userId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                toast.success('User activated successfully!');
                const updatedUsers = await axios.get("http://localhost:5000/FetchInactiveUser", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (updatedUsers.status === 200) {
                    setUsers(updatedUsers.data);
                }
            } else {
                toast.error('Failed to activate user.');
            }
        } catch (error) {
            console.error('Error activating user:', error);
            toast.error('Error activating user. Please try again.');
        }
    };

    return (
        <div className="user-container">
            <table className="table-container">
                <thead>
                    <tr>
                        <th>User Id</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                        <th>Date of Birth</th>
                        <th>Active</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user, index) => (
                        <tr key={index}>
                            <td>{user.user_id}</td>
                            <td>{user.user_name}</td>
                            <td>{user.user_email}</td>
                            <td>{user.user_contact_no}</td>
                            <td>{user.user_dob}</td>
                            <td>
                                <button className="active" onClick={() => handleActive(user.user_id)}>
                                    Active
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <input
                    type="number"
                    value={currentPage}
                    min={1}
                    max={totalPages}
                    onChange={handlePageChange}
                />
                <span> of {totalPages}</span>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default InactiveUser;
