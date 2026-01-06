import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// --- Import Components ---
import TeacherMenu from '../components/teacher/TeacherMenu';
import CreateGame from '../components/teacher/CreateGame';

// Fix: Import the correct components based on our renaming
import TeacherJoinGame from '../components/teacher/TeacherJoinGame'; // The small form to enter a code
import TeacherGameLobby from '../components/teacher/TeacherGameLobby'; // The big dashboard with stats

const TeacherDashboard = () => {
  // State to manage the current view. Options: 'menu', 'create', 'enter-code', 'lobby'
  const [activeView, setActiveView] = useState('menu'); 
  const [activeGameCode, setActiveGameCode] = useState(null);

  /**
   * Helper function to switch to the Live Lobby view.
   * Called after creating a game OR successfully joining one.
   * @param {string} code - The game code to display
   */
  const goToLobby = (code) => {
    setActiveGameCode(code);
    setActiveView('lobby'); 
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      
      {/* Page Header */}
      <Box sx={{ mb: 4, borderBottom: '2px solid #3498db', pb: 2 }}>
        <Typography variant="h5" align="center" sx={{ color: '#2980b9', fontWeight: 'bold' }}>
          ניהול המשחקים (מורים)
        </Typography>
      </Box>

      {/* --- VIEW 1: Main Menu --- */}
      {activeView === 'menu' && (
        <TeacherMenu onNavigate={(view) => {
          // Translate menu selection to specific view names
          if (view === 'create') setActiveView('create');
          if (view === 'stats') setActiveView('enter-code'); 
        }} />
      )}

      {/* --- VIEW 2: Create New Game Form --- */}
      {activeView === 'create' && (
        <CreateGame 
            onBack={() => setActiveView('menu')} 
            onGameCreated={goToLobby} // Callback: When game is created -> Go to Lobby
        />
      )}

      {/* --- VIEW 3: Join Existing Game (Enter Code) --- */}
      {activeView === 'enter-code' && (
        <TeacherJoinGame 
            onBack={() => setActiveView('menu')} 
            onGameFound={goToLobby} // Callback: When code is valid -> Go to Lobby
        />
      )}

      {/* --- VIEW 4: Live Lobby & Statistics --- */}
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