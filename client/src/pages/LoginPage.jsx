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

const focusedGreenTextField = {
  "& .MuiInputBase-input": {
    color: "#000",
    fontFamily: "Rubik, sans-serif",
  },
  "& .MuiInputBase-input:focus": {
    color: "#2E6E65",
  },
  "& .MuiInputLabel-root": {
    color: "#9e9e9e",
    fontFamily: "Rubik, sans-serif",
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
        py: 6,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="h5"
              align="center"
              sx={{
                mb: 2,
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
              sx={focusedGreenTextField}
            />

            <TextField
              fullWidth
              label="סיסמה"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="rtl"
              sx={focusedGreenTextField}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2, textAlign: "right" }}>
                {error}
              </Alert>
            )}

            <MuiButton
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                py: 1.2,
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
