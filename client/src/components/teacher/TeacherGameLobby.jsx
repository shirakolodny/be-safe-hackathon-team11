// import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// // Material UI Components
// import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import CircularProgress from '@mui/material/CircularProgress';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Chip from '@mui/material/Chip'; 
// // Project's Shared Components
// import Button from '../common/Button'; 

// // Translate topic names to Hebrew for table headers
// const TOPIC_LABELS = {
//   'Cyberbullying': 'בריונות ברשת',
//   'Privacy': 'פרטיות',
//   'Fakenews': 'פייק ניוז',
//   'Shaming': 'שיימינג'
// };

// const TeacherGameLobby = ({ gameCode, onBack }) => {
//   const [gameData, setGameData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const topicDisplay = gameData?.topics?.map(t => TOPIC_LABELS[t] || t).join(', ');

//   useEffect(() => {
//     const fetchGame = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/admin/game/${gameCode}`);
//         if (!res.ok) throw new Error('Failed to fetch');
//         const data = await res.json();
//         setGameData(data);
//       } catch (err) {
//         console.error("Error fetching game data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGame();
//     const intervalId = setInterval(fetchGame, 5000);
//     return () => clearInterval(intervalId);
//   }, [gameCode]);

//   if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
//   if (!gameData) return <Typography align="center" sx={{ mt: 4 }}>קוד משחק שגוי</Typography>;

//   // --- Calculate dynamic average ---
//   const calculateLiveAverage = (student, topics) => {
//     let totalSum = 0;
//     let topicCount = 0;

//     // Safety check: ensure scores object exists
//     const scores = student.scoresByTopic || {};

//     topics.forEach((topic) => {
//       const stats = scores[topic];
//       // Only include topics that have actual answers (count > 0)
//       if (stats && stats.count > 0) {
//         const topicAvg = stats.total / stats.count;
//         totalSum += topicAvg;
//         topicCount++;
//       }
//     });

//     // If no topics answered yet, return placeholder
//     if (topicCount === 0) return '-';
    
//     // Return average formatted to 1 decimal place
//     return (totalSum / topicCount).toFixed(1);
//   };
  
//   const finishedCount = gameData.students ? gameData.students.filter(s => s.finished).length : 0;
//   const totalStudents = gameData.students ? gameData.students.length : 0;
  
//   // List of topics selected for the current game (used for table headers)
//   const gameTopics = gameData.topics || [];

//   return (
//     <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: 'auto', textAlign: 'center' }}>
      
//       <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', color: '#2c3e50' }}>
//         משחק בנושא: {topicDisplay}
//       </Typography>
      
//       <Box sx={{ my: 3, p: 2, bgcolor: '#e8f6f3', borderRadius: 2, border: '2px dashed #1abc9c', display: 'inline-block', minWidth: '300px' }}>
//         <Typography variant="h6" color="text.secondary">קוד משחק (העתק/י לשיתוף):</Typography>
//         <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#16a085', letterSpacing: 6 }}>
//           {gameData.gameCode}
//         </Typography>
//       </Box>

//       <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 4 }}>
//         <Typography variant="h6">התחברו: <strong>{totalStudents}</strong></Typography>
//         <Typography variant="h6">סיימו: <strong>{finishedCount}</strong></Typography>
//       </Box>

//       {/* Updated results table */}
//       <TableContainer component={Paper} elevation={1} sx={{ maxHeight: 400, mb: 3 }}>
//         <Table stickyHeader aria-label="student results table" dir="rtl">
//           <TableHead>
//             <TableRow>
//               <TableCell align="right" sx={{ fontWeight: 'bold' }}>שם התלמיד/ה</TableCell>
              
//               {/* Generate a column for each topic selected in the game */}
//               {gameTopics.map((topic) => (
//                 <TableCell key={topic} align="center" sx={{ fontWeight: 'bold' }}>
//                   {TOPIC_LABELS[topic] || topic}
//                 </TableCell>
//               ))}

//               <TableCell align="center" sx={{ fontWeight: 'bold' }}>ציון משוקלל</TableCell>
//               <TableCell align="center" sx={{ fontWeight: 'bold' }}>סטטוס</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {gameData.students && gameData.students.length > 0 ? (
//               gameData.students.map((student, index) => (
//                 <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
//                   <TableCell align="right" component="th" scope="row">
//                     {student.username}
//                   </TableCell>
                  
//                   {/* Display score for each topic */}
//                   {gameTopics.map((topic) => {
//                     // Access the data safely
//                     const topicStats = student.scoresByTopic && student.scoresByTopic[topic];
                    
//                     // Calculate individual topic average
//                     let displayScore = '-';
//                     if (topicStats && topicStats.count > 0) {
//                         displayScore = (topicStats.total / topicStats.count).toFixed(1);
//                     }

//                     return (
//                       <TableCell key={topic} align="center">
//                         {displayScore}
//                       </TableCell>
//                     );
//                   })}

//                   {/* UPDATE: Use the new dynamic calculation function */}
//                   <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2980b9' }}>
//                      {calculateLiveAverage(student, gameTopics)}
//                   </TableCell>

//                   <TableCell align="center">
//                     {student.finished ? (
//                         <Chip label="סיימ/ה" color="success" size="small" />
//                     ) : (
//                         <Chip label="משחק/ת..." color="warning" size="small" variant="outlined" />
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={3 + gameTopics.length} align="center">
//                   <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>
//                     עדיין אין תלמידים מחוברים.
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Button variant="secondary" onClick={onBack}>חזרה לניהול המשחקים</Button>
//     </Paper>
//   );
// };

// TeacherGameLobby.propTypes = {
//   gameCode: PropTypes.string.isRequired,
//   onBack: PropTypes.func.isRequired,
// };



// הוספת העתקה של קוד משחק 
// export default TeacherGameLobby;
// import { useState, useEffect, useMemo } from "react";
// import PropTypes from "prop-types";

// // Material UI
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import CircularProgress from "@mui/material/CircularProgress";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Chip from "@mui/material/Chip";
// import Stack from "@mui/material/Stack";

// // Project
// import Button from "../common/Button";
// import GameStats from "./GameStats";

// // Translate topic names to Hebrew for table headers
// const TOPIC_LABELS = {
//   Cyberbullying: "בריונות ברשת",
//   Privacy: "פרטיות",
//   Fakenews: "פייק ניוז",
//   Shaming: "שיימינג",
// };

// const TeacherGameLobby = ({ gameCode, onBack }) => {
//   const [gameData, setGameData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ NEW: switch between lobby and stats page
//   const [view, setView] = useState("lobby"); // 'lobby' | 'stats'

//   const API_BASE =
//     (import.meta?.env?.VITE_SERVER_API_URL || "http://localhost:5000").replace(/\/$/, "");

//   const topicDisplay = useMemo(() => {
//     return gameData?.topics?.map((t) => TOPIC_LABELS[t] || t).join(", ");
//   }, [gameData]);

//   useEffect(() => {
//     const fetchGame = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/admin/game/${gameCode}`);
//         if (!res.ok) throw new Error("Failed to fetch");
//         const data = await res.json();
//         setGameData(data);
//       } catch (err) {
//         console.error("Error fetching game data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGame();
//     const intervalId = setInterval(fetchGame, 5000);
//     return () => clearInterval(intervalId);
//   }, [API_BASE, gameCode]);

//   if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
//   if (!gameData) return <Typography align="center" sx={{ mt: 4 }}>קוד משחק שגוי</Typography>;

//   // --- Calculate dynamic average ---
//   const calculateLiveAverage = (student, topics) => {
//     let totalSum = 0;
//     let topicCount = 0;

//     const scores = student.scoresByTopic || {};
//     topics.forEach((topic) => {
//       const stats = scores[topic];
//       if (stats && stats.count > 0) {
//         totalSum += stats.total / stats.count;
//         topicCount++;
//       }
//     });

//     if (topicCount === 0) return "-";
//     return (totalSum / topicCount).toFixed(1);
//   };

//   const finishedCount = gameData.students ? gameData.students.filter((s) => s.finished).length : 0;
//   const totalStudents = gameData.students ? gameData.students.length : 0;
//   const gameTopics = gameData.topics || [];

//   // ✅ If teacher clicked "Stats" -> show separate page
//   if (view === "stats") {
//     return (
//       <GameStats
//         gameData={gameData}
//         topicLabels={TOPIC_LABELS}
//         onBackToLobby={() => setView("lobby")}
//       />
//     );
//   }

//   // ✅ Default view: Lobby (existing)
//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         p: 4,
//         maxWidth: 1000,
//         width: "100%",
//         mx: "auto",
//         textAlign: "center",
//       }}
//     >
//       <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold", color: "#2c3e50" }}>
//         משחק בנושא: {topicDisplay}
//       </Typography>

//       <Box
//         sx={{
//           my: 3,
//           p: 2,
//           bgcolor: "#e8f6f3",
//           borderRadius: 2,
//           border: "2px dashed #1abc9c",
//           display: "inline-block",
//           minWidth: "300px",
//         }}
//       >
//         <Typography variant="h6" color="text.secondary">
//           קוד משחק (העתק/י לשיתוף):
//         </Typography>
//         <Typography variant="h3" sx={{ fontWeight: "bold", color: "#16a085", letterSpacing: 6 }}>
//           {gameData.gameCode}
//         </Typography>
//       </Box>

//       <Box sx={{ mb: 3, display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
//         <Typography variant="h6">
//           התחברו: <strong>{totalStudents}</strong>
//         </Typography>
//         <Typography variant="h6">
//           סיימו: <strong>{finishedCount}</strong>
//         </Typography>
//       </Box>

//       {/* ✅ NEW: button to open stats page */}
//       <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }} justifyContent="center">
//         <Button variant="primary" onClick={() => setView("stats")}>
//           הצג סטטיסטיקות
//         </Button>
//         <Button variant="secondary" onClick={onBack}>
//           חזרה לניהול המשחקים
//         </Button>
//       </Stack>

//       {/* Results table */}
//       <TableContainer component={Paper} elevation={1} sx={{ maxHeight: 400, mb: 1, width: "100%" }}>
//         <Table stickyHeader aria-label="student results table" dir="rtl">
//           <TableHead>
//             <TableRow>
//               <TableCell align="right" sx={{ fontWeight: "bold" }}>
//                 שם התלמיד/ה
//               </TableCell>

//               {gameTopics.map((topic) => (
//                 <TableCell key={topic} align="center" sx={{ fontWeight: "bold" }}>
//                   {TOPIC_LABELS[topic] || topic}
//                 </TableCell>
//               ))}

//               <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                 ציון משוקלל
//               </TableCell>
//               <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                 סטטוס
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {gameData.students && gameData.students.length > 0 ? (
//               gameData.students.map((student, index) => (
//                 <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
//                   <TableCell align="right" component="th" scope="row">
//                     {student.username}
//                   </TableCell>

//                   {gameTopics.map((topic) => {
//                     const topicStats = student.scoresByTopic && student.scoresByTopic[topic];
//                     let displayScore = "-";
//                     if (topicStats && topicStats.count > 0) {
//                       displayScore = (topicStats.total / topicStats.count).toFixed(1);
//                     }

//                     return (
//                       <TableCell key={topic} align="center">
//                         {displayScore}
//                       </TableCell>
//                     );
//                   })}

//                   <TableCell align="center" sx={{ fontWeight: "bold", color: "#2980b9" }}>
//                     {calculateLiveAverage(student, gameTopics)}
//                   </TableCell>

//                   <TableCell align="center">
//                     {student.finished ? (
//                       <Chip label="סיימ/ה" color="success" size="small" />
//                     ) : (
//                       <Chip label="משחק/ת..." color="warning" size="small" variant="outlined" />
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={3 + gameTopics.length} align="center">
//                   <Typography variant="body2" sx={{ p: 2, color: "text.secondary" }}>
//                     עדיין אין תלמידים מחוברים.
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// };

// TeacherGameLobby.propTypes = {
//   gameCode: PropTypes.string.isRequired,
//   onBack: PropTypes.func.isRequired,
// };

// export default TeacherGameLobby;
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

// Material UI
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

// Icons
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// Project
import Button from "../common/Button";
import GameStats from "./GameStats";

// Translate topic names to Hebrew
const TOPIC_LABELS = {
  Cyberbullying: "בריונות ברשת",
  Privacy: "פרטיות",
  Fakenews: "פייק ניוז",
  Shaming: "שיימינג",
};

const TeacherGameLobby = ({ gameCode, onBack }) => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("lobby"); // lobby | stats
  const [copied, setCopied] = useState(false);

  const API_BASE =
    (import.meta?.env?.VITE_SERVER_API_URL || "http://localhost:5000").replace(
      /\/$/,
      ""
    );

  const topicDisplay = useMemo(() => {
    return gameData?.topics?.map((t) => TOPIC_LABELS[t] || t).join(", ");
  }, [gameData]);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/game/${gameCode}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setGameData(data);
      } catch (err) {
        console.error("Error fetching game data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
    const intervalId = setInterval(fetchGame, 5000);
    return () => clearInterval(intervalId);
  }, [API_BASE, gameCode]);

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  if (!gameData)
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        קוד משחק שגוי
      </Typography>
    );

  const finishedCount = gameData.students
    ? gameData.students.filter((s) => s.finished).length
    : 0;
  const totalStudents = gameData.students ? gameData.students.length : 0;
  const gameTopics = gameData.topics || [];

  const calculateLiveAverage = (student, topics) => {
    let totalSum = 0;
    let topicCount = 0;
    const scores = student.scoresByTopic || {};

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

  const handleCopyCode = async () => {
    const code = gameData.gameCode;
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

  // 👉 Stats page
  if (view === "stats") {
    return (
      <GameStats
        gameData={gameData}
        topicLabels={TOPIC_LABELS}
        onBackToLobby={() => setView("lobby")}
      />
    );
  }

  // 👉 Lobby page
  return (
    <Paper
      elevation={3}
      sx={{ p: 4, maxWidth: 1000, width: "100%", mx: "auto", textAlign: "center" }}
    >
      <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
        משחק בנושא: {topicDisplay}
      </Typography>

      <Box
        sx={{
          my: 3,
          p: 2,
          bgcolor: "#e8f6f3",
          borderRadius: 2,
          border: "2px dashed #1abc9c",
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          קוד משחק:
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", color: "#16a085", letterSpacing: 4 }}
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
        <Button variant="primary" onClick={() => setView("stats")}>
          הצג סטטיסטיקות
        </Button>
        <Button variant="secondary" onClick={onBack}>
          חזרה לניהול המשחקים
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={1}>
        <Table stickyHeader dir="rtl">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>שם התלמיד/ה</TableCell>
              {gameTopics.map((topic) => (
                <TableCell key={topic} align="center" sx={{ fontWeight: "bold" }}>
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
            {gameData.students?.length ? (
              gameData.students.map((student, idx) => (
                <TableRow key={idx}>
                  <TableCell>{student.username}</TableCell>

                  {gameTopics.map((topic) => {
                    const stats = student.scoresByTopic?.[topic];
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
  );
};

TeacherGameLobby.propTypes = {
  gameCode: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default TeacherGameLobby;
