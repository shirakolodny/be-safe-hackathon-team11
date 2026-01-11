import { useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SchoolIcon from "@mui/icons-material/School";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import PropTypes from "prop-types";

const StudentLobby = ({ onStart }) => {
  const [gameCode, setGameCode] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    // Basic validation
    if (!gameCode.trim() || !username.trim()) {
      setError("נא למלא קוד משחק וכינוי");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Attempt to join/reserve the username on the server
      const res = await fetch(
        `http://localhost:5001/games/${gameCode.trim()}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim() }),
        }
      );

      // Step 2: Handle "Username Taken" (409) - Check if it's a returning user
      if (res.status === 409) {
        const savedSession = localStorage.getItem("studentSession");

        if (savedSession) {
          const session = JSON.parse(savedSession);
          // Check if the current input matches the saved session
          if (
            session.username === username.trim() &&
            session.gameCode === gameCode.trim()
          ) {
            // IT IS A MATCH! This is the original user trying to reconnect.
            // Allow them to proceed (Resume Game).
            onStart({ gameCode: gameCode.trim(), username: username.trim() });
            return;
          }
        }

        // If no match, it's a real conflict (imposter or new user with same name)
        throw new Error("הכינוי הזה כבר תפוס במשחק, אנא בחר/י כינוי אחר.");
      }

      // Handle general errors (e.g. Game not found)
      if (!res.ok) {
        throw new Error("לא ניתן להתחבר למשחק (אולי הקוד שגוי?)");
      }

      // Step 3: Success (New User)
      onStart({ gameCode: gameCode.trim(), username: username.trim() });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 0,
          marginBottom: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Icon & Title */}
        <Box
          sx={{
            m: 1,
            bgcolor: "secondary.main",
            p: 1,
            borderRadius: "50%",
            color: "white",
            backgroundColor: "#2B3752",
          }}
        >
          <SchoolIcon
            fontSize="medium"
            sx={{ color: "#F4F7ED", backgroundColor: "#2B3752" }}
          />
        </Box>

        <Typography
          component="h1"
          variant="h5"
          sx={{ mb: 3, fontFamily: "Rubik, sans-serif", color: "#2B3752" }}
        >
          כניסה למשחק
        </Typography>

        {/* Login Form */}
        <Paper elevation={3} sx={{ p: 3, width: "80%", borderRadius: 2 }}>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="dense"
              size="small"
              required
              fullWidth
              label="קוד משחק"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              dir="rtl"
              disabled={loading}
              InputLabelProps={{ style: { fontFamily: "Rubik, sans-serif" } }}
              sx={{
                // טקסט רגיל (לא בפוקוס)
                "& .MuiInputBase-input": {
                  color: "#000",
                  fontFamily: "Rubik, sans-serif",
                },

                // טקסט בפוקוס בלבד
                "& .MuiInputBase-input:focus": {
                  color: "#2E6E65",
                },

                // label רגיל
                "& .MuiInputLabel-root": {
                  color: "#9e9e9e",
                  fontFamily: "Rubik, sans-serif",
                },

                // label בפוקוס
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#2E6E65",
                },

                // מסגרת רגילה
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9e9e9e",
                },

                // מסגרת בפוקוס בלבד
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#2E6E65",
                  },
              }}
            />

            <TextField
              margin="dense"
              size="small"
              required
              fullWidth
              label="כינוי"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              dir="rtl"
              disabled={loading}
              InputLabelProps={{ style: { fontFamily: "Rubik, sans-serif" } }}
              sx={{
                // טקסט רגיל
                "& .MuiInputBase-input": {
                  color: "#000",
                  fontFamily: "Rubik, sans-serif",
                },

                // טקסט בפוקוס בלבד
                "& .MuiInputBase-input:focus": {
                  color: "#2E6E65",
                },

                // label רגיל
                "& .MuiInputLabel-root": {
                  color: "#9e9e9e",
                  fontFamily: "Rubik, sans-serif",
                },

                // label בפוקוס
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#2E6E65",
                },

                // מסגרת רגילה
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9e9e9e",
                },

                // מסגרת בפוקוס בלבד
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#2E6E65",
                  },
              }}
            />

            {/* Error Message Display */}
            {error && (
              <Alert severity="error" sx={{ mt: 2, fontSize: "0.9rem" }}>
                {error}
              </Alert>
            )}

            <Button
              type="button"
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleStart}
              disabled={loading}
              sx={{
                mt: 2,
                mb: 1,
                py: 1,
                fontSize: "1.1rem",
                fontWeight: "bold",
                fontFamily: "Rubik, sans-serif",
                color: "#F4F7ED",
                backgroundColor: "#2E6E65",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="#2E6E65" />
              ) : (
                "בואו נתחיל!"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

StudentLobby.propTypes = {
  onStart: PropTypes.func.isRequired,
};

export default StudentLobby;
