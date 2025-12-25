import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/authService";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getUsers();
        setUsers(userList || []);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      alert("Failed to delete user");
    }
  };

  if (loading) return <p className="status-text">Loading users...</p>;
  if (error) return <p className="status-text">{error}</p>;

  return (
    <div className="admin-wrapper">
      <h1>Admin Panel</h1>

      {users.length === 0 ? (
        <p className="status-text">No users found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.user_type}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
