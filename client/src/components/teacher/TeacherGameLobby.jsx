import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import Button from "../common/Button";
import GameStats from "./GameStats";

const TOPIC_LABELS = {
  Cyberbullying: "בריונות ברשת",
  Privacy: "פרטיות",
  Fakenews: "פייק ניוז",
  Shaming: "שיימינג",
};

const TeacherGameLobby = ({ gameCode, onBack }) => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("lobby");
  const [copied, setCopied] = useState(false);

  const API_BASE = (
    import.meta?.env?.VITE_SERVER_API_URL || "http://localhost:5001"
  ).replace(/\/$/, "");

  const topicDisplay = useMemo(() => {
    return gameData?.topics?.map((t) => TOPIC_LABELS[t] || t).join(", ");
  }, [gameData]);

  useEffect(() => {
    if (!gameCode || !String(gameCode).trim()) {
      setLoading(false);
      setGameData(null);
      return;
    }

    let cancelled = false;

    const fetchGame = async () => {
      try {
        const code = String(gameCode).trim();
        const res = await fetch(`${API_BASE}/admin/game/${code}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        if (!cancelled) setGameData(data);
      } catch (err) {
        console.error("Error fetching game data:", err);
        if (!cancelled) setGameData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchGame();
    const intervalId = setInterval(fetchGame, 5001);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [API_BASE, gameCode]);

  const handleCopyCode = async () => {
    const code = gameData?.gameCode || "";
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      try {
        const el = document.createElement("textarea");
        el.value = code;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  const calculateLiveAverage = (student, topics) => {
    let totalSum = 0;
    let topicCount = 0;
    const scores = student?.scoresByTopic || {};

    topics.forEach((topic) => {
      const stats = scores[topic];
      if (stats && stats.count > 0) {
        totalSum += stats.total / stats.count;
        topicCount++;
      }
    });

    if (topicCount === 0) return "-";
    return (totalSum / topicCount).toFixed(1);
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  if (!gameData) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 600,
          width: "100%",
          mx: "auto",
          mt: 6,
          textAlign: "center",
          direction: "rtl",
          backgroundColor: "#E8F6F3",
          border: "1.5px solid #2E6E65",
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 1,
            color: "#2B3752",
            fontFamily: "Rubik, sans-serif",
          }}
        >
          קוד משחק שגוי
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
          לא הצלחנו למצוא משחק עם הקוד <b>{String(gameCode || "").trim()}</b>.
          <br />
          בדקו שהקוד נכון ונסו שוב.
        </Typography>

        <Button
          variant="primary"
          onClick={onBack}
          sx={{
            backgroundColor: "#2E6E65",
            color: "#fff",
            fontWeight: "bold",
            px: 4,
            py: 1.2,
            "&:hover": { backgroundColor: "#265751" },
          }}
        >
          חזרה לניהול המשחקים
        </Button>
      </Paper>
    );
  }

  if (view === "stats") {
    return (
      <GameStats
        gameData={gameData}
        topicLabels={TOPIC_LABELS}
        onBackToLobby={() => setView("lobby")}
      />
    );
  }

  const finishedCount = gameData?.students
    ? gameData.students.filter((s) => s.finished).length
    : 0;
  const totalStudents = gameData?.students ? gameData.students.length : 0;
  const gameTopics = gameData?.topics || [];

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 1000,
          width: "100%",
          textAlign: "center",
          direction: "rtl",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 1, fontWeight: "bold", color: "#2B3752" }}
        >
          משחק בנושא: {topicDisplay}
        </Typography>

        <Box
          sx={{
            my: 2,
            px: 2.5,
            py: 1.2,
            bgcolor: "#e8f6f3",
            borderRadius: 2,
            border: "1.5px dashed #1abc9c",
            display: "inline-flex",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            קוד משחק:
          </Typography>

          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#16a085", letterSpacing: 3 }}
          >
            {gameData.gameCode}
          </Typography>

          <Tooltip title="העתק קוד">
            <IconButton onClick={handleCopyCode}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ mb: 3, display: "flex", justifyContent: "center", gap: 4 }}>
          <Typography variant="h6">
            התחברו: <strong>{totalStudents}</strong>
          </Typography>
          <Typography variant="h6">
            סיימו: <strong>{finishedCount}</strong>
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 3 }}
        >
          <Button
            variant="primary"
            onClick={() => setView("stats")}
            sx={{
              backgroundColor: "#2E6E65",
              color: "#fff",
              fontWeight: "bold",
              px: 4,
              py: 1.2,
              "&:hover": { backgroundColor: "#265751" },
            }}
          >
            הצג סטטיסטיקות
          </Button>

          <Button
            variant="secondary"
            onClick={onBack}
            sx={{
              color: "#2E6E65",
              border: "2px solid #2E6E65",
              backgroundColor: "transparent",
              fontWeight: "bold",
              px: 4,
              py: 1.2,
              "&:hover": { backgroundColor: "#E8F6F3", borderColor: "#265751" },
            }}
          >
            חזרה לניהול המשחקים
          </Button>
        </Stack>

        <TableContainer component={Paper} elevation={1}>
          <Table stickyHeader dir="rtl">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>שם התלמיד/ה</TableCell>
                {gameTopics.map((topic) => (
                  <TableCell
                    key={topic}
                    align="center"
                    sx={{ fontWeight: "bold" }}
                  >
                    {TOPIC_LABELS[topic] || topic}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  ציון משוקלל
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  סטטוס
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {gameData?.students?.length ? (
                gameData.students.map((student, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{student.username}</TableCell>

                    {gameTopics.map((topic) => {
                      const stats = student?.scoresByTopic?.[topic];
                      const score =
                        stats && stats.count > 0
                          ? (stats.total / stats.count).toFixed(1)
                          : "-";
                      return (
                        <TableCell key={topic} align="center">
                          {score}
                        </TableCell>
                      );
                    })}

                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {calculateLiveAverage(student, gameTopics)}
                    </TableCell>

                    <TableCell align="center">
                      {student.finished ? (
                        <Chip label="סיימ/ה" color="success" size="small" />
                      ) : (
                        <Chip
                          label="משחק/ת..."
                          color="warning"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4 + gameTopics.length} align="center">
                    אין תלמידים מחוברים
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Snackbar
          open={copied}
          autoHideDuration={2000}
          onClose={() => setCopied(false)}
          message="קוד המשחק הועתק!"
        />
      </Paper>
    </Box>
  );
};

TeacherGameLobby.propTypes = {
  gameCode: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default TeacherGameLobby;
