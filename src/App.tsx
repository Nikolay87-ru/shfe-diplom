import React, { JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GuestPage } from "./pages/GuestPage";
import { AdminPanel } from "./pages/AdminPanel";
import { SeatSelection } from "./pages/SeatSelection";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MoviesProvider } from "./context/MoviesContext";
import { Login } from "./components/admin/Login/Login";

function PrivateRoute({children}: {children: JSX.Element}) {
  const {isAdmin} = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <MoviesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GuestPage />} />
            <Route path="/seats/:id" element={<SeatSelection />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={
              <PrivateRoute><AdminPanel /></PrivateRoute>
            } />
            {/* Добавьте другие маршруты по необходимости */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </MoviesProvider>
    </AuthProvider>
  );
}
