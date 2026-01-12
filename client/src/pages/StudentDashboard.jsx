import { useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// Components
import StudentLobby from "../components/student/StudentLobby";
import StudentGame from "../components/student/StudentGame";

const StudentDashboard = () => {
  // 1. Initialize State - ALWAYS start at lobby (User request)
  // We removed the auto-resume logic here. User must login manually.
  const [gameState, setGameState] = useState("lobby");
  const [gameInfo, setGameInfo] = useState({ gameCode: "", username: "" });

  // 2. Handler: Start/Resume a game from the Lobby
  const handleStartGame = (info) => {
    // We still save to localStorage so the Lobby can verify identity later
    localStorage.setItem("studentSession", JSON.stringify(info));
    setGameInfo(info);
    setGameState("playing");
  };

  // 3. Handler: Finish the game
  const handleGameFinished = () => {
    setGameState("finished");
    localStorage.removeItem("studentSession");
  };

  // --- VIEW: Finished Screen ---
  if (gameState === "finished") {
    return (
      <Container 
        maxWidth="md" // Increased width (was sm)
        sx={{ 
          minHeight: "80vh", // Take up vertical space
          display: "flex", 
          alignItems: "center", // Vertically center
          justifyContent: "center", // Horizontally center
          textAlign: "center" 
        }}
      >
        <Paper 
          elevation={4} 
          sx={{ 
            p: 8, // Increased padding for a bigger look
            width: "100%",
            borderRadius: 4, // Softer corners
            border: "1px solid rgba(46, 110, 101, 0.2)", // Subtle border matching theme
            fontFamily: "Rubik, sans-serif" // Apply font to container
          }}
        >
          <Typography
            variant="h3" // Increased font size (was h4)
            sx={{ 
              mb: 3, 
              color: "#2B3752", 
              fontWeight: "900",
              fontFamily: "Rubik, sans-serif" // Apply font to title
            }}
          >
            סיימת את הלומדה!
          </Typography>
          
          <Typography
            variant="h5" // Increased font size (was h6)
            sx={{ 
              mb: 6, 
              color: "text.secondary",
              fontFamily: "Rubik, sans-serif" // Apply font to body text
            }}
          >
            התשובות שלך נשלחו בהצלחה למורה.
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            size="large" // Larger button
            onClick={() => {
              setGameState("lobby");
              setGameInfo({ gameCode: "", username: "" });
            }}
            sx={{
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: "#F4F7ED",
              backgroundColor: "#2E6E65",
              px: 6,
              py: 1.5,
              borderRadius: 2,
              fontFamily: "Rubik, sans-serif", // Apply font to button
              "&:hover": {
                backgroundColor: "#265751",
              },
            }}
          >
            יציאה
          </Button>
        </Paper>
      </Container>
    );
  }

  // --- VIEW: Playing Game ---
  if (gameState === "playing") {
    return (
      <StudentGame
        gameCode={gameInfo.gameCode.toUpperCase()}
        studentName={gameInfo.username}
        onGameFinished={handleGameFinished}
      />
    );
  }

  // --- VIEW: Lobby (Default) ---
  return <StudentLobby onStart={handleStartGame} />;
};

export default StudentDashboard;