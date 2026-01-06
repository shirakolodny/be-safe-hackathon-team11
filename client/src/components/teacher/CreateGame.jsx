import { useState } from 'react';
import PropTypes from 'prop-types';

// MUI Imports
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box'; 
import Chip from '@mui/material/Chip'; 
import Button from '../common/Button'; 

const TOPICS = [
  { value: 'Cyberbullying', label: 'בריונות ברשת' },
  { value: 'Privacy', label: 'פרטיות ומידע אישי' },
  { value: 'Fakenews', label: 'זיהוי פייק ניוז' },
  { value: 'Shaming', label: 'שיימינג וחרם' },
];

const CreateGame = ({ onBack, onGameCreated }) => {
  // State for selected topics
  const [selectedTopics, setSelectedTopics] = useState([]); 
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedTopics(typeof value === 'string' ? value.split(',') : value);
  };

  const handleCreateGame = async () => {
    setLoading(true);

    const profile = {
      topics: selectedTopics, // <--- This sends the whole array ['Cyber', 'Privacy'...]
      focus: selectedTopics[0], // Keep this if your question generator needs it
      issues: selectedTopics.slice(1),
    };

    try {
      const res = await fetch('http://localhost:5000/admin/questions', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error('Server error');

      const data = await res.json();
      
      // Check if we received a game code and notify the parent component
      if (data.gameCode) {
         onGameCreated(data.gameCode); 
      } else {
         console.error("No game code returned from server");
      }

    } catch (err) {
      console.error(err);
      alert('Error creating game');
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        בחירת נושאים בהם המשחק יתמקד:
      </Typography>

      <TextField
        select
        label="נושאי השיעור (ניתן לבחור כמה)"
        fullWidth
        value={selectedTopics}
        onChange={handleChange}
        sx={{ mb: 4 }}
        dir="rtl"
        SelectProps={{
          multiple: true,
          renderValue: (selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const topic = TOPICS.find((t) => t.value === value);
                return <Chip key={value} label={topic ? topic.label : value} />;
              })}
            </Box>
          ),
        }}
      >
        {TOPICS.map((topic) => (
          <MenuItem key={topic.value} value={topic.value} dir="rtl">
            {topic.label}
          </MenuItem>
        ))}
      </TextField>

      <Stack direction="row" justifyContent="space-between">
        <Button variant="secondary" onClick={onBack}>
          ביטול
        </Button>
        
        <Button
          variant="success"
          onClick={handleCreateGame}
          disabled={selectedTopics.length === 0 || loading}
        >
          {loading ? 'יוצר משחק...' : 'קבל/י קוד משחק'}
        </Button>
      </Stack>
    </Paper>
  );
};

CreateGame.propTypes = {
  onBack: PropTypes.func.isRequired,
  onGameCreated: PropTypes.func.isRequired, // Required callback
};

export default CreateGame;
