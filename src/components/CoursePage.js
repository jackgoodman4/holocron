import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesData } from '../data/coursesData';
import './CoursePage.css';

const CoursePage = () => {
  const { courseId } = useParams();
  const course = coursesData.find(c => c.id === parseInt(courseId));
  const weeks = Array.from({ length: 16 }, (_, i) => i + 1);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="course-page">
      <header>
        <div className="nav-left">
          <Link to="/" className="nav-button">Home</Link>
        </div>
      </header>

      <section className="course-header">
        <h1>{course.title}</h1>
        <p className="current-week">Current Week: {course.currentWeek}</p>
        <Link to={`/course/${courseId}/grades`} className="grades-button">View Grades</Link>
      </section>

      <main className="schedule-section">
        <div className="weeks-grid">
          {weeks.map((weekNum) => (
            <div 
              key={weekNum} 
              className={`week-card ${weekNum === course.currentWeek ? 'current-week' : ''}`}
            >
              <div className="week-header">
                <h3>Week {weekNum}</h3>
                {weekNum === course.currentWeek && (
                  <span className="current-indicator">Current Week</span>
                )}
              </div>
              <div className="week-content">
                {course.assignments
                  .filter(assignment => {
                    const assignmentWeek = Math.ceil(
                      (new Date(assignment.dueDate) - new Date(2024, 0, 1)) / (7 * 24 * 60 * 60 * 1000)
                    );
                    return assignmentWeek === weekNum;
                  })
                  .map(assignment => (
                    <div key={assignment.id} className="week-assignment">
                      <Link 
                        to={`/course/${courseId}/assignment/${assignment.id}`} 
                        className="assignment-link"
                      >
                        <span className="assignment-title">{assignment.title}</span>
                        <span className="assignment-due">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </Link>
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CoursePage; 