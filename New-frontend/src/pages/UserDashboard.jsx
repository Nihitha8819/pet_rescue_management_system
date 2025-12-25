import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "./UserDashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const UserDashboard = () => {
  const { user, token } = useAuth();
  const [myPets, setMyPets] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pets");

  useEffect(() => {
    if (user && token) {
      fetchUserData();
    }
  }, [user, token]);

  const fetchUserData = async () => {
    setLoading(true);
    setError("");

    try {
      const [petsResponse, reportsResponse] = await Promise.all([
        axios.get(`${API_URL}/pets/user/${user.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/pets/reports/user/${user.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setMyPets(petsResponse.data);
      setMyReports(reportsResponse.data);
    } catch (err) {
      setError("Failed to load your data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;

    try {
      await axios.delete(`${API_URL}/pets/delete/${petId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyPets((prev) => prev.filter((pet) => pet.id !== petId));
    } catch {
      alert("Failed to delete pet. Try again.");
    }
  };
  const handleDeleteReport = async (reportId) => {
  if (!window.confirm("Are you sure you want to delete this report?")) return;

  try {
    await axios.delete(`${API_URL}/pets/reports/delete/${reportId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMyReports((prev) => prev.filter((r) => r.id !== reportId));
  } catch {
    alert("Failed to delete report. Try again.");
  }
};


  if (!user) {
    return (
      <div className="ud-wrapper">
        <div className="ud-warning-box">
          <p>Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ud-wrapper">
      <div className="ud-header">
        <h1 className="ud-title">Welcome, {user?.name}!</h1>
        <p className="ud-subtitle">Manage your pet listings and reports</p>
      </div>

      <div className="ud-stats-grid">
        <div className="ud-stat-card ud-blue">
          <h3>My Pets</h3>
          <p className="ud-stat-number">{myPets.length}</p>
        </div>

        <div className="ud-stat-card ud-purple">
          <h3>My Reports</h3>
          <p className="ud-stat-number">{myReports.length}</p>
        </div>
      </div>

      <div className="ud-card">
        <h2 className="ud-card-title">Quick Actions</h2>
        <div className="ud-actions">
          <Link to="/ReportPet" className="ud-btn ud-blue">
            Report a Pet
          </Link>
          <Link to="/SearchPets" className="ud-btn ud-purple">
            Search Pets
          </Link>
        </div>
      </div>

      <div className="ud-tabs-card">
        <div className="ud-tabs">
          <button
            onClick={() => setActiveTab("pets")}
            className={`ud-tab-btn ${activeTab === "pets" ? "active" : ""}`}>
            My Pets ({myPets.length})
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`ud-tab-btn ${activeTab === "reports" ? "active" : ""}`}>
            My Reports ({myReports.length})
          </button>
        </div>

        <div className="ud-tab-content">
          {loading ? (
            <div className="ud-loading">Loading...</div>
          ) : error ? (
            <div className="ud-error-box">{error}</div>
          ) : activeTab === "pets" ? (
            myPets.length === 0 ? (
              <p className="ud-empty">You haven’t listed any pets yet.</p>
            ) : (
              <div className="ud-list">
                {myPets.map((pet) => (
                  <div key={pet.id} className="ud-item-card">
                    <div className="ud-item-info">
                      <h3>{pet.name}</h3>
                      <p>{pet.description}</p>
                      <div className="ud-meta">
                        <span>Type: {pet.pet_type}</span>
                        <span>Status: {pet.status}</span>
                        <span>Location: {pet.location}</span>
                      </div>
                    </div>

                    <div className="ud-item-actions">
                      <Link to={`/pets/edit/${pet.id}`}
                      className="ud-edit-btn">Edit</Link>
                      
                      <button onClick={() => handleDeletePet(pet.id)}
                      className="ud-delete-btn">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : myReports.length === 0 ? (
            <div className="ud-empty">
              <p>You haven’t submitted any reports yet.</p>
              <Link to="/report-pet" className="ud-link">
                Submit a report
              </Link>
            </div>
          ) : (
            <div className="ud-list">
              {myReports.map((report) => (
  <div key={report.id} className="ud-item-card">
    <div className="ud-item-info">
      <h3>{report.pet_name}</h3>
      <p>{report.description}</p>

      <div className="ud-meta">
        <span>Type: {report.pet_type}</span>
        <span>Location: {report.location_found}</span>
      </div>
    </div>

    <div className="ud-item-actions">
      <span className={`ud-status ud-${report.status}`}>
        {report.status}
      </span>

      <button onClick={() => handleDeleteReport(report.id)}
      className="ud-delete-btn">Delete</button>
    </div>
  </div>
))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
