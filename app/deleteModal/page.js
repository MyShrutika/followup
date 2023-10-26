import React from 'react';

const DeleteConfirmationModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>Are you sure you want to delete this task?</p>
        <div className="modal-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
