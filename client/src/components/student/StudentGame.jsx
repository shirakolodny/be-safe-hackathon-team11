import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// MUI Imports
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Button from "../common/Button";

// Style Constants
const COLORS = {
  title: "#2B3752",
  primary: "#2E6E65",
  primaryHover: "#265751",
  softBg: "#E8F6F3",
  border: "rgba(43, 55, 82, 0.18)",
};

const StudentGame = ({ gameCode, studentName, onGameFinished }) => {
  // --- State Management ---
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [questionCount, setQuestionCount] = useState(1); // Used for display "Question X"
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // --- Effect: Initialize Game ---
  useEffect(() => {
    const startGame = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/games/${gameCode}/start?username=${encodeURIComponent(
            studentName
          )}`
        );
        if (!res.ok) throw new Error("Failed to start game");

        const data = await res.json();

        if (data.finished) {
          onGameFinished();
          return;
        }

        if (data.nextQuestion) {
          setCurrentQuestion(data.nextQuestion);
          // Set question count based on server data (answered + 1)
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

  // --- Handler: Submit Answer ---
  const handleSubmit = async () => {
    if (!answerText.trim() || !currentQuestion) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5001/games/${gameCode}/answer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: studentName,
            questionId: currentQuestion.id,
            answerText,
          }),
        }
      );

      // --- HANDLE GAME LOCKED SCENARIO ---
      if (res.status === 403) {
        alert("המשחק ננעל על ידי המורה. לא ניתן להמשיך.");
        onGameFinished(); // Exit to lobby/finish screen
        return;
      }

      if (!res.ok) throw new Error("Submit failed");

      const data = await res.json();

      // Update state with feedback from AI
      setFeedbackData({
        feedback: data.feedback,
        nextQ: data.nextQuestion,
        finished: data.finished,
      });
    } catch (err) {
      console.error("Error submitting answer:", err);
      alert("Error submitting answer");
    } finally {
      setLoading(false);
    }
  };

  // --- Handler: Continue to Next Question ---
  const handleContinue = () => {
    if (!feedbackData) return;

    if (feedbackData.finished) {
      onGameFinished();
      return;
    }

    // Update UI for next question
    setQuestionCount((prev) => prev + 1);
    setCurrentQuestion(feedbackData.nextQ);
    setAnswerText("");
    setFeedbackData(null);
  };

  // --- Render: Loading State ---
  if (initializing) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 10 }} />;
  }

  // --- Render: Error/Empty State ---
  if (!currentQuestion && !feedbackData) {
    return (
      <Typography align="center" sx={{ mt: 10 }}>
        Loading data...
      </Typography>
    );
  }

  // --- Render: Main Game UI ---
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        px: { xs: 1.5, sm: 2 },
        pt: 1,
        pb: 2,
      }}
    >
      <Paper
        elevation={0}
        dir="rtl"
        sx={{
          width: "100%",
          maxWidth: 700,
          minHeight: "calc(100vh - 180px)",
          maxHeight: "calc(100vh - 180px)",
          overflow: "auto",
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
          border: `1.5px solid ${COLORS.border}`,
          backgroundColor: "#fff",
        }}
      >
        {/* HEADER: Question Count Only */}
        <Box sx={{ mb: 2 }}>
            <Typography 
                variant="subtitle1" 
                sx={{ 
                    fontWeight: 'bold', 
                    color: COLORS.title,
                    textAlign: 'center' 
                }}
            >
                שאלה {questionCount}
            </Typography>
        </Box>

        {/* MODE A: QUESTION VIEW */}
        {!feedbackData && (
          <Fade in={!feedbackData}>
            <Box>
              {/* Category Chip */}
              <Chip
                label={currentQuestion.category}
                variant="outlined"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  color: COLORS.primary,
                  borderColor: "rgba(46, 110, 101, 0.55)",
                  backgroundColor: "rgba(46, 110, 101, 0.08)",
                }}
              />

              {/* Question Title */}
              <Typography
                variant="h5"
                sx={{ fontWeight: 900, mb: 2, color: COLORS.title }}
              >
                {currentQuestion.title}
              </Typography>

              {/* Question Description Box */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  mb: 2.5,
                  borderRadius: 2,
                  backgroundColor: "#FAFBFC",
                  border: `1px solid ${COLORS.border}`,
                  borderRight: `5px solid ${COLORS.title}`,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1.05rem",
                    lineHeight: 1.8,
                    color: COLORS.title,
                  }}
                >
                  {currentQuestion.description}
                </Typography>
              </Paper>

              {/* The Question Itself */}
              <Typography
                variant="h6"
                sx={{ fontWeight: 900, color: COLORS.title, mb: 2 }}
              >
                {currentQuestion.question}
              </Typography>

              {/* Input Field */}
              <TextField
                label="מה דעתך?"
                multiline
                rows={4}
                fullWidth
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                disabled={loading}
                placeholder="כתוב/כתבי את תשובתך כאן..."
                sx={{
                  mb: 2.5,
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: COLORS.primary,
                    fontWeight: 700,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(43,55,82,0.25)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLORS.primary,
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: COLORS.primary,
                      borderWidth: 2,
                    },
                }}
              />

              {/* Submit Button */}
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!answerText.trim() || loading}
                fullWidth
                size="large"
                sx={{
                  backgroundColor: COLORS.primary,
                  color: "#fff",
                  fontWeight: 800,
                  py: 1.25,
                  "&:hover": { backgroundColor: COLORS.primaryHover },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "שלח תשובה"
                )}
              </Button>

              {/* Loading Text */}
              {loading && (
                <Typography
                  variant="caption"
                  align="center"
                  display="block"
                  sx={{ mt: 1, color: "text.secondary" }}
                >
                  מתבצע ניתוח של התשובה שלך...
                </Typography>
              )}
            </Box>
          </Fade>
        )}

        {/* MODE B: FEEDBACK VIEW */}
        {feedbackData && (
          <Fade in={Boolean(feedbackData)}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: COLORS.primary,
                  fontWeight: 900,
                  mb: 2.5,
                  textAlign: "center",
                }}
              >
                משוב
              </Typography>

              {/* Feedback Content */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: COLORS.softBg,
                  border: `1px solid rgba(46,110,101,0.35)`,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    textAlign: "center",
                    color: COLORS.title,
                    lineHeight: 1.8,
                  }}
                >
                  {feedbackData.feedback}
                </Typography>
              </Paper>

              {/* Continue Button */}
              <Button
                variant="primary"
                onClick={handleContinue}
                fullWidth
                size="large"
                sx={{
                  backgroundColor: COLORS.primary,
                  color: "#fff",
                  fontWeight: 800,
                  py: 1.25,
                  "&:hover": { backgroundColor: COLORS.primaryHover },
                }}
              >
                {feedbackData.finished ? "סיום המשחק" : "המשך לשאלה הבאה"}
              </Button>
            </Box>
          </Fade>
        )}
      </Paper>
    </Box>
  );
};

StudentGame.propTypes = {
  gameCode: PropTypes.string.isRequired,
  studentName: PropTypes.string.isRequired,
  onGameFinished: PropTypes.func.isRequired,
};

export default StudentGame;