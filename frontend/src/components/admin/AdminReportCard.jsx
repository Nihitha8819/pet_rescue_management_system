import React from 'react';

const AdminReportCard = ({ report, onStatusChange }) => {
  const status = report.status;

  return (
    <div className="border rounded-xl p-4 flex justify-between items-start">
      <div>
        <h3 className="font-semibold">
          {report.pet_name || 'Reported Pet'}
        </h3>
        <p className="text-sm text-gray-600">
          {report.description || 'No description provided.'}
        </p>
        <span
          className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
            status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : status === 'approved'
              ? 'bg-green-100 text-green-800'
              : status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {status}
        </span>
      </div>

      {status === 'pending' && (
        <div className="flex gap-2">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
            onClick={() => onStatusChange(report.id, 'approved')}
          >
            Approve
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
            onClick={() => onStatusChange(report.id, 'rejected')}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminReportCard;


