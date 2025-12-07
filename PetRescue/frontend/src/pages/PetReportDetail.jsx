import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const PetReportDetail = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchReportDetails();
    }, [reportId]);

    const fetchReportDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/pets/report/${reportId}/`);
            setReport(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch report details');
            console.error('Error fetching report:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!user) {
            alert('Please login to update status');
            navigate('/login');
            return;
        }

        setUpdating(true);
        try {
            const token = localStorage.getItem('access_token');
            
            // Use the new mark-found endpoint for marking as found
            if (newStatus === 'found') {
                await axios.post(
                    `${API_URL}/pets/report/${reportId}/mark-found/`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } else {
                // Use the update endpoint for other status changes
                await axios.put(
                    `${API_URL}/pets/report/update/${reportId}/`,
                    { status: newStatus },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }
            
            // Refresh the report data
            await fetchReportDetails();
            alert(`Status updated to ${newStatus}!`);
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status. You can only update your own reports.');
        } finally {
            setUpdating(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image+Available';
        if (imagePath.startsWith('http')) return imagePath;
        // Remove /api prefix for media files - media is served from root, not /api
        const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        // Extract base URL without /api
        const baseUrl = API_BASE.replace('/api', '');
        return `${baseUrl}${imagePath}`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'inactive':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            case 'active':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'found':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'lost':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading report details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    if (!report) return null;

    const isOwner = user && user.id === report.created_by;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <button
                    onClick={() => navigate('/search')}
                    className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Search
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                        <h1 className="text-3xl font-bold mb-2">{report.pet_name}</h1>
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(report.status)}`}>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                            <span className="text-blue-100">
                                Reported on {new Date(report.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 p-6">
                        {/* Images Section */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Images</h2>
                            {report.images && report.images.length > 0 ? (
                                <div className="space-y-4">
                                    {report.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={getImageUrl(image)}
                                            alt={`${report.pet_name} ${index + 1}`}
                                            className="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                                    <span className="text-gray-500">No images available</span>
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Details</h2>
                            <div className="space-y-4">
                                <div className="border-b pb-3">
                                    <span className="font-semibold text-gray-700">Pet Type:</span>
                                    <span className="ml-2 capitalize">{report.pet_type}</span>
                                </div>
                                
                                <div className="border-b pb-3">
                                    <span className="font-semibold text-gray-700">Location Found:</span>
                                    <span className="ml-2">{report.location_found}</span>
                                </div>
                                
                                <div className="border-b pb-3">
                                    <span className="font-semibold text-gray-700">Contact Info:</span>
                                    <span className="ml-2">{report.contact_info || 'Not provided'}</span>
                                </div>

                                <div className="pt-2">
                                    <span className="font-semibold text-gray-700 block mb-2">Description:</span>
                                    <p className="text-gray-600 leading-relaxed">{report.description}</p>
                                </div>
                            </div>

                            {/* Status Update Section */}
                            {user && isOwner && report.status !== 'found' && (
                                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h3 className="font-bold text-lg mb-3">Update Status</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Did you find your pet? Click the button below to mark it as found.
                                    </p>
                                    <button
                                        onClick={() => handleStatusUpdate('found')}
                                        disabled={updating}
                                        className="w-full py-3 px-4 rounded-lg font-semibold transition-colors bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    >
                                        {updating ? 'Updating...' : '✓ Mark Pet as Found'}
                                    </button>
                                </div>
                            )}

                            {user && isOwner && report.status === 'found' && (
                                <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-sm text-green-700 font-semibold">
                                        ✓ This pet has been marked as found!
                                    </p>
                                </div>
                            )}

                            {!user && (
                                <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Is this your pet?</span> Please{' '}
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="text-blue-600 hover:text-blue-800 font-semibold underline"
                                        >
                                            login
                                        </button>{' '}
                                        to contact the reporter.
                                    </p>
                                </div>
                            )}

                            {user && !isOwner && (
                                <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Is this your pet?</span> Contact the reporter at: {report.contact_info || 'Contact info not provided'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetReportDetail;
