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
// pop-up
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CircularProgress from '@mui/material/CircularProgress';

// Define available topics outside the component for better organization
const TOPICS = [
  { value: 'Cyberbullying', label: 'בריונות ברשת' },
  { value: 'Privacy', label: 'פרטיות ומידע אישי' },
  { value: 'Fakenews', label: 'זיהוי פייק ניוז' },
  { value: 'Shaming', label: 'שיימינג וחרם' }, 
];

const CreateGame = ({ onBack }) => {
  // State is now an empty array to support multiple selections
  const [selectedTopics, setSelectedTopics] = useState([]); 

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Handle changes for multi-select dropdown
  const handleChange = (event) => {
    const { target: { value } } = event;
    // On autofill we get a stringified value.
    setSelectedTopics(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleCreateGame = async () => {
    setLoading(true);

    const profile = {
      focus: selectedTopics[0] || null,   // main topic (first selected)
      issues: selectedTopics.slice(1),    // rest as additional issues
    };

    try {
      const res = await fetch('http://localhost:5000/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error('Server error');

      const data = await res.json();
      setQuestions(data.questions);
    } catch (err) {
      console.error(err);
      setQuestions([{ id: 0, question: 'השרת לא זמין כרגע' }]);
    } finally {
      setLoading(false);
      setOpenDialog(true);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        בחירת נושאים בהם המשחק יתמקד:
      </Typography>
      
      {/* Multi-Select Dropdown using TextField */}
      <TextField
        select
        label="נושאי השיעור (ניתן לבחור כמה)"
        fullWidth
        value={selectedTopics}
        onChange={handleChange}
        sx={{ mb: 4 }}
        dir="rtl"
        // Configure specific Select component properties for multi-select
        SelectProps={{
          multiple: true, 
          renderValue: (selected) => (
            // Render selected items as Chips (bubbles)
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const topic = TOPICS.find(t => t.value === value);
                return <Chip key={value} label={topic ? topic.label : value} />;
              })}
            </Box>
          ),
        }}
      >
        {/* Generate menu items dynamically from the TOPICS array */}
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
        
        {/* <Button variant="success">
          קבל/י קוד משחק
        </Button> */}

        <Button
          variant="success"
          onClick={handleCreateGame}
          disabled={selectedTopics.length === 0}
        >
          קבל/י קוד משחק
        </Button>

      </Stack>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>השאלות שנבחרו</DialogTitle>

        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <List>
              {questions.map((q) => (
                <ListItem key={q.id}>{q.question}</ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>

    </Paper>
  );
};

// Component validation
CreateGame.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default CreateGame;