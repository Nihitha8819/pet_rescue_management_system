import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./AdminPage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const AdminReports = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/pets/reports/admin/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch {
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (reportId, status) => {
    try {
      await axios.patch(
        `${API_URL}/pets/reports/${reportId}/update-status/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, status } : r
        )
      );
    } catch {
      alert("Failed to update status");
    }
  };
  
  if (!user || user.user_type !== "admin") {
    return (
      <div className="warning-wrapper">
        <div className="warning-card">
          <div className="admin-warning">Admin access only</div>
        </div>
      </div>
  );
  }

  const filteredReports = reports.filter(
    (r) => r.status === activeTab
  );

  const counts = {
    pending: reports.filter(r => r.status === "pending").length,
    active: reports.filter(r => r.status === "active").length,
    inactive: reports.filter(r => r.status === "inactive").length,
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Lost & Found Reports</h1>

      <div className="admin-stats">
        <div className="stat pending">
          Pending
          <span>{counts.pending}</span>
        </div>
        <div className="stat active">
          Active
          <span>{counts.active}</span>
        </div>
        <div className="stat inactive">
          Inactive
          <span>{counts.inactive}</span>
        </div>
      </div>

      <div className="admin-tabs">
        {["pending", "active", "inactive"].map((tab) => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        <button className="admin-tab-m" onClick={() => navigate("/ManageUsers")}>
          Manage Users
        </button>
      </div>

      {loading ? (
        <p className="admin-loading">Loading reports...</p>
      ) : error ? (
        <p className="admin-error">{error}</p>
      ) : filteredReports.length === 0 ? (
        <p className="admin-empty">No {activeTab} reports</p>
      ) : (
        <div className="admin-list">
          {filteredReports.map((report) => (
            <div key={report.id} className="admin-card">
              <div className="admin-info">
                <h3>{report.pet_name || "Unknown Pet"}</h3>
                <p>{report.description}</p>

                <div className="admin-meta">
                  <span>Type: {report.pet_type}</span>
                  <span>Location: {report.location_found}</span>
                  <span className={`status-badge ${report.status}`}>
                    {report.status}
                  </span>
                </div>
              </div>

              <div className="admin-actions">
                {report.status !== "active" && (
                  <button
                    className="btn-activate"
                    onClick={() => updateStatus(report.id, "active")}
                  >
                    Activate
                  </button>
                )}

                {report.status !== "inactive" && (
                  <button
                    className="btn-deactivate"
                    onClick={() => updateStatus(report.id, "inactive")}
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReports;
