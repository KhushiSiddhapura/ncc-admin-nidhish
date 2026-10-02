import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Spinner from './components/common/Spinner';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// AO Pages
import AODashboard from './pages/ao/AODashboard';
import ANOList from './pages/ao/ANOList';
import ANOProgress from './pages/ao/ANOProgress';
import CreateAssignment from './pages/ao/CreateAssignment';
import AssignmentList from './pages/ao/AssignmentList';
import LectureSubmissions from './pages/ao/LectureSubmissions';

// ANO Pages
import ANODashboard from './pages/ano/ANODashboard';
import SubmitLecture from './pages/ano/SubmitLecture';
import MyLectures from './pages/ano/MyLectures';
import MyAssignments from './pages/ano/MyAssignments';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, initializing } = useAuth();
  if (initializing) return <Spinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'AO' ? '/ao/dashboard' : '/ano/dashboard'} replace />;
  }
  return children;
};

const RootRedirect = () => {
  const { user, initializing } = useAuth();
  if (initializing) return <Spinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'AO' ? '/ao/dashboard' : '/ano/dashboard'} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* AO Routes */}
          <Route path="/ao" element={
            <ProtectedRoute allowedRoles={['AO']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AODashboard />} />
            <Route path="anos" element={<ANOList />} />
            <Route path="anos/:anoId" element={<ANOProgress />} />
            <Route path="assignments" element={<AssignmentList />} />
            <Route path="assignments/create" element={<CreateAssignment />} />
            <Route path="lectures" element={<LectureSubmissions />} />
          </Route>

          {/* ANO Routes */}
          <Route path="/ano" element={
            <ProtectedRoute allowedRoles={['ANO']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<ANODashboard />} />
            <Route path="assignments" element={<MyAssignments />} />
            <Route path="submit-lecture" element={<SubmitLecture />} />
            <Route path="my-lectures" element={<MyLectures />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
