import { useState } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SchoolIcon from '@mui/icons-material/School';
import PropTypes from 'prop-types';



const StudentLobby = ({ onStart }) => {
  const [gameCode, setGameCode] = useState('');
  const [username, setUsername] = useState('');

  const handleStart = () => {
  if (!gameCode.trim() || !username.trim()) {
    alert("נא למלא קוד משחק וכינוי");
    return;
  }
  onStart({ gameCode: gameCode.trim(), username: username.trim() });
};


  return (
    <Container maxWidth="xs"> 
      
      <Box 
        sx={{ 
          marginTop: 0,
          marginBottom: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        
        {/* Icon and Title */}
        <Box sx={{ m: 1, bgcolor: 'secondary.main', p: 1, borderRadius: '50%', color: 'white' }}>
            <SchoolIcon fontSize="medium" />
        </Box>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3, fontFamily: 'Rubik, sans-serif' }}>
          כניסה למשחק
        </Typography>

        {/* The White Card */}
        <Paper elevation={3} sx={{ p: 3, width: '80%', borderRadius: 2 }}>
          
          <Box component="form" noValidate sx={{ mt: 1 }}>
            
            <TextField
              margin="dense"
              size="small"
              required
              fullWidth
              id="gameCode"
              label="קוד משחק"
              name="gameCode"
              autoFocus
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              dir="rtl" 
              InputLabelProps={{ style: { fontFamily: 'Rubik, sans-serif' } }} 
            />

            <TextField
              margin="dense"
              size="small"
              required
              fullWidth
              name="username"
              label="כינוי"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              dir="rtl"
              InputLabelProps={{ style: { fontFamily: 'Rubik, sans-serif' } }}
            />

            <Button
              type="button"
              fullWidth
              variant="contained"
              color="secondary"
               onClick={handleStart}
              sx={{ 
                mt: 2, 
                mb: 1, 
                py: 1, 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                fontFamily: 'Rubik, sans-serif'

              }}
            >
              בואו נתחיל!
            </Button>

          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default StudentLobby;


StudentLobby.propTypes = {
  onStart: PropTypes.func.isRequired,
};