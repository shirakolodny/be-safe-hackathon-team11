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
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          fontWeight: 'bold', 
          color: "#2B3752",
          fontFamily: 'Rubik, sans-serif' // Applied font to title
        }}
      >
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

          // Normal input text
          '& .MuiInputBase-input': {
            color: '#000',
            fontFamily: 'Rubik, sans-serif', // Applied font
          },

          // Input text on focus
          '& .MuiInputBase-input:focus': {
            color: '#2E6E65',
          },

          // Normal label
          '& .MuiInputLabel-root': {
            color: '#9e9e9e',
            fontFamily: 'Rubik, sans-serif', // Applied font
          },

          // Label on focus
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#2E6E65',
          },

          // Normal border
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9e9e9e',
          },

          // Border on focus
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2E6E65',
          },
        }}
      />

      <Stack direction="row" justifyContent="space-between">
        <Button 
          variant="secondary" 
          onClick={onBack} 
          sx={{ 
            color: "#2E6E65", 
            borderColor: "#2E6E65",
            fontFamily: 'Rubik, sans-serif' // Applied font
          }} 
        >
          חזרה
        </Button>
        <Button 
          variant="primary" 
          onClick={() => {
            if(code) onGameFound(code.toUpperCase());
          }}
          sx={{ 
            color: "#F4F7ED", 
            backgroundColor: "#2E6E65",
            fontFamily: 'Rubik, sans-serif' // Applied font
          }} 
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