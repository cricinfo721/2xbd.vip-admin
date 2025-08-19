// ImageModal.js
import React from 'react';
import './ImageModal.css'; // Ensure your styles are in this file

const ImageModal = ({ isOpen, imageSrc, onClose }) => {
  if (!isOpen) return null; // Don't render anything if modal is not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageSrc} alt="Large view" className="modal-image" />
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
