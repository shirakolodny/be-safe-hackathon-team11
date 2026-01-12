import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Components
import Header from "./components/layout/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

// Auth helpers
import { findUser } from "./auth/demoUsers";

const styles = {
  appWrapper: {
    minHeight: "100vh",
    backgroundColor: "#F4F7ED",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Rubik, sans-serif",
    direction: "rtl",
  },
  footer: {
    p: 2,
    mt: "auto",
    backgroundColor: "#ecf0f1",
    textAlign: "center",
  },
};

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username, password) => {
    const foundUser = findUser(username, password);
    if (!foundUser) return false;

    setUser({ role: foundUser.role, username: foundUser.username });
    return true;
  };

  const handleLogout = () => setUser(null);

  return (
    <Box sx={styles.appWrapper}>
      <Header onLogout={user ? handleLogout : undefined} />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : user.role === "teacher" ? (
              <TeacherDashboard />
            ) : (
              <StudentDashboard />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Box component="footer" sx={styles.footer}>
        <Typography variant="body2" color="text.secondary">
          © 2025 QueenB Hackathon – Team 11
        </Typography>
      </Box>
    </Box>
  );
}
