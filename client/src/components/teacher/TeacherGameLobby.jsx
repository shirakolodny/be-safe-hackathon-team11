import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// Material UI Components (External Design Pattern)
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip'; 
// Project's Shared Components
import Button from '../common/Button'; 

// Helper function to translate topics to Hebrew (Optional)
const TOPIC_LABELS = {
  'Cyberbullying': 'בריונות ברשת',
  'Privacy': 'פרטיות',
  'Fakenews': 'פייק ניוז',
  'Shaming': 'שיימינג'
};

const TeacherGameLobby = ({ gameCode, onBack }) => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create a display string from the array
  // If gameData.topics is ['Privacy', 'Fakenews'], it becomes "Privacy, Fakenews"
  const topicDisplay = gameData?.topics?.map(t => TOPIC_LABELS[t] || t).join(', ');

  // Polling mechanism: Fetch data every 5 seconds to update the table in real-time
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`http://localhost:5000/admin/game/${gameCode}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setGameData(data);
      } catch (err) {
        console.error("Error fetching game data:", err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchGame();

    // Set interval for updates
    const intervalId = setInterval(fetchGame, 5000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [gameCode]);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (!gameData) return <Typography align="center" sx={{ mt: 4 }}>קוד משחק שגוי</Typography>;

  // Calculate live statistics
  const finishedCount = gameData.students ? gameData.students.filter(s => s.finished).length : 0;
  const totalStudents = gameData.students ? gameData.students.length : 0;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
      
      {/* Header */}
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', color: '#2c3e50' }}>
        {/* Update: Show all topics */}
        משחק בנושא: {topicDisplay}
      </Typography>
      
      {/* Game Code Box */}
      <Box sx={{ my: 3, p: 2, bgcolor: '#e8f6f3', borderRadius: 2, border: '2px dashed #1abc9c', display: 'inline-block', minWidth: '300px' }}>
        <Typography variant="h6" color="text.secondary">קוד משחק (העתק/י לשיתוף):</Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#16a085', letterSpacing: 6 }}>
          {gameData.gameCode}
        </Typography>
      </Box>

      {/* Stats Summary */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 4 }}>
        <Typography variant="h6">
           התחברו: <strong>{totalStudents}</strong>
        </Typography>
        <Typography variant="h6">
           סיימו: <strong>{finishedCount}</strong>
        </Typography>
      </Box>

      {/* Real-time Student Table */}
      <TableContainer component={Paper} elevation={1} sx={{ maxHeight: 300, mb: 3 }}>
        <Table stickyHeader aria-label="student results table" dir="rtl">
          <TableHead>
            <TableRow>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>שם התלמיד/ה</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>סטטוס</TableCell>
              <TableCell align="left" sx={{ fontWeight: 'bold' }}>תוצאה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gameData.students && gameData.students.length > 0 ? (
              gameData.students.map((student, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="right">{student.username}</TableCell>
                  <TableCell align="center">
                    {student.finished ? (
                        <Chip label="Finished" color="success" size="small" />
                    ) : (
                        <Chip label="Playing..." color="warning" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell align="left">
                    {student.finished ? student.score : '-'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>
                    No students connected yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Navigation Buttons */}
      <Button variant="secondary" onClick={onBack}>חזרה לניהול המשחקים</Button>
    </Paper>
  );
};

TeacherGameLobby.propTypes = {
  gameCode: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default TeacherGameLobby;