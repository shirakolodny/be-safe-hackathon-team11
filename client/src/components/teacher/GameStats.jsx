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
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        כניסה למשחק קיים
      </Typography>
      
      <TextField 
        label="קוד משחק" 
        fullWidth
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ mb: 4 }}
        dir="rtl"
      />

      <Stack direction="row" justifyContent="space-between">
        <Button variant="secondary" onClick={onBack}>חזרה</Button>
        <Button 
          variant="primary" 
          onClick={() => {
            if(code) onGameFound(code.toUpperCase());
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