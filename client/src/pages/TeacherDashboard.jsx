import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Import all components including the NEW Lobby
import TeacherMenu from '../components/teacher/TeacherMenu';
import CreateGame from '../components/teacher/CreateGame';
import GameStats from '../components/teacher/GameStats';
import TeacherGameLobby from '../components/teacher/TeacherGameLobby'; 

const TeacherDashboard = () => {
  const [activeView, setActiveView] = useState('menu'); // Possible values: 'menu', 'create', 'enter-code', 'lobby'
  const [activeGameCode, setActiveGameCode] = useState(null);

  // Function to handle navigation to the Lobby
  const goToLobby = (code) => {
    setActiveGameCode(code);
    setActiveView('lobby'); // This triggers the switch to the new screen
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, borderBottom: '2px solid #3498db', pb: 2 }}>
        <Typography variant="h5" align="center" sx={{ color: '#2980b9', fontWeight: 'bold' }}>
          ניהול המשחקים (מורים)
        </Typography>
      </Box>

      {/* 1. MAIN MENU */}
      {activeView === 'menu' && (
        <TeacherMenu onNavigate={(view) => {
          // Translate menu selection to view names
          if (view === 'create') setActiveView('create');
          if (view === 'stats') setActiveView('enter-code'); 
        }} />
      )}

      {/* 2. CREATE GAME FORM */}
      {activeView === 'create' && (
        <CreateGame 
            onBack={() => setActiveView('menu')} 
            onGameCreated={goToLobby} // When game is created -> Go to Lobby
        />
      )}

      {/* 3. ENTER EXISTING CODE FORM */}
      {activeView === 'enter-code' && (
        <GameStats 
            onBack={() => setActiveView('menu')} 
            onGameFound={goToLobby} // When code is entered -> Go to Lobby
        />
      )}

      {/* 4. THE LOBBY (New Screen) */}
      {activeView === 'lobby' && activeGameCode && (
        <TeacherGameLobby 
            gameCode={activeGameCode} 
            onBack={() => setActiveView('menu')} 
        />
      )}

    </Container>
  );
};

export default TeacherDashboard;