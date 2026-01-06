import { useState } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'; 

// Components
import StudentLobby from '../components/student/StudentLobby'; 
import StudentGame from '../components/student/StudentGame'; 

const StudentDashboard = () => {
  
  // 1. Initialize State - ALWAYS start at lobby (User request)
  // We removed the auto-resume logic here. User must login manually.
  const [gameState, setGameState] = useState('lobby'); 
  const [gameInfo, setGameInfo] = useState({ gameCode: '', username: '' });

  // 2. Handler: Start/Resume a game from the Lobby
  const handleStartGame = (info) => {
    // We still save to localStorage so the Lobby can verify identity later
    localStorage.setItem('studentSession', JSON.stringify(info));
    setGameInfo(info);
    setGameState('playing');
  };

  // 3. Handler: Finish the game
  const handleGameFinished = () => {
    setGameState('finished');
    localStorage.removeItem('studentSession'); 
  };

  // --- VIEW: Finished Screen ---
  if (gameState === 'finished') {
    return (
        <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
            <Paper elevation={3} sx={{ p: 5, borderRadius: 2 }}>
                <Typography variant="h4" sx={{ mb: 2, color: '#27ae60', fontWeight: 'bold' }}>
                    כל הכבוד!
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, fontFamily: 'Rubik, sans-serif' }}>
                    התשובות שלך נשלחו בהצלחה למורה.
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => {
                        setGameState('lobby');
                        setGameInfo({ gameCode: '', username: '' });
                    }}
                    sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                    יציאה
                </Button>
            </Paper>
        </Container>
    );
  }

  // --- VIEW: Playing Game ---
  if (gameState === 'playing') {
    return (
      <StudentGame 
        gameCode={gameInfo.gameCode.toUpperCase()} 
        studentName={gameInfo.username}
        onGameFinished={handleGameFinished}
      />
    );
  }

  // --- VIEW: Lobby (Default) ---
  return (
    <StudentLobby onStart={handleStartGame} />
  );
};

export default StudentDashboard;