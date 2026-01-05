import { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
// Icons
// import SchoolIcon from '@mui/icons-material/School';
// import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 

// Internal Components
import Header from './components/layout/Header';
import Button from './components/common/Button'; 
import TeacherDashboard from './pages/TeacherDashboard';
import StudentLobby from './pages/StudentLobby';
import StudentDiagnostic from './pages/StudentDiagnostic';

// --- STYLES DEFINITION ---
// Centralized styles object for cleaner JSX
const styles = {
  appWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    display: 'flex',
    flexDirection: 'column',
    // Global font and direction settings
    fontFamily: 'Rubik, sans-serif', 
    direction: 'rtl' 
  },
  mainContainer: {
    mt: 4, 
    flexGrow: 1, 
    textAlign: 'center'
  },
  welcomeSection: {
    mt: 8
  },
  mainTitle: {
    fontWeight: '700', 
    color: '#2c3e50',
    mb: 2,
    fontFamily: 'Rubik, sans-serif',
  },
  buttonStack: {
    mt: 6
  },
  // Style for the large main menu buttons
  roleButton: {
    py: 2, 
    px: 4, 
    fontSize: '1.2rem', 
    borderRadius: 2,
    width: { xs: '100%', sm: 'auto' }, // Full width on mobile
    fontFamily: 'Rubik, sans-serif', 
    fontWeight: 'bold'
  },
  // Style for the "Back" button 
  navButton: {
    fontFamily: 'Rubik, sans-serif',
    fontWeight: 'bold',
    borderRadius: 2,
    px: 3,
    fontSize: '1rem',
    minWidth: '120px',
    gap: '10px'
  },
  backButtonWrapper: {
    display: 'flex', 
    mb: 3
  },
  footer: {
    p: 2, 
    mt: 'auto', 
    backgroundColor: '#ecf0f1', 
    textAlign: 'center',
    fontFamily: 'Rubik, sans-serif'
  }
};

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [studentSession, setStudentSession] = useState({ gameCode: '', username: '' });


  return (
    <Box sx={styles.appWrapper}>
      
      <Header />

      <Container maxWidth="md" sx={styles.mainContainer}>

        {/* VIEW: Home Screen */}
        {currentView === 'home' && (
          <Box sx={styles.welcomeSection}>
            
            <Typography variant="h4" component="h2" sx={styles.mainTitle}>
              ברוכים הבאים למשחק Viral Decision
            </Typography>
            
            <Typography variant="h5" color="text.secondary" paragraph>
              בחרו את תפקידכם כדי להתחיל:
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={4} 
              justifyContent="center" 
              sx={styles.buttonStack}
            >
              <Button 
                variant="primary"
                onClick={() => setCurrentView('teacher')}
                size="large"
                sx={styles.roleButton}
              >
                מורה
              </Button>

              <Button 
                variant="primary"
                onClick={() => setCurrentView('student')}
                size="large"
                sx={styles.roleButton}
              >
                תלמיד/ה
              </Button>
            </Stack>
          </Box>
        )}

        {/* VIEW: Teacher Dashboard */}
        {currentView === 'teacher' && (
          <Box>
            <Box sx={styles.backButtonWrapper}>
              {/* Back Button using the new 'navButton' style */}
              <Button 
                variant="secondary" 
                onClick={() => setCurrentView('home')}
                startIcon={<ArrowForwardIcon />} // Right arrow for RTL back
                sx={styles.navButton}
              >
                חזרה לראשי
              </Button>
            </Box>
            <TeacherDashboard />
          </Box>
        )}

        {/* VIEW: Student Lobby */}
        {currentView === 'student' && (
          <Box>
            <Box sx={styles.backButtonWrapper}>
               <Button 
                variant="secondary" 
                onClick={() => setCurrentView('home')}
                startIcon={<ArrowForwardIcon />}
                sx={styles.navButton}
              >
                חזרה לראשי
              </Button>
            </Box>
           <StudentLobby
             onStart={({ gameCode, username }) => {
             setStudentSession({ gameCode, username });
             setCurrentView('diagnostic');
             }} 
            />

          </Box>
        )}
        {/* VIEW: diagnostic Dashboard */}
       {currentView === 'diagnostic' && (
          <Box>
            <Box sx={styles.backButtonWrapper}>
              <Button
               variant="secondary"
               onClick={() => setCurrentView('student')}
               startIcon={<ArrowForwardIcon />}
               sx={styles.navButton}
            >
                  חזרה
              </Button>
           </Box>
          <StudentDiagnostic
           gameCode={studentSession.gameCode}
           username={studentSession.username}
            />
          </Box>
        )}


      </Container>

      {/* Footer Section */}
      <Box component="footer" sx={styles.footer}>
        <Typography variant="body2" color="text.secondary">
          © 2025 QueenB Hackathon - Team 11
        </Typography>
      </Box>

    </Box>
  );
}

export default App;