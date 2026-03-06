import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import MainLayout from './layouts/MainLayout'
import PlaceholderPage from './pages/PlaceholderPage'
import AccountManagement from './pages/AccountManagement'
import './App.css'

function App() {
  // Simple mock auth state
  const [userRole, setUserRole] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route 
          path="/" 
          element={
            !userRole ? (
              <Login onLogin={(role) => setUserRole(role)} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        
        {/* Protected Routes inside MainLayout */}
        {userRole && (
          <Route element={<MainLayout userRole={userRole} onLogout={() => setUserRole(null)} />}>
            <Route path="/dashboard" element={<PlaceholderPage title={`${userRole} Dashboard`} />} />
            
            {/* Student & Shared Routes */}
            <Route path="/events" element={<PlaceholderPage title="Events View" />} />
            <Route path="/academic-tracker" element={<PlaceholderPage title="Academic Tracker" />} />
            <Route path="/achievements" element={<PlaceholderPage title="My Achievements" />} />
            <Route path="/violations" element={<PlaceholderPage title="My Violations" />} />
            <Route path="/medical-records" element={<PlaceholderPage title="My Medical Records" />} />
            <Route path="/profile" element={<PlaceholderPage title="My Profile" />} />
            
            {/* Faculty & Admin Routes */}
            <Route path="/course-management" element={<PlaceholderPage title="Course Management" />} />
            <Route path="/student-management" element={<PlaceholderPage title="Student Management" />} />
            <Route path="/event-management" element={<PlaceholderPage title="Event Management" />} />
            <Route path="/violation-management" element={<PlaceholderPage title="Violation Management" />} />
            <Route path="/medical-records-management" element={<PlaceholderPage title="Medical Records Management" />} />
            <Route path="/academic-records-management" element={<PlaceholderPage title="Academic Records Management" />} />
            
            {/* Admin Only Route */}
            <Route path="/account-management" element={<AccountManagement />} />
          </Route>
        )}

        {/* Catch all - Redirect to login if not authenticated or dashboard if authenticated */}
        <Route path="*" element={<Navigate to={userRole ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
