import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('reports');

  useEffect(() => {
    if (user && token && (user.role === 'admin' || user.is_staff)) {
      fetchAdminData();
    }
  }, [user, token]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch all reports (admin can see all statuses)
      const reportsResponse = await axios.get(`${API_URL}/pets/reports/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersResponse = await axios.get(`${API_URL}/users/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReports(reportsResponse.data);
      setUsers(usersResponse.data);
    } catch (err) {
      setError('Failed to load admin data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateReport = async (reportId) => {
    try {
      await axios.post(
        `${API_URL}/pets/admin/reports/${reportId}/activate/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setReports(
        reports.map((report) =>
          report.id === reportId || report._id === reportId ? { ...report, status: 'active' } : report
        )
      );
      alert('Report activated successfully!');
    } catch (err) {
      alert('Failed to activate report. Please try again.');
      console.error(err);
    }
  };

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/pets/admin/reports/${reportId}/status/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setReports(
        reports.map((report) =>
          report.id === reportId || report._id === reportId ? { ...report, status: newStatus } : report
        )
      );
      alert(`Report status updated to ${newStatus}!`);
    } catch (err) {
      alert('Failed to update report status. Please try again.');
      console.error(err);
    }
  };

  if (!user || (user.role !== 'admin' && !user.is_staff)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage pet reports and users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900">Total Reports</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{reports.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-yellow-900">Pending Approval</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {reports.filter((r) => r.status === 'inactive').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-green-900">Active Reports</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {reports.filter((r) => r.status === 'active').length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-purple-900">Found</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {reports.filter((r) => r.status === 'found').length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'reports'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pet Reports ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'users'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Users ({users.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : activeTab === 'reports' ? (
            reports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No reports found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id || report._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{report.pet_name}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              report.status === 'active'
                                ? 'bg-blue-100 text-blue-800'
                                : report.status === 'found'
                                ? 'bg-green-100 text-green-800'
                                : report.status === 'inactive'
                                ? 'bg-gray-100 text-gray-800'
                                : report.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {report.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-2">{report.description}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500">
                          <span>Type: {report.pet_type}</span>
                          <span>Location: {report.location_found}</span>
                          <span>Contact: {report.contact_info}</span>
                          <span>
                            Reported: {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {report.images && report.images.length > 0 && (
                          <div className="mt-3">
                            <img
                              src={report.images[0].startsWith('http') ? report.images[0] : `http://localhost:8000${report.images[0]}`}
                              alt={report.pet_name}
                              className="h-32 w-32 object-cover rounded-md"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {report.status === 'inactive' && (
                          <button
                            onClick={() => handleActivateReport(report.id || report._id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm whitespace-nowrap"
                          >
                            ✓ Activate Report
                          </button>
                        )}
                        {report.status !== 'inactive' && (
                          <div className="flex flex-col gap-2">
                            <select
                              value={report.status}
                              onChange={(e) => handleUpdateReportStatus(report.id || report._id, e.target.value)}
                              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="inactive">Inactive</option>
                              <option value="active">Active</option>
                              <option value="pending">Pending</option>
                              <option value="found">Found</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                              <option value="adopted">Adopted</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            users.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No users found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Verified
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {u.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {u.user_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {u.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {u.is_verified ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-gray-400">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
