import { useState } from "react";
import { Container, Paper, Typography, TextField, Button, Box, Alert } from "@mui/material";
import PropTypes from "prop-types";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    // שדות ריקים
    if (!username.trim() || !password.trim()) {
      setError("נא למלא שם משתמש וסיסמה");
      return;
    }

    // ✅ אם onLogin מחזיר false -> נשארים פה ומציגים הודעה אחת
    const ok = onLogin(username.trim(), password);
    if (!ok) {
      setError("פרטי התחברות שגויים");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            התחברות למערכת
          </Typography>

          <TextField
            fullWidth
            label="שם משתמש"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            dir="rtl"
          />

          <TextField
            fullWidth
            label="סיסמה"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            dir="rtl"
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.2, fontWeight: "bold" }}
            onClick={handleSubmit}
          >
            התחבר/י
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;
