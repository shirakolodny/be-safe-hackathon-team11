import PropTypes from 'prop-types'; 
// MUI Imports
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
// Icons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';

const TeacherMenu = ({ onNavigate }) => {
  
  // A helper function to create the card style
  const cardStyle = {
    p: 4,
    width: { xs: '100%', sm: 250 }, // Responsive width
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    transition: '0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: 6,
      border: '1px solid #3498db'
    }
  };

  return (
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      spacing={4} 
      justifyContent="center" 
      alignItems="center"
    >
      
      {/* Option 1: Create New Game */}
      <Paper elevation={3} sx={cardStyle} onClick={() => onNavigate('create')}>
        <AddCircleOutlineIcon sx={{ fontSize: 60, color: '#3498db' }} />
        <Typography variant="h6" fontWeight="bold">
          פתיחת משחק חדש
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          בחירת נושא/ים להתמקדות וקבלת קוד משחק
        </Typography>
      </Paper>

      {/* Option 2: View Stats */}
      <Paper elevation={3} sx={cardStyle} onClick={() => onNavigate('stats')}>
        <AssessmentIcon sx={{ fontSize: 60, color: '#9b59b6' }} />
        <Typography variant="h6" fontWeight="bold">
          כניסה למשחק קיים
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          צפייה בסטטיסטיקות של משחק פעיל
        </Typography>
      </Paper>

    </Stack>
  );
};

TeacherMenu.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

export default TeacherMenu;