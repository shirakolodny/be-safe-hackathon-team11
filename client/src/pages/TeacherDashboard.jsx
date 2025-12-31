import { useState } from 'react';
// Material UI Imports
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Sub-Components
import TeacherMenu from '../components/teacher/TeacherMenu';
import CreateGame from '../components/teacher/CreateGame';
import GameStats from '../components/teacher/GameStats';

const TeacherDashboard = () => {
  const [activeView, setActiveView] = useState('menu');

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      
      {/* Header with blue underline style */}
      <Box sx={{ mb: 4, borderBottom: '2px solid #3498db', pb: 2 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          align="center" 
          sx={{ color: '#2980b9', fontWeight: 'bold' }}
        >
          ניהול המשחקים (מורים)
        </Typography>
      </Box>

      {/* Dynamic Content Area */}
      <Box>
        {activeView === 'menu' && (
          <TeacherMenu onNavigate={setActiveView} />
        )}

        {activeView === 'create' && (
          <CreateGame onBack={() => setActiveView('menu')} />
        )}

        {activeView === 'stats' && (
          <GameStats onBack={() => setActiveView('menu')} />
        )}
      </Box>

    </Container>
  );
};

export default TeacherDashboard;