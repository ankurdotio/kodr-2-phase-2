import { Routes, Route, Navigate, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h2 style={{ padding: '2rem' }}>404 - Not Found</h2>} />
      </Routes>
    </div>
  )
}

export default App
