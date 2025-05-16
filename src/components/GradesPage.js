import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { coursesData } from '../data/coursesData';
import './GradesPage.css';

const GradesPage = () => {
  const { courseId } = useParams();
  const course = coursesData.find(c => c.id === parseInt(courseId));

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="grades-page">
      <header>
        <div className="nav-left">
          <Link to="/" className="nav-button">Home</Link>
        </div>
      </header>

      <section className="grades-header">
        <div className="title-container">
          <Link to={`/course/${courseId}`} className="back-arrow">←</Link>
          <h1>Grades</h1>
        </div>
      </section>

      <section className="grades-header">
        <p className="class-name">{course.title}</p>
      </section>

      <main className="grades-content">
        <div className="assignments-list">
          {course.assignments.map((assignment) => (
            <Link 
              to={`/course/${courseId}/assignment/${assignment.id}`}
              key={assignment.id} 
              className="grade-card"
            >
              <div className="assignment-info">
                <h3>{assignment.title}</h3>
                <p className="due-date">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="grade-info">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${assignment.progress}%` }}
                  />
                </div>
                <span className="grade-percentage">{assignment.progress}%</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="grade-total">
          <span className="total-label">Total:</span>
          <span className="total-value">{course.progress}%</span>
        </div>
      </main>
    </div>
  );
};

export default GradesPage; 