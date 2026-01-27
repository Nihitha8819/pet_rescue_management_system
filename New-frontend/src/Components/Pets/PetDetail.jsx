import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import PetImageCarousel from "../../pages/PetImageCarousel";
import "./PetDetail.css";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = "http://localhost:8000/api";
const MEDIA_HOST = "http://localhost:8000";

const PetDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const isLostFound = location.pathname.startsWith("/lost-found");

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingReunited, setMarkingReunited] = useState(false);

  useEffect(() => {
  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const url = isLostFound
        ? `${API_BASE}/pets/reports/${id}/`
        : `${API_BASE}/pets/adoption/${id}/`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPet(res.data);
    } catch (err) {
      console.error("Detail fetch failed:", err.response?.data);
      setError("Details not found");
    } finally {
      setLoading(false);
    }
  };

  fetchDetails();
}, [id, isLostFound, navigate]);

  if (loading) return <div className="pd-loading">Loading...</div>;
  if (error || !pet) return <div className="pd-error">Details not found</div>;

  const images =
    pet.images?.map(img =>
      img.image.startsWith("http")
        ? img.image
        : `${MEDIA_HOST}${img.image}`
    ) || [];

  const handleMarkReunited = async () => {
    if (!window.confirm("Mark this report as reunited? This will deactivate both the lost and found reports.")) {
      return;
    }

    try {
      setMarkingReunited(true);
      const token = localStorage.getItem("access_token");
      await axios.post(
        `${API_BASE}/pets/reports/${id}/mark-reunited/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Report marked as reunited! Both reports have been deactivated.");
      navigate("/user-dashboard");
    } catch (err) {
      console.error("Failed to mark as reunited", err.response?.data);
      alert(err.response?.data?.error || "Failed to mark as reunited");
    } finally {
      setMarkingReunited(false);
    }
  };

  // pet.user is the user ID (integer) from the serializer
  const isOwner = isLostFound && user && (pet.user === user.id || (typeof pet.user === 'object' && pet.user?.id === user.id));
  const isMatched = isLostFound && pet.match_status === "matched";
  const isReunited = isLostFound && pet.match_status === "reunited";

  return (
    <div className="pd-wrapper">
      <Link to={isLostFound ? "/lost-found" : "/adopt"} className="back-link">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="pd-card">
        <div className="pd-image-section">
          <PetImageCarousel images={images} />

          {isLostFound && (
            <>
              <span className={`pd-status-badge ${pet.report_type}`}>
                {pet.report_type.toUpperCase()}
              </span>
              {isMatched && (
                <span className="pd-status-badge matched">
                  ✓ Matched
                </span>
              )}
              {isReunited && (
                <span className="pd-status-badge reunited">
                  🎉 Reunited
                </span>
              )}
            </>
          )}
        </div>

        <div className="pd-info">
          <h1>{pet.name || pet.pet_name}</h1>

          <p><strong>Type:</strong> {pet.type || pet.pet_type}</p>
          {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
          {pet.age && <p><strong>Age:</strong> {pet.age}</p>}

          <p>
            <strong>Location:</strong>{" "}
            {pet.location || pet.location_found}
          </p>

          <p className="pd-description">{pet.description}</p>

          {isLostFound && isMatched && pet.matched_report && (
            <div className="matched-info-box">
              <h3>🎉 Match Found!</h3>
              <p>
                This report has been matched with a {pet.matched_report.report_type} report.
                {pet.match_score && (
                  <span> Similarity: {(pet.match_score * 100).toFixed(1)}%</span>
                )}
              </p>
              {isOwner && (
                <button
                  className="reunited-btn"
                  onClick={handleMarkReunited}
                  disabled={markingReunited}
                >
                  {markingReunited ? "Processing..." : "🎉 Mark as Reunited"}
                </button>
              )}
            </div>
          )}

          {!isLostFound && (
            <button
              className="primary-btn"
              onClick={() => navigate(`/adopt/${pet.id}/request`)}>
              Request Adoption
            </button>
          )}
          {isLostFound && !isReunited && (
            <button
              className="primary-btn"
              onClick={() => navigate(`/lost-found/${pet.id}/respond`)}>
              Respond to Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
