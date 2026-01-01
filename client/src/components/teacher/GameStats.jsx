import PropTypes from 'prop-types';
// MUI Imports
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '../common/Button';

const GameStats = ({ onBack }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
        צפייה בסטיסטיקות
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        הכנס/י את קוד המשחק כדי לצפות בנתוני המשחק:
      </Typography>
      
      {/* Game Code Input */}
      <TextField 
        label="קוד משחק" 
        fullWidth
        sx={{ mb: 4 }}
        dir="rtl"
      />

      <Stack direction="row" justifyContent="space-between">
        <Button variant="secondary" onClick={onBack}>
          חזרה
        </Button>

        <Button variant="primary">
          הצג נתונים
        </Button>
      </Stack>
    </Paper>
  );
};

GameStats.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default GameStats;