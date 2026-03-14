import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./dashboard/DashboardLayout";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Classes from "./pages/Classes";
import Instructors from "./pages/Instructors";
import Registration from "./components/Registration";
import PrivateRoute from "./dashboard/PrivateRoute";
//user
import DashboardHome from "./dashboard/DashboardHome";
import MySelected from "./dashboard/MySelected";
import MyEnrolled from "./dashboard/MyEnrolled";
import PaymentHistory from "./dashboard/PaymentHistory";
import ApplyInstructor from "./dashboard/ApplyInstructor";
//instructor
import AddClass from "./instructor/AddClass";
import MyClasses from "./instructor/MyClasses";
import ApprovedClasses from "./instructor/ApprovedClasses";
import PendingClasses from "./instructor/PendingClasses";
//admin
import ManageUsers from "./admin/ManageUsers";
import ManageClasses from "./admin/ManageClasses";
import Applications from "./admin/Applications";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "./checkout/Checkout";
import ClassDetails from "./pages/ClassDetails"
import { Toaster } from 'react-hot-toast';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


export default function App() {
  return (
    <>
      <Toaster position="top-center"/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/classes/:id" element={<ClassDetails />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            {/* user routes */}
            <Route path="my-enrolled" element={<MyEnrolled />} />
            <Route path="my-selected" element={<MySelected />} />
            <Route
              path="/dashboard/payment-info"
              element={
                <Elements stripe={stripePromise}>
                  <Checkout />
                </Elements>
              }
            />
            <Route path='/dashboard/payment-history' element={<PaymentHistory/>}/>
            <Route path="apply-instructor" element={<ApplyInstructor />} />

            {/* // instructor routes */}
            <Route path="add-class" element={<AddClass />} />
            <Route path="my-classes" element={<MyClasses />} />
            <Route path="pending-classes" element={<PendingClasses />} />
            <Route path="approved-classes" element={<ApprovedClasses />} />

            {/* admin routes */}
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="manage-classes" element={<ManageClasses />} />
            <Route path="applications" element={<Applications />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}