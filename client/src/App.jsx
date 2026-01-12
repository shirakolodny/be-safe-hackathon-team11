// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Components
import Header from "./components/layout/Header";
import HomePage from "./pages/HomePage";

// Auth helpers
import { Route, Routes, BrowserRouter } from "react-router-dom";

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
  return (
    <Box sx={styles.appWrapper}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Box component="footer" sx={styles.footer}>
        <Typography variant="body2" color="text.secondary">
          © 2025 QueenB Hackathon – Team 11
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
