import React from 'react';
import { Link } from 'react-router-dom';
import { coursesData } from '../data/coursesData';
import './CoursesOverview.css'; // Import the CSS file

const CoursesOverview = () => {
  // Get all assignments from all courses and sort by due date
  const allAssignments = coursesData.flatMap(course => 
    course.assignments.map(assignment => ({
      ...assignment,
      courseName: course.title,
      courseId: course.id
    }))
  ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="courses-overview">
      <header>
        <div className="nav-left">
          <Link to="/" className="nav-button">Home</Link>
        </div>
        <div className="nav-right">
          <Link to="/chatbot" className="nav-button">ChatBot</Link>
        </div>
      </header>

      <main>
        <section className="courses-section">
          <h1>Your Courses</h1>
          <div className="courses-grid">
            {coursesData.map((course) => (
              <Link 
                to={`/course/${course.id}`} 
                key={course.id} 
                className="course-card"
              >
                <span className="progress">{course.progress}%</span>
                <span className="course-title">{course.title}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="todo-section">
          <h2>To-Do List</h2>
          <div className="assignments-list">
            {allAssignments.map((assignment) => (
              <Link 
                to={`/course/${assignment.courseId}/assignment/${assignment.id}`}
                key={`${assignment.courseId}-${assignment.id}`} 
                className="assignment-card"
              >
                <div className="assignment-info">
                  <h3>{assignment.title}</h3>
                  <p className="course-name">{assignment.courseName}</p>
                </div>
                <div className="due-date">
                  Due {formatDate(assignment.dueDate)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CoursesOverview;
