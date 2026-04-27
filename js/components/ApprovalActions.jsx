import React, { useState } from 'react';

/**
 * ConfirmDialog Component
 * Modal for confirming destructive actions
 */
const ConfirmDialog = ({ isOpen, title, message, confirmText, onConfirm, onCancel, isDangerous }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ApprovalActions Component
 * Action buttons for each donation record
 */
const ApprovalActions = ({
  donationId,
  status,
  onApprove,
  onReject,
  isProcessing = false,
}) => {
  const [showConfirmReject, setShowConfirmReject] = useState(false);

  const isDisabled = status !== 'pending' || isProcessing;

  const handleApproveClick = async () => {
    if (onApprove) {
      await onApprove(donationId);
    }
  };

  const handleRejectClick = () => {
    setShowConfirmReject(true);
  };

  const handleConfirmReject = async () => {
    if (onReject) {
      await onReject(donationId);
    }
    setShowConfirmReject(false);
  };

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {/* Approve Button */}
        <button
          onClick={handleApproveClick}
          disabled={isDisabled}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all ${
            isDisabled
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-50'
              : 'bg-green-100 text-green-700 hover:bg-green-200 active:bg-green-300'
          }`}
          title={isDisabled && status !== 'pending' ? 'Already processed' : 'Approve this donation'}
          aria-label={`Approve donation ${donationId}`}
        >
          {isProcessing ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </>
          ) : (
            <>
              <span>✓</span>
              Approve
            </>
          )}
        </button>

        {/* Reject Button */}
        <button
          onClick={handleRejectClick}
          disabled={isDisabled}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all ${
            isDisabled
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-50'
              : 'bg-red-100 text-red-700 hover:bg-red-200 active:bg-red-300'
          }`}
          title={isDisabled && status !== 'pending' ? 'Already processed' : 'Reject this donation'}
          aria-label={`Reject donation ${donationId}`}
        >
          {isProcessing ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </>
          ) : (
            <>
              <span>✕</span>
              Reject
            </>
          )}
        </button>
      </div>

      {/* Status Badge */}
      {status !== 'pending' && (
        <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
          status === 'approved'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmReject}
        title="Reject Donation"
        message={`Are you sure you want to reject donation ${donationId}? This action cannot be undone.`}
        confirmText="Reject"
        onConfirm={handleConfirmReject}
        onCancel={() => setShowConfirmReject(false)}
        isDangerous={true}
      />
    </>
  );
};

export default ApprovalActions;
