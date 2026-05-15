import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentsPage from './pages/StudentsPage';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Student Manager</div>
        <nav className="app-nav">
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Login
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Register
          </NavLink>
          <NavLink to="/students" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Students
          </NavLink>
        </nav>
      </header>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
