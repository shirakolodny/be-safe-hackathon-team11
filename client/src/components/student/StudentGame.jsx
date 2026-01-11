import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// MUI
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";

import Button from "../common/Button";

const COLORS = {
  title: "#2B3752",
  primary: "#2E6E65",
  primaryHover: "#265751",
  softBg: "#E8F6F3",
  border: "rgba(43, 55, 82, 0.18)",
};

const TOTAL_QUESTIONS = 30;

const StudentGame = ({ gameCode, studentName, onGameFinished }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [questionCount, setQuestionCount] = useState(1);
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

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

      if (!res.ok) throw new Error("Submit failed");

      const data = await res.json();

      setFeedbackData({
        feedback: data.feedback,
        nextQ: data.nextQuestion,
        finished: data.finished,
      });
    } catch (err) {
      console.error("Error submitting answer:", err);
      alert("שגיאה בשליחת התשובה");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!feedbackData) return;

    if (feedbackData.finished) {
      onGameFinished();
      return;
    }

    setQuestionCount((prev) => prev + 1);
    setCurrentQuestion(feedbackData.nextQ);
    setAnswerText("");
    setFeedbackData(null);
  };

  if (initializing) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 10 }} />;
  }

  if (!currentQuestion && !feedbackData) {
    return (
      <Typography align="center" sx={{ mt: 10 }}>
        טוען נתונים...
      </Typography>
    );
  }

  const progressValue = Math.min(100, (questionCount / TOTAL_QUESTIONS) * 100);

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
        {/* HEADER: Progress */}
        <Box sx={{ mb: 3 }}>
          <StackRow>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: COLORS.title }}
            >
              שאלה {questionCount}
            </Typography>

            <Typography
              variant="caption"
              sx={{ fontWeight: 800, color: COLORS.primary }}
            >
              {Math.round(progressValue)}%
            </Typography>
          </StackRow>

          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 10,
              borderRadius: 999,
              backgroundColor: "rgba(46, 110, 101, 0.15)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: COLORS.primary,
                borderRadius: 999,
              },
            }}
          />
        </Box>

        {/* MODE A: QUESTION VIEW */}
        {!feedbackData && (
          <Fade in={!feedbackData}>
            <Box>
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

              <Typography
                variant="h5"
                sx={{ fontWeight: 900, mb: 2, color: COLORS.title }}
              >
                {currentQuestion.title}
              </Typography>

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

              <Typography
                variant="h6"
                sx={{ fontWeight: 900, color: COLORS.title, mb: 2 }}
              >
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

// helper קטן (בלי import Stack)
const StackRow = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 0.75,
    }}
  >
    {children}
  </Box>
);

StackRow.propTypes = {
  children: PropTypes.node,
};

StudentGame.propTypes = {
  gameCode: PropTypes.string.isRequired,
  studentName: PropTypes.string.isRequired,
  onGameFinished: PropTypes.func.isRequired,
};

export default StudentGame;
