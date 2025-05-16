import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CoursesOverview from './components/CoursesOverview';
import ChatBot from './components/ChatBot';
import CoursePage from './components/CoursePage';
import GradesPage from './components/GradesPage';
import AssignmentPage from './components/AssignmentPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoursesOverview />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/course/:courseId" element={<CoursePage />} />
        <Route path="/course/:courseId/grades" element={<GradesPage />} />
        <Route path="/course/:courseId/assignment/:assignmentId" element={<AssignmentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
