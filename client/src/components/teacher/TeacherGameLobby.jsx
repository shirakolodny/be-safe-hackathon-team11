import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

// MUI Imports
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
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

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
  
  // State for game active/locked status
  const [isActive, setIsActive] = useState(true);

  const API_BASE = (
    import.meta?.env?.VITE_SERVER_API_URL || "http://localhost:5001"
  ).replace(/\/$/, "");

  const topicDisplay = useMemo(() => {
    return gameData?.topics?.map((t) => TOPIC_LABELS[t] || t).join(", ");
  }, [gameData]);

  // Sync local active state with server data
  useEffect(() => {
    if (gameData) {
      // If server sends isActive status, update UI
      setIsActive(gameData.isActive !== undefined ? gameData.isActive : true);
    }
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
        const res = await fetch(`${API_BASE}/games/${code}/results`);

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
    // Poll every 5 seconds to update student list and status
    const intervalId = setInterval(fetchGame, 5001);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [API_BASE, gameCode]);

  // Toggle Game Active/Locked Status
  const handleToggleGame = async () => {
    try {
      // Optimistic UI update
      const newState = !isActive;
      setIsActive(newState);

      // Call server to toggle lock
      await fetch(`${API_BASE}/games/${gameCode}/toggle-lock`, {
        method: "POST",
      });
      
      // The polling interval will ensure data consistency shortly
    } catch (err) {
      console.error("Failed to toggle game", err);
      setIsActive(!isActive); // Revert on error
    }
  };

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

  // --- ERROR STATE: Game Not Found ---
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
          fontFamily: "Rubik, sans-serif",
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

        <Typography 
          color="text.secondary" 
          sx={{ mb: 3, lineHeight: 1.8, fontFamily: "Rubik, sans-serif" }}
        >
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
            fontFamily: "Rubik, sans-serif",
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

  // --- STATS VIEW ---
  if (view === "stats") {
    return (
      <GameStats
        gameData={gameData}
        topicLabels={TOPIC_LABELS}
        onBackToLobby={() => setView("lobby")}
      />
    );
  }

  // --- MAIN LOBBY VIEW ---
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
          fontFamily: "Rubik, sans-serif",
        }}
      >
        <Typography
          variant="h5"
          sx={{ 
            mb: 1, 
            fontWeight: "bold", 
            color: "#2B3752",
            fontFamily: "Rubik, sans-serif" 
        }}
        >
          משחק בנושא: {topicDisplay}
        </Typography>

        {/* Game Code Display */}
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
          <Typography variant="h6" color="text.secondary" sx={{ fontFamily: "Rubik, sans-serif" }}>
            קוד משחק:
          </Typography>

          <Typography
            variant="h4"
            sx={{ 
                fontWeight: "bold", 
                color: "#16a085", 
                letterSpacing: 3,
                fontFamily: "Rubik, sans-serif",
                mx: 2
            }}
          >
            {gameData.gameCode}
          </Typography>

          <Tooltip title="העתק קוד">
            <IconButton onClick={handleCopyCode}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Stats and Controls Bar */}
        <Box sx={{ mb: 3, display: "flex", justifyContent: "center", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
          <Typography variant="h6" sx={{ fontFamily: "Rubik, sans-serif" }}>
            התחברו: <strong>{totalStudents}</strong>
          </Typography>

          {/* Active/Locked Toggle Switch */}
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={handleToggleGame}
                color="success"
              />
            }
            label={
              <Typography sx={{ fontWeight: "bold", fontFamily: "Rubik, sans-serif", color: isActive ? "#2E6E65" : "#d32f2f" }}>
                {isActive ? "משחק פעיל " : "משחק לא פעיל"}
              </Typography>
            }
            sx={{ 
                border: isActive ? "1px solid #2E6E65" : "1px solid #d32f2f", 
                borderRadius: 2, 
                pr: 2, 
                pl: 1,
                py: 0.5,
                mr: 2,
                ml: 2,
                backgroundColor: isActive ? "rgba(46, 110, 101, 0.05)" : "rgba(211, 47, 47, 0.05)"
            }}
          />

          <Typography variant="h6" sx={{ fontFamily: "Rubik, sans-serif" }}>
            סיימו: <strong>{finishedCount}</strong>
          </Typography>
        </Box>

        {/* Action Buttons */}
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
              fontFamily: "Rubik, sans-serif",
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
              fontFamily: "Rubik, sans-serif",
              px: 4,
              py: 1.2,
              "&:hover": { backgroundColor: "#E8F6F3", borderColor: "#265751" },
            }}
          >
            חזרה לניהול המשחקים
          </Button>
        </Stack>

        {/* Student Table */}
        <TableContainer component={Paper} elevation={1}>
          <Table stickyHeader dir="rtl">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontFamily: "Rubik, sans-serif" }}>שם התלמיד/ה</TableCell>
                {gameTopics.map((topic) => (
                  <TableCell
                    key={topic}
                    align="center"
                    sx={{ fontWeight: "bold", fontFamily: "Rubik, sans-serif" }}
                  >
                    {TOPIC_LABELS[topic] || topic}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: "bold", fontFamily: "Rubik, sans-serif" }}>
                  ציון משוקלל
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", fontFamily: "Rubik, sans-serif" }}>
                  סטטוס
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {gameData?.students?.length ? (
                gameData.students.map((student, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontFamily: "Rubik, sans-serif" }}>{student.username}</TableCell>

                    {gameTopics.map((topic) => {
                      const stats = student?.scoresByTopic?.[topic];
                      const score =
                        stats && stats.count > 0
                          ? (stats.total / stats.count).toFixed(1)
                          : "-";
                      return (
                        <TableCell key={topic} align="center" sx={{ fontFamily: "Rubik, sans-serif" }}>
                          {score}
                        </TableCell>
                      );
                    })}

                    <TableCell align="center" sx={{ fontWeight: "bold", fontFamily: "Rubik, sans-serif" }}>
                      {calculateLiveAverage(student, gameTopics)}
                    </TableCell>

                    <TableCell align="center">
                      {student.finished ? (
                        <Chip 
                            label="סיימ/ה" 
                            color="success" 
                            size="small" 
                            sx={{ fontFamily: "Rubik, sans-serif", fontWeight: "bold" }}
                        />
                      ) : (
                        <Chip
                          label="משחק/ת..."
                          color="warning"
                          size="small"
                          variant="outlined"
                          sx={{ fontFamily: "Rubik, sans-serif", fontWeight: "bold" }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4 + gameTopics.length} align="center" sx={{ fontFamily: "Rubik, sans-serif" }}>
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
          // Ensure Snackbar font matches
          ContentProps={{ sx: { fontFamily: "Rubik, sans-serif" } }} 
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