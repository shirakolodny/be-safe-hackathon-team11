import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// MUI
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";

const API_BASE = "http://localhost:5001";

export default function StudentDiagnostic() {
  const { code } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);

  const [index, setIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState([]); 

  const total = questions.length;
  const currentQ = useMemo(() => questions[index], [questions, index]);
  const progress = total ? Math.round(((index + 1) / total) * 100) : 0;

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        // השרת צריך להחזיר: { questions: [{id, question}, ...] }
        const res = await fetch(`${API_BASE}/games/${encodeURIComponent(code)}/diagnostic`);
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();

        if (!ignore) {
          setQuestions(Array.isArray(data.questions) ? data.questions : []);
          setIndex(0);
          setAnswers([]);
          setCurrentAnswer("");
        }
      } catch {
        if (!ignore) setError("לא הצלחנו לטעון את שאלות האבחון. בדקי שהקוד נכון וששרת פעיל.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [code]);

  const handleNext = async () => {
    if (!currentQ) return;
    const trimmed = currentAnswer.trim();
    if (!trimmed) return;

    const nextAnswers = [...answers, { questionId: currentQ.id, answer: trimmed }];
    setAnswers(nextAnswers);
    setCurrentAnswer("");

    const isLast = index === total - 1;
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }

    // אחרון -> שליחה לשרת
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_BASE}/games/${encodeURIComponent(code)}/diagnostic/answers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, answers: nextAnswers }),
        }
      );

      if (!res.ok) throw new Error("Submit failed");

      navigate("/student/done", { replace: true });
    } catch {
      setError("שמירת התשובות נכשלה. נסי שוב.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, direction: "rtl" }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CircularProgress size={22} />
            <Typography>טוען…</Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, direction: "rtl" }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 800, mb: 1 }}>שגיאה</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => navigate(-1)}>
            חזרה
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!currentQ) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, direction: "rtl" }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 800, mb: 1 }}>
            אין שאלות אבחון ללומדה הזו
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            ייתכן שהמורה לא יצר/ה לומדה או שהקוד שגוי.
          </Typography>
          <Button variant="contained" onClick={() => navigate(-1)}>
            חזרה
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4, direction: "rtl" }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography sx={{ fontWeight: 800, mb: 1 }}>אבחון קצר</Typography>

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          תלמיד/ה: {username || "ללא שם"} • קוד: {code}
        </Typography>

        <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />

        <Typography sx={{ fontWeight: 800, mb: 1 }}>
          שאלה {index + 1} מתוך {total}
        </Typography>

        <Typography sx={{ mb: 2 }}>{currentQ.question}</Typography>

        <TextField
          fullWidth
          label="התשובה שלך"
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          dir="rtl"
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            יציאה
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!currentAnswer.trim()}
          >
            {index === total - 1 ? "סיום ושליחה" : "הבא"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
