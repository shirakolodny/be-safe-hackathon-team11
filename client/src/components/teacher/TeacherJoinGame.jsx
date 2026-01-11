import { useState } from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '../common/Button';

const GameStats = ({ onBack, onGameFound }) => {
  const [code, setCode] = useState('');

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color:"#2B3752"}}>
        כניסה למשחק קיים
      </Typography>
     <TextField 
  label="קוד משחק" 
  fullWidth
  value={code}
  onChange={(e) => setCode(e.target.value)}
  dir="rtl"
  sx={{
    mb: 4,

    // טקסט רגיל
    '& .MuiInputBase-input': {
      color: '#000',
      fontFamily: 'Rubik, sans-serif',
    },

    // טקסט בפוקוס בלבד
    '& .MuiInputBase-input:focus': {
      color: '#2E6E65',
    },

    // label רגיל
    '& .MuiInputLabel-root': {
      color: '#9e9e9e',
    },

    // label בפוקוס
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#2E6E65',
    },

    // מסגרת רגילה
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#9e9e9e',
    },

    // מסגרת בפוקוס בלבד
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2E6E65',
    },
  }}
/>


      <Stack direction="row" justifyContent="space-between">
        <Button variant="secondary" onClick={onBack} sx={{ color: "#2E6E65", borderColor:"#2E6E65"}} >חזרה</Button>
        <Button 
          variant="primary" 
          onClick={() => {
            if(code) onGameFound(code.toUpperCase());
          }}
          sx={{ color: "#F4F7ED", backgroundColor:"#2E6E65"}} 
        >
          הצג נתונים
        </Button>
      </Stack>
    </Paper>
  );
};

GameStats.propTypes = {
  onBack: PropTypes.func.isRequired,
  onGameFound: PropTypes.func.isRequired,
};

export default GameStats;