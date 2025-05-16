import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesData } from '../data/coursesData';
import './AssignmentPage.css';

const AssignmentPage = () => {
  const { courseId, assignmentId } = useParams();
  const course = coursesData.find(c => c.id === parseInt(courseId));
  const assignment = course?.assignments.find(a => a.id === parseInt(assignmentId));
  const fileInputRef = useRef(null);
  
  // Initialize state from localStorage if available
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileMetadata, setFileMetadata] = useState(null);

  // Load saved file metadata from localStorage on component mount
  useEffect(() => {
    const savedMetadata = localStorage.getItem(`assignment-${courseId}-${assignmentId}`);
    if (savedMetadata) {
      const metadata = JSON.parse(savedMetadata);
      setFileMetadata(metadata);
      setIsSubmitted(true);
    }
  }, [courseId, assignmentId]);

  if (!course || !assignment) {
    return <div>Assignment not found</div>;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsSubmitted(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || isSubmitted) {
      fileInputRef.current.click();
      return;
    }

    // Create file metadata
    const metadata = {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      lastModified: selectedFile.lastModified,
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem(
      `assignment-${courseId}-${assignmentId}`,
      JSON.stringify(metadata)
    );

    // Update state
    setFileMetadata(metadata);
    setIsSubmitted(true);
    
    // For now, just show an alert
    alert(`File submitted: ${selectedFile.name}`);

    /* 
    TODO: Backend Integration
    - Upload file to server (e.g., AWS S3 or similar)
    - Save metadata to database with:
      - Student ID
      - Course ID
      - Assignment ID
      - File location
      - Submission timestamp
      - Version number (for resubmissions)
    */
  };

  const getButtonText = () => {
    if (!selectedFile) return 'Choose File';
    if (isSubmitted) return 'Choose New File';
    return 'Submit Assignment';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="assignment-page">
      <header>
        <div className="nav-left">
          <Link to="/" className="nav-button">Home</Link>
        </div>
      </header>

      <section className="assignment-header">
        <div className="title-container">
          <Link to={`/course/${courseId}`} className="back-arrow">←</Link>
          <h1>{assignment.title}</h1>
        </div>
      </section>

      <main className="assignment-content">
        <div className="grade-display">
          <span className="grade-value">{assignment.progress}%</span>
        </div>
        
        <div className="upload-section">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          {/* Show current file or saved file metadata */}
          {(selectedFile || fileMetadata) && (
            <div className="selected-file">
              <div className="file-info">
                <span className="file-name">
                  {selectedFile ? selectedFile.name : fileMetadata.name}
                  {isSubmitted && <span className="submitted-tag">Submitted</span>}
                </span>
                {isSubmitted && fileMetadata && (
                  <div className="file-details">
                    <span>Size: {formatFileSize(fileMetadata.size)}</span>
                    <span>Submitted: {formatDate(fileMetadata.submittedAt)}</span>
                  </div>
                )}
              </div>
              <button 
                className="remove-file"
                onClick={() => {
                  setSelectedFile(null);
                  setIsSubmitted(false);
                  setFileMetadata(null);
                  localStorage.removeItem(`assignment-${courseId}-${assignmentId}`);
                }}
              >
                ×
              </button>
            </div>
          )}

          <button 
            className={`submit-button ${isSubmitted ? 'resubmit' : ''}`}
            onClick={handleSubmit}
          >
            {getButtonText()}
          </button>
        </div>
      </main>
    </div>
  );
};

export default AssignmentPage; 