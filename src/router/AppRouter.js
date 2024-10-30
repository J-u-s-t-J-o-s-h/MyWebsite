import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import App from '../App';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import Dashboard from '../components/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import PortfolioSection from '../components/PortfolioSection';

export default function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/portfolio" 
            element={
              <ProtectedRoute>
                <Layout>
                  <PortfolioSection />
                </Layout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
} 