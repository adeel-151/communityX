import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import Residents from './pages/Residents';
import Complaints from './pages/Complaints';
import Visitors from './pages/Visitors';
import Bills from './pages/Bills';
import Notices from './pages/Notices';
import './index.css';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="users" element={<Residents />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="visitors" element={<Visitors />} />
            <Route path="bills" element={<Bills />} />
            <Route path="notices" element={<Notices />} />
            {/* Future routes will go here: users, visitors, complaints */}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
