import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button as MuiButton,
  Box,
  Alert,
} from "@mui/material";
import PropTypes from "prop-types";

// Custom style for the text fields to match the green theme
const focusedGreenTextField = {
  "& .MuiInputBase-input": {
    color: "#000",
    fontFamily: "Rubik, sans-serif",
    fontSize: "1.1rem", // Slightly larger text
  },
  "& .MuiInputBase-input:focus": {
    color: "#2E6E65",
  },
  "& .MuiInputLabel-root": {
    color: "#9e9e9e",
    fontFamily: "Rubik, sans-serif",
    fontSize: "1rem",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#2E6E65",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#9e9e9e",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2E6E65",
  },
};

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("נא למלא שם משתמש וסיסמה");
      return;
    }

    const ok = onLogin(username.trim(), password);
    if (!ok) setError("פרטי התחברות שגויים");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F4F7ED",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "85vh", // Ensures vertical centering on full screen
        py: 4,
      }}
    >
      {/* Changed maxWidth to 'sm' for a wider card */}
      <Container maxWidth="sm">
        <Paper
          elevation={4} // Slightly deeper shadow
          sx={{
            p: 6, // Increased padding for a bigger look
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="h4" // Increased font size from h5
              align="center"
              sx={{
                mb: 4, // More spacing below title
                fontFamily: "Rubik, sans-serif",
                fontWeight: 800,
                color: "#2B3752",
              }}
            >
              התחברות למערכת
            </Typography>

            <TextField
              fullWidth
              label="שם משתמש"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              dir="rtl"
              sx={{
                ...focusedGreenTextField,
                mb: 3, // Add extra spacing between fields
              }}
            />

            <TextField
              fullWidth
              label="סיסמה"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="rtl"
              sx={{
                ...focusedGreenTextField,
                mb: 2,
              }}
            />

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                    mt: 2, 
                    mb: 2, 
                    textAlign: "right",
                    fontFamily: "Rubik, sans-serif" 
                }}
              >
                {error}
              </Alert>
            )}

            <MuiButton
              fullWidth
              type="submit"
              variant="contained"
              size="large" // Make button taller
              sx={{
                mt: 4,
                py: 1.5, // Increased vertical padding
                fontSize: "1.2rem",
                fontWeight: "bold",
                fontFamily: "Rubik, sans-serif",
                backgroundColor: "#2E6E65",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#265751",
                },
              }}
            >
              התחבר/י
            </MuiButton>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;