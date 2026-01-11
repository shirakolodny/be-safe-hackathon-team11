// import { useState } from 'react';
// import PropTypes from 'prop-types';
// import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
// import Stack from '@mui/material/Stack';
// import Button from '../common/Button';

// const GameStats = ({ onBack, onGameFound }) => {
//   const [code, setCode] = useState('');

//   return (
//     <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
//       <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
//         כניסה למשחק קיים
//       </Typography>
      
//       <TextField 
//         label="קוד משחק" 
//         fullWidth
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//         sx={{ mb: 4 }}
//         dir="rtl"
//       />

//       <Stack direction="row" justifyContent="space-between">
//         <Button variant="secondary" onClick={onBack}>חזרה</Button>
//         <Button 
//           variant="primary" 
//           onClick={() => {
//             if(code) onGameFound(code.toUpperCase());
//           }}
//         >
//           הצג נתונים
//         </Button>
//       </Stack>
//     </Paper>
//   );
// };

// GameStats.propTypes = {
//   onBack: PropTypes.func.isRequired,
//   onGameFound: PropTypes.func.isRequired,
// };

// export default GameStats;


// תיקון באג 


import { useState } from 'react';
import PropTypes from 'prop-types';

// MUI
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// Common
import Button from '../common/Button';

const TeacherJoinGame = ({ onBack, onGameFound }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE =
    (import.meta?.env?.VITE_SERVER_API_URL || 'http://localhost:5000').replace(/\/$/, '');

  const handleSubmit = async () => {
    const trimmedCode = code.trim().toUpperCase();

    if (!trimmedCode) {
      setError('נא להזין קוד משחק');
      return;
    }

    setLoading(true);
    setError('');

    try {
      //  בדיקה אמיתית של הקוד לפני מעבר מסך
      const res = await fetch(`${API_BASE}/admin/game/${trimmedCode}`);

      if (!res.ok) {
        throw new Error('קוד משחק שגוי או שהמשחק לא קיים');
      }

      //  רק אם הצליח – עוברים ללובי
      onGameFound(trimmedCode);
    } catch (err) {
      setError(err?.message || 'שגיאה בבדיקת הקוד');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }} dir="rtl">
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        כניסה למשחק קיים
      </Typography>

      <TextField
        label="קוד משחק"
        fullWidth
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          if (error) setError('');
        }}
        sx={{ mb: 2 }}
        dir="rtl"
        disabled={loading}
        error={Boolean(error)}
        helperText={error || ' '}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" justifyContent="space-between">
        <Button variant="secondary" onClick={onBack} disabled={loading}>
          חזרה
        </Button>

        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'הצג נתונים'}
        </Button>
      </Stack>
    </Paper>
  );
};

TeacherJoinGame.propTypes = {
  onBack: PropTypes.func.isRequired,
  onGameFound: PropTypes.func.isRequired,
};

export default TeacherJoinGame;
