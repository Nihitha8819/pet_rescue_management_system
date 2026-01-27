import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Phone, MessageSquare, Info } from "lucide-react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./LostFoundResponse.css";

const API_BASE = "http://localhost:8000/api";
const MEDIA_HOST = "http://localhost:8000";

const LostFoundResponse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [report, setReport] = useState(null);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingReport, setLoadingReport] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(
          `${API_BASE}/pets/reports/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReport(res.data);
        setPhone(user?.phone || "");
      } catch (err) {
        console.error("Failed to load report", err);
      } finally {
        setLoadingReport(false);
      }
    };

    if (user) {
      fetchReport();
    }
  }, [id, user]);

  const submitResponse = async (e) => {
    e.preventDefault();

    if (!phone.trim() || !message.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `${API_BASE}/pets/reports/${id}/respond/`,
        { phone: phone.trim(), message: message.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      alert("Response sent successfully! The report owner will be notified.");
      navigate(`/lost-found/${id}`);
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.detail || "Failed to send response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingReport) {
    return <div className="response-loading">Loading report details...</div>;
  }

  if (!report) {
    return (
      <div className="response-error">
        <p>Report not found</p>
        <Link to="/lost-found">Back to Lost & Found</Link>
      </div>
    );
  }

  const reportImage = report.images?.[0]?.image
    ? `${MEDIA_HOST}${report.images[0].image}`
    : null;

  return (
    <div className="response-container">
      <Link to={`/lost-found/${id}`} className="response-back-link">
        <ArrowLeft size={16} /> Back to Report
      </Link>

      <div className="response-layout">
        <div className="response-main">
          <div className="response-header">
            <h1>Respond to {report.report_type === "lost" ? "Lost" : "Found"} Pet Report</h1>
            <p>
              Share your contact information and message with the report owner.
              They will be notified and can contact you directly.
            </p>
          </div>

          {reportImage && (
            <div className="response-report-preview">
              <img src={reportImage} alt={report.pet_name || "Pet"} />
              <div className="response-report-info">
                <h3>{report.pet_name || "Unknown Pet"}</h3>
                <p><strong>Type:</strong> {report.pet_type}</p>
                <p><strong>Location:</strong> {report.location_found}</p>
                <p className="response-description">{report.description}</p>
              </div>
            </div>
          )}

          <form className="response-form" onSubmit={submitResponse}>
            <div className="form-section">
              <label>
                <Phone size={18} />
                Your Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your contact number"
                required
              />
              <small>This will be shared with the report owner</small>
            </div>

            <div className="form-section">
              <label>
                <MessageSquare size={18} />
                Your Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell the owner about the pet, where you saw it, or any relevant information..."
                rows={6}
                required
              />
              <small>Provide details that can help identify or locate the pet</small>
            </div>

            <div className="response-info-box">
              <Info size={18} />
              <div>
                <strong>What happens next?</strong>
                <ul>
                  <li>The report owner will receive a notification with your contact details</li>
                  <li>They can contact you directly using the information you provide</li>
                  <li>You can also check your dashboard for any updates</li>
                </ul>
              </div>
            </div>

            <div className="response-actions">
              <button
                type="button"
                className="response-cancel-btn"
                onClick={() => navigate(`/lost-found/${id}`)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="response-submit-btn"
                disabled={submitting || !phone.trim() || !message.trim()}
              >
                {submitting ? "Sending..." : "Send Response"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LostFoundResponse;
