// src/dashboard/DashboardHome.jsx
import React from 'react'
import { useAuth } from '../context/AuthContext'
import Dashboard from './Dashboard'
import InstructorDashboard from './InstructorDashboard'
import AdminDashboard from './AdminDashboard'

export default function DashboardHome() {
  const { user } = useAuth();

  if (user?.role === 'instructor') return <InstructorDashboard />;
  if (user?.role === 'admin') return <AdminDashboard />;
  return <Dashboard />;
}
