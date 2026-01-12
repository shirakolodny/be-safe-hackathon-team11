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
    <Container 
      maxWidth="sm" // Changed from xs to sm for a wider look
      sx={{ 
        minHeight: "85vh", // Take up vertical space to allow centering
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", // Vertical centering
        alignItems: "center" 
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Icon & Title */}
        <Box
          sx={{
            m: 1,
            bgcolor: "secondary.main",
            p: 1.5,
            borderRadius: "50%",
            color: "white",
            backgroundColor: "#2B3752",
            mb: 2,
          }}
        >
          <SchoolIcon
            fontSize="large"
            sx={{ color: "#F4F7ED", backgroundColor: "#2B3752" }}
          />
        </Box>

        <Typography
          component="h1"
          variant="h4" // Increased font size
          sx={{ 
            mb: 4, 
            fontFamily: "Rubik, sans-serif", 
            color: "#2B3752",
            fontWeight: "bold"
          }}
        >
          כניסה למשחק
        </Typography>

        {/* Login Form */}
        <Paper 
          elevation={4} // Increased elevation for depth
          sx={{ 
            p: 5, // Increased padding
            width: "100%", 
            borderRadius: 3,
            fontFamily: "Rubik, sans-serif" 
          }}
        >
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal" // Changed from dense to normal for more spacing
              required
              fullWidth
              label="קוד משחק"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              dir="rtl"
              disabled={loading}
              InputLabelProps={{ style: { fontFamily: "Rubik, sans-serif" } }}
              sx={{
                mb: 3, // Add margin bottom

                // Normal text (not focused)
                "& .MuiInputBase-input": {
                  color: "#000",
                  fontFamily: "Rubik, sans-serif",
                  fontSize: "1.1rem"
                },

                // Text on focus
                "& .MuiInputBase-input:focus": {
                  color: "#2E6E65",
                },

                // Normal label
                "& .MuiInputLabel-root": {
                  color: "#9e9e9e",
                  fontFamily: "Rubik, sans-serif",
                },

                // Focused label
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#2E6E65",
                },

                // Normal border
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9e9e9e",
                },

                // Focused border
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#2E6E65",
                  },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="כינוי"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              dir="rtl"
              disabled={loading}
              InputLabelProps={{ style: { fontFamily: "Rubik, sans-serif" } }}
              sx={{
                mb: 2, 

                // Normal text
                "& .MuiInputBase-input": {
                  color: "#000",
                  fontFamily: "Rubik, sans-serif",
                  fontSize: "1.1rem"
                },

                // Text on focus
                "& .MuiInputBase-input:focus": {
                  color: "#2E6E65",
                },

                // Normal label
                "& .MuiInputLabel-root": {
                  color: "#9e9e9e",
                  fontFamily: "Rubik, sans-serif",
                },

                // Focused label
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#2E6E65",
                },

                // Normal border
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9e9e9e",
                },

                // Focused border
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#2E6E65",
                  },
              }}
            />

            {/* Error Message Display */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2, 
                  fontSize: "0.9rem", 
                  fontFamily: "Rubik, sans-serif" 
                }}
              >
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
                mt: 4,
                mb: 2,
                py: 1.5, // Taller button
                fontSize: "1.2rem",
                fontWeight: "bold",
                fontFamily: "Rubik, sans-serif",
                color: "#F4F7ED",
                backgroundColor: "#2E6E65",
                "&:hover": {
                    backgroundColor: "#265751",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
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