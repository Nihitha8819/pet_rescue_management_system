import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./AdminPage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const AdminReports = () => {
  const { user, token } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [matches, setMatches] = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState("");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchReports = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_URL}/pets/reports/admin/`, authHeaders);
      setReports(res.data);
    } catch (err) {
      console.error(
        "Failed to load admin reports",
        err.response?.status,
        err.response?.data
      );
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (reportId, status) => {
    try {
      await axios.patch(
        `${API_URL}/pets/reports/${reportId}/update-status/`,
        { status },
        authHeaders
      );

      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, status } : r
        )
      );
    } catch (err) {
      console.error("Status update failed", err);
      alert("Failed to update status");
    }
  };

  const runAIMatch = async () => {
    setMatchLoading(true);
    setMatchError("");

    try {
      const res = await axios.post(
        `${API_URL}/ai-matching/run/`,
        {},
        authHeaders
      );
      setMatches(res.data || []);
    } catch (err) {
      console.error("AI match failed", err?.response?.data || err);
      setMatchError("Failed to run AI matching. Make sure migrations are run: python manage.py makemigrations ai_matching && python manage.py migrate");
    } finally {
      setMatchLoading(false);
    }
  };

  const verifyMatch = async (matchId) => {
    try {
      await axios.post(
        `${API_URL}/ai-matching/matches/${matchId}/confirm/`,
        {},
        authHeaders
      );

      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId ? { ...m, admin_verified: true } : m
        )
      );
      fetchReports();
    } catch (err) {
      console.error("Verify match failed", err?.response?.data || err);
      alert("Failed to verify match");
    }
  };

  const notifyMatch = async (matchId) => {
    try {
      await axios.post(
        `${API_URL}/ai-matching/matches/${matchId}/notify/`,
        {},
        authHeaders
      );

      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId ? { ...m, notified: true } : m
        )
      );
      alert("Notification sent successfully to the lost pet owner with finder's contact details!");
    } catch (err) {
      console.error("Notify match failed", err?.response?.data || err);
      alert("Failed to send notification");
    }
  };

  if (!user || !user.is_staff) {
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

  const lostReports = filteredReports.filter((r) => r.report_type === "lost");
  const foundReports = filteredReports.filter((r) => r.report_type === "found");

  const counts = {
    pending: reports.filter((r) => r.status === "pending").length,
    active: reports.filter((r) => r.status === "active").length,
    inactive: reports.filter((r) => r.status === "inactive").length,
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-stats">
        <div className="stat pending">
          Pending <span>{counts.pending}</span>
        </div>
        <div className="stat active">
          Active <span>{counts.active}</span>
        </div>
        <div className="stat inactive">
          Inactive <span>{counts.inactive}</span>
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
      </div>

      {loading ? (
        <p className="admin-loading">Loading reports...</p>
      ) : error ? (
        <p className="admin-error">{error}</p>
      ) : activeTab === "active" ? (
        <div className="active-reports-layout">
          <div className="reports-column">
            <h2 className="column-title">Lost Reports ({lostReports.length})</h2>
            {lostReports.length === 0 ? (
              <p className="admin-empty">No lost reports</p>
            ) : (
              <div className="admin-list">
                {lostReports.map((report) => (
                  <div key={report.id} className="admin-card">
                    <div className="admin-image">
                      {report.images?.length > 0 ? (
                        <img
                          src={`http://localhost:8000${report.images[0].image}`}
                          alt="Pet"
                          className="admin-pet-image"
                        />
                      ) : (
                        <div className="admin-no-image">No Image</div>
                      )}
                    </div>
                    <div className="admin-info">
                      <h3>{report.pet_name || "Unknown Pet"}</h3>
                      <p>{report.description}</p>
                      <div className="admin-meta">
                        <span>Type: {report.pet_type}</span>
                        <span>Location: {report.location_found}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="reports-column">
            <h2 className="column-title">Found Reports ({foundReports.length})</h2>
            {foundReports.length === 0 ? (
              <p className="admin-empty">No found reports</p>
            ) : (
              <div className="admin-list">
                {foundReports.map((report) => (
                  <div key={report.id} className="admin-card">
                    <div className="admin-image">
                      {report.images?.length > 0 ? (
                        <img
                          src={`http://localhost:8000${report.images[0].image}`}
                          alt="Pet"
                          className="admin-pet-image"
                        />
                      ) : (
                        <div className="admin-no-image">No Image</div>
                      )}
                    </div>
                    <div className="admin-info">
                      <h3>{report.pet_name || "Unknown Pet"}</h3>
                      <p>{report.description}</p>
                      <div className="admin-meta">
                        <span>Type: {report.pet_type}</span>
                        <span>Location: {report.location_found}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : filteredReports.length === 0 ? (
        <p className="admin-empty">No {activeTab} reports</p>
      ) : (
        <div className="admin-list">
          {filteredReports.map((report) => (
            <div key={report.id} className="admin-card">
              <div className="admin-image">
                {report.images?.length > 0 ? (
                  <img
                    src={`http://localhost:8000${report.images[0].image}`}
                    alt="Pet"
                    className="admin-pet-image"
                  />
                ) : (
                  <div className="admin-no-image">No Image</div>
                )}
              </div>
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

      {/* AI Image Matching Section */}
      <section className="ai-matching-section">
        <div className="ai-matching-header">
          <h2>AI Image Matching (Lost vs Found)</h2>
          <button
            className="ai-run-btn"
            onClick={runAIMatch}
            disabled={matchLoading}
          >
            {matchLoading ? "Running..." : "Run AI Match"}
          </button>
        </div>

        {matchError && <p className="admin-error">{matchError}</p>}

        {matches.length === 0 && !matchLoading ? (
          <p className="admin-empty">
            No AI suggestions yet. Click &quot;Run AI Match&quot; to generate
            suggestions from active lost and found reports.
          </p>
        ) : (
          <div className="ai-matches-grid">
            {matches.map((m) => (
              <div key={m.id} className="ai-match-card">
                <div className="match-header">
                  <span className="match-badge">Match Found</span>
                  <span className="ai-score">Score: {(m.score * 100).toFixed(1)}%</span>
                </div>

                <div className="match-images-side-by-side">
                  <div className="match-report-box">
                    <h3>Lost Report</h3>
                    {m.lost_report.images?.length > 0 ? (
                      <img
                        src={`http://localhost:8000${m.lost_report.images[0].image}`}
                        alt="Lost Pet"
                        className="match-image"
                      />
                    ) : (
                      <div className="match-no-image">No Image</div>
                    )}
                    <div className="match-details">
                      <p><strong>Pet:</strong> {m.lost_report.pet_name || "Unknown"}</p>
                      <p><strong>Type:</strong> {m.lost_report.pet_type}</p>
                      <p><strong>Location:</strong> {m.lost_report.location_found}</p>
                    </div>
                  </div>

                  <div className="match-arrow">→</div>

                  <div className="match-report-box">
                    <h3>Found Report</h3>
                    {m.found_report.images?.length > 0 ? (
                      <img
                        src={`http://localhost:8000${m.found_report.images[0].image}`}
                        alt="Found Pet"
                        className="match-image"
                      />
                    ) : (
                      <div className="match-no-image">No Image</div>
                    )}
                    <div className="match-details">
                      <p><strong>Pet:</strong> {m.found_report.pet_name || "Unknown"}</p>
                      <p><strong>Type:</strong> {m.found_report.pet_type}</p>
                      <p><strong>Location:</strong> {m.found_report.location_found}</p>
                    </div>
                  </div>
                </div>

                <div className="ai-match-footer">
                  {!m.admin_verified ? (
                    <button
                      className="btn-verify"
                      onClick={() => verifyMatch(m.id)}
                    >
                      ✓ Verify Match
                    </button>
                  ) : (
                    <>
                      <span className="verified-badge">✓ Verified</span>
                      {!m.notified ? (
                        <button
                          className="btn-notify"
                          onClick={() => notifyMatch(m.id)}
                        >
                          📧 Notify Owner
                        </button>
                      ) : (
                        <span className="notified-badge">📧 Notified</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminReports;
