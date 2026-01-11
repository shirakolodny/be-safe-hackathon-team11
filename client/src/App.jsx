import { useState } from "react";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

// Components
import Header from "./components/layout/Header";
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
  mainContainer: {
    mt: 4,
    flexGrow: 1,
    textAlign: "center",
  },
  greeting: {
    mb: 3,
    fontWeight: 700,
    textAlign: "center",
    color: "#2B3752",
  },
  footer: {
    p: 2,
    mt: "auto",
    backgroundColor: "#ecf0f1",
    textAlign: "center",
  },
};

function App() {
  const [user, setUser] = useState(null);

  // 🔐 Login handler
  const handleLogin = (username, password) => {
    const foundUser = findUser(username, password);

    if (!foundUser) {
      return false;
    }

    setUser({ role: foundUser.role }); // teacher | student
    return true;
  };

  const handleLogout = () => setUser(null);

  return (
    <Box sx={styles.appWrapper}>
      <Header onLogout={user ? handleLogout : undefined} />

      <Container maxWidth="md" sx={styles.mainContainer}>
        {/* 🔐 LOGIN */}
        {!user && <LoginPage onLogin={handleLogin} />}

        {/* 👋 GREETING */}
        {user && (
          <Typography variant="h5" sx={styles.greeting}>
            שלום {user.role === "teacher" ? "מורה/מנהל" : "תלמיד/ה"}
          </Typography>
        )}

        {/* 👩‍🏫 TEACHER */}
        {user?.role === "teacher" && <TeacherDashboard />}

        {/* 🧑‍🎓 STUDENT */}
        {user?.role === "student" && <StudentDashboard />}
      </Container>

      <Box component="footer" sx={styles.footer}>
        <Typography variant="body2" color="text.secondary">
          © 2025 QueenB Hackathon – Team 11
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
