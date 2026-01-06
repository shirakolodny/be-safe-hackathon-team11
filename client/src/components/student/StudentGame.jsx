import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// MUI Imports
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '../common/Button'; 
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import LinearProgress from '@mui/material/LinearProgress';

const StudentGame = ({ gameCode, studentName, onGameFinished }) => {
  // State for game flow
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  
  // Track question number locally
  const [questionCount, setQuestionCount] = useState(1); 

  // State for feedback mode (after submission)
  const [feedbackData, setFeedbackData] = useState(null); 
  
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // 1. Initialize Game & Resume
  useEffect(() => {
    const startGame = async () => {
      try {
        const res = await fetch(`http://localhost:5000/games/${gameCode}/start?username=${studentName}`);
        if (!res.ok) throw new Error("Failed to start game");
        
        const data = await res.json();
        
        if (data.finished) {
            onGameFinished();
            return;
        }

        if (data.nextQuestion) {
            setCurrentQuestion(data.nextQuestion);
            // Resume counter based on server data
            setQuestionCount((data.answeredCount || 0) + 1);
        } else {
            onGameFinished();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setInitializing(false);
      }
    };
    startGame();
  }, [gameCode, studentName, onGameFinished]);

  // 2. Submit Answer
  const handleSubmit = async () => {
    if (!answerText.trim()) return;
    
    setLoading(true);
    try {
        const res = await fetch(`http://localhost:5000/games/${gameCode}/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: studentName,
                questionId: currentQuestion.id,
                answerText: answerText
            })
        });
        
        const data = await res.json();
        
        setFeedbackData({
            feedback: data.feedback,
            nextQ: data.nextQuestion,
            finished: data.finished
        });

    } catch (err) {
        console.error("Error submitting answer:", err);
        alert("שגיאה בשליחת התשובה");
    } finally {
        setLoading(false);
    }
  };

  // 3. Continue to Next Question
  const handleContinue = () => {
      if (feedbackData.finished) {
          onGameFinished();
      } else {
          setQuestionCount(prev => prev + 1);
          setCurrentQuestion(feedbackData.nextQ);
          setAnswerText('');
          setFeedbackData(null);
      }
  };

  if (initializing) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 10 }} />;
  if (!currentQuestion && !feedbackData) return <Typography align="center" sx={{ mt: 10 }}>טוען נתונים...</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: 'auto', mt: 4, minHeight: '400px' }} dir="rtl">
      
      {/* HEADER: Progress */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
          שאלה {questionCount}
        </Typography>
        <LinearProgress 
            variant="determinate" 
            value={(questionCount / 30) * 100} 
            sx={{ height: 10, borderRadius: 5, bgcolor: '#e0e0e0' }} 
        />
      </Box>

      {/* MODE A: QUESTION VIEW */}
      {!feedbackData && (
          <Fade in={!feedbackData}>
              <Box>
                <Chip 
                    label={currentQuestion.category} 
                    color="primary" 
                    variant="outlined" 
                    sx={{ mb: 2 }} 
                />

                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                    {currentQuestion.title}
                </Typography>

                <Paper variant="outlined" sx={{ p: 3, bgcolor: '#f8f9fa', borderRight: '4px solid #3498db', mb: 3 }}>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                        {currentQuestion.description}
                    </Typography>
                </Paper>

                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e74c3c', mb: 3 }}>
                    {currentQuestion.question}
                </Typography>

                <TextField
                    label="מה דעתך?"
                    multiline
                    rows={4}
                    fullWidth
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    disabled={loading}
                    placeholder="כתוב/כתבי את תשובתך כאן..."
                    sx={{ mb: 3 }}
                />

                <Button 
                    variant="primary" 
                    onClick={handleSubmit} 
                    disabled={!answerText.trim() || loading}
                    fullWidth
                    size="large"
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'שלח תשובה'}
                </Button>
                
                {loading && (
                    <Typography variant="caption" align="center" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                        מתבצע ניתוח של התשובה שלך...
                    </Typography>
                )}
              </Box>
          </Fade>
      )}

      {/* MODE B: FEEDBACK VIEW (Cleaned up) */}
      {feedbackData && (
          <Fade in={Boolean(feedbackData)}>
              <Box>
                  <Typography variant="h4" sx={{ color: '#27ae60', fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                      משוב
                  </Typography>
                  
                  <Paper elevation={0} sx={{ p: 3, bgcolor: '#e8f5e9', mb: 4, borderRadius: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center' }}>
                          {feedbackData.feedback}
                      </Typography>
                  </Paper>

                  {/* No Suggested Answer Box anymore! */}

                  <Button 
                      variant="primary" 
                      onClick={handleContinue}
                      fullWidth
                      size="large"
                  >
                      {feedbackData.finished ? 'סיום המשחק' : 'המשך לשאלה הבאה'}
                  </Button>
              </Box>
          </Fade>
      )}

    </Paper>
  );
};

StudentGame.propTypes = {
  gameCode: PropTypes.string.isRequired,
  studentName: PropTypes.string.isRequired,
  onGameFinished: PropTypes.func.isRequired,
};

export default StudentGame;