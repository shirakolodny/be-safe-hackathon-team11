import { useState } from "react";
// Material UI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Internal Components
import Header from "./components/layout/Header";
import Button from "./components/common/Button";

// Pages
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

// --- STYLES DEFINITION ---
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
  welcomeSection: {
    width: "100%",
  },
  mainTitle: {
    fontWeight: "700",
    color: "#2c3e50",
    mb: 2,
    fontFamily: "Rubik, sans-serif",
  },
  buttonStack: {
    mt: 6,
  },
  roleButton: {
    py: 2,
    px: 4,
    fontSize: "1.3rem",
    borderRadius: 2,
    width: { xs: "100%", sm: "auto" },
    fontFamily: "Rubik, sans-serif",
    fontWeight: "bold",

    backgroundColor: "#2E6E65",
    color: "#fff",

    "&:hover": {
      backgroundColor: "#265751ff",
    },
  },

  navButton: {
    color: "#2E6E65",
    borderColor: "#2E6E65",
    fontFamily: "Rubik, sans-serif",
    fontWeight: "bold",
    borderRadius: 2,
    px: 3,
    fontSize: "1rem",
    minWidth: "120px",
    gap: "10px",
  },
  backButtonWrapper: {
    display: "flex",
    mb: 3,
  },
  footer: {
    p: 2,
    mt: "auto",
    backgroundColor: "#ecf0f1",
    textAlign: "center",
    fontFamily: "Rubik, sans-serif",
  },
};

function App() {
  // State to manage the main views: 'home', 'teacher', or 'student'
  const [currentView, setCurrentView] = useState("home");

  return (
    <Box sx={styles.appWrapper}>
      <Header />

      <Container maxWidth="md" sx={styles.mainContainer}>
        {/* VIEW 1: Home Screen (Role Selection) */}
        {currentView === "home" && (
          <Box
            sx={{
              minHeight: "calc(100vh - 64px - 56px)", // header + footer (אפשר לשנות לפי הגובה אצלך)
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Box sx={{ width: "100%", px: 2 }}>
              <Typography variant="h4" component="h2" sx={styles.mainTitle}>
                ברוכים הבאים למשחק Viral Decision
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 720, mx: "auto", mb: 3, lineHeight: 1.9 }}
              >
                במשחק <b>Viral Decision</b> תתמודדו עם סיטואציות אמיתיות מהעולם
                הדיגיטלי: פייק ניוז, פרטיות, שיימינג ובריונות ברשת. בכל סיטואציה
                תבחרו איך להגיב, תקבלו משוב, ותלמדו לקבל החלטות חכמות ובטוחות
                ברשת.
              </Typography>

              <Typography variant="h5" color="text.secondary" paragraph>
                בחרו את תפקידכם כדי להתחיל:
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={4}
                justifyContent="center"
                sx={styles.buttonStack}
              >
                <Button
                  variant="primary"
                  onClick={() => setCurrentView("teacher")}
                  size="large"
                  sx={styles.roleButton}
                >
                  מורה
                </Button>

                <Button
                  variant="primary"
                  onClick={() => setCurrentView("student")}
                  size="large"
                  sx={styles.roleButton}
                >
                  תלמיד/ה
                </Button>
              </Stack>
            </Box>
          </Box>
        )}

        {/* VIEW 2: Teacher Dashboard */}
        {currentView === "teacher" && (
          <Box>
            <Box sx={styles.backButtonWrapper}>
              <Button
                variant="secondary"
                onClick={() => setCurrentView("home")}
                startIcon={<ArrowForwardIcon />}
                sx={styles.navButton}
              >
                חזרה לראשי
              </Button>
            </Box>
            <TeacherDashboard />
          </Box>
        )}

        {/* VIEW 3: Student Dashboard */}
        {/* Note: This component now handles the Lobby vs Game logic internally */}
        {currentView === "student" && (
          <Box>
            <Box sx={styles.backButtonWrapper}>
              <Button
                variant="secondary"
                onClick={() => setCurrentView("home")}
                startIcon={<ArrowForwardIcon />}
                sx={styles.navButton}
              >
                חזרה לראשי
              </Button>
            </Box>

            <StudentDashboard />
          </Box>
        )}
      </Container>

      {/* Footer Section */}
      <Box component="footer" sx={styles.footer}>
        <Typography variant="body2" color="text.secondary">
          © 2025 QueenB Hackathon - Team 11
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
