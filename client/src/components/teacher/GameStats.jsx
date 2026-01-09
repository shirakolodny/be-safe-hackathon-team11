
// import {
//   Box,
//   Typography,
//   Paper,
//   Stack,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";

// const mockResults = [
//   { topic: "Cyber Safety", answers: 12 },
//   { topic: "Privacy", answers: 8 },
//   { topic: "Phishing", answers: 15 },
//   { topic: "Social Networks", answers: 6 },
// ];

// const AdminResultsPage = () => {
//   // --- Calculations (summary) ---
//   const totalAnswers = mockResults.reduce((sum, r) => sum + r.answers, 0);
//   const maxAnswers = Math.max(...mockResults.map((r) => r.answers));
//   const topTopic = mockResults.find((r) => r.answers === maxAnswers)?.topic ?? "-";

//   // For chart scaling (0..100%)
//   const maxForChart = maxAnswers || 1;

//   return (
//     <Box sx={{ direction: "rtl" }}>
//       <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>
//         מצב מנהל – ניתוח תוצאות
//       </Typography>

//       <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
//         סיכום תוצאות המשחק לפי נושאים
//       </Typography>

//       {/* Summary Cards */}
//       <Stack
//         direction={{ xs: "column", sm: "row" }}
//         spacing={2}
//         sx={{ mb: 3 }}
//       >
//         <Paper
//           elevation={0}
//           sx={{
//             p: 2,
//             flex: 1,
//             borderRadius: 2,
//             border: "1px solid",
//             borderColor: "divider",
//           }}
//         >
//           <Typography variant="body2" color="text.secondary">
//             סה״כ תשובות
//           </Typography>
//           <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
//             {totalAnswers}
//           </Typography>
//         </Paper>

//         <Paper
//           elevation={0}
//           sx={{
//             p: 2,
//             flex: 1,
//             borderRadius: 2,
//             border: "1px solid",
//             borderColor: "divider",
//           }}
//         >
//           <Typography variant="body2" color="text.secondary">
//             נושא מוביל
//           </Typography>
//           <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
//             {topTopic}
//           </Typography>
//         </Paper>
//       </Stack>

//       {/* Table */}
//       <TableContainer
//         component={Paper}
//         elevation={0}
//         sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
//       >
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 800 }}>נושא</TableCell>
//               <TableCell align="center" sx={{ fontWeight: 800 }}>
//                 מספר תשובות
//               </TableCell>
//               <TableCell align="center" sx={{ fontWeight: 800 }}>
//                 אחוז מכלל התשובות
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {mockResults.map((row, index) => {
//               const percent =
//                 totalAnswers > 0 ? Math.round((row.answers / totalAnswers) * 100) : 0;

//               return (
//                 <TableRow key={index}>
//                   <TableCell>{row.topic}</TableCell>
//                   <TableCell align="center">{row.answers}</TableCell>
//                   <TableCell align="center">{percent}%</TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Divider sx={{ my: 4 }} />

//       {/* Bar Chart */}
//       <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
//         גרף התפלגות תשובות לפי נושאים
//       </Typography>

//       <Paper
//         elevation={0}
//         sx={{
//           p: 2,
//           borderRadius: 2,
//           border: "1px solid",
//           borderColor: "divider",
//         }}
//       >
//         <Stack spacing={2}>
//           {mockResults.map((row, index) => {
//             const percentOfMax = Math.round((row.answers / maxForChart) * 100);
//             const percentOfTotal =
//               totalAnswers > 0 ? Math.round((row.answers / totalAnswers) * 100) : 0;

//             return (
//               <Box key={index}>
//                 <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
//                   <Typography sx={{ fontWeight: 700 }}>{row.topic}</Typography>
//                   <Typography color="text.secondary">
//                     {row.answers} תשובות • {percentOfTotal}%
//                   </Typography>
//                 </Stack>

//                 {/* Track */}
//                 <Box
//                   sx={{
//                     height: 14,
//                     borderRadius: 999,
//                     backgroundColor: "rgba(25, 118, 210, 0.12)",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {/* Fill */}
//                   <Box
//                     sx={{
//                       height: "100%",
//                       width: `${percentOfMax}%`,
//                       backgroundColor: "#1976d2",
//                       borderRadius: 999,
//                     }}
//                   />
//                 </Box>
//               </Box>
//             );
//           })}
//         </Stack>

//         <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
//           *העמודה הכחולה מייצגת יחס לנושא עם הכי הרבה תשובות.
//         </Typography>
//       </Paper>
//     </Box>
//   );
// };

// export default AdminResultsPage;







// פעם 2תיקון 
// import PropTypes from "prop-types";
// import {
//   Box,
//   Typography,
//   Paper,
//   Stack,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import Button from "../common/Button";

// const safeNum = (v) => (Number.isFinite(v) ? v : 0);

// const GameStats = ({ gameData, topicLabels, onBackToLobby }) => {
//   const topics = gameData?.topics || [];
//   const students = gameData?.students || [];

//   // Build per-topic stats from students.scoresByTopic
//   const topicStats = topics.map((topic) => {
//     let totalCount = 0;
//     let totalSum = 0;

//     students.forEach((s) => {
//       const stats = s?.scoresByTopic?.[topic];
//       if (stats && stats.count > 0) {
//         totalCount += safeNum(stats.count);
//         totalSum += safeNum(stats.total);
//       }
//     });

//     const avg = totalCount > 0 ? totalSum / totalCount : 0;

//     return {
//       topic,
//       label: topicLabels?.[topic] || topic,
//       answers: totalCount,
//       avg: avg,
//     };
//   });

//   const totalAnswers = topicStats.reduce((sum, t) => sum + t.answers, 0);
//   const maxAnswers = Math.max(1, ...topicStats.map((t) => t.answers));
//   const top = topicStats.reduce(
//     (best, cur) => (cur.answers > best.answers ? cur : best),
//     { topic: "-", label: "-", answers: -1 }
//   );

//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         p: 4,
//         maxWidth: 1000,
//         width: "100%",
//         mx: "auto",
//         textAlign: "center",
//         direction: "rtl",
//       }}
//     >
//       <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//         <Typography variant="h5" sx={{ fontWeight: 800 }}>
//           סטטיסטיקות משחק
//         </Typography>

//         {/* ✅ Back button to lobby */}
//         <Button variant="secondary" onClick={onBackToLobby}>
//           חזרה ללובי
//         </Button>
//       </Stack>

//       <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
//         סיכום נתונים לפי נושאים (מתעדכן לפי התלמידים והציונים שנאספו)
//       </Typography>

//       {/* Summary Cards */}
//       <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
//         <Paper
//           elevation={0}
//           sx={{ p: 2, flex: 1, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
//         >
//           <Typography variant="body2" color="text.secondary">
//             סה״כ תשובות (בכל הנושאים)
//           </Typography>
//           <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
//             {totalAnswers}
//           </Typography>
//         </Paper>

//         <Paper
//           elevation={0}
//           sx={{ p: 2, flex: 1, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
//         >
//           <Typography variant="body2" color="text.secondary">
//             נושא מוביל
//           </Typography>
//           <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
//             {top.label}
//           </Typography>
//         </Paper>
//       </Stack>

//       {/* Table */}
//       <TableContainer
//         component={Paper}
//         elevation={0}
//         sx={{
//           borderRadius: 2,
//           border: "1px solid",
//           borderColor: "divider",
//           width: "100%",
//         }}
//       >
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 800 }}>נושא</TableCell>
//               <TableCell align="center" sx={{ fontWeight: 800 }}>
//                 מספר תשובות
//               </TableCell>
//               <TableCell align="center" sx={{ fontWeight: 800 }}>
//                 אחוז מכלל התשובות
//               </TableCell>
//               <TableCell align="center" sx={{ fontWeight: 800 }}>
//                 ממוצע (1 ספרה)
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {topicStats.map((row) => {
//               const percent = totalAnswers > 0 ? Math.round((row.answers / totalAnswers) * 100) : 0;
//               const avgDisplay = row.answers > 0 ? row.avg.toFixed(1) : "-";

//               return (
//                 <TableRow key={row.topic}>
//                   <TableCell>{row.label}</TableCell>
//                   <TableCell align="center">{row.answers}</TableCell>
//                   <TableCell align="center">{percent}%</TableCell>
//                   <TableCell align="center">{avgDisplay}</TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Divider sx={{ my: 4 }} />

//       {/* Bar Chart */}
//       <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
//         גרף התפלגות תשובות לפי נושאים
//       </Typography>

//       <Paper
//         elevation={0}
//         sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
//       >
//         <Stack spacing={2}>
//           {topicStats.map((row) => {
//             const percentOfMax = Math.round((row.answers / maxAnswers) * 100);
//             const percentOfTotal =
//               totalAnswers > 0 ? Math.round((row.answers / totalAnswers) * 100) : 0;

//             return (
//               <Box key={row.topic}>
//                 <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
//                   <Typography sx={{ fontWeight: 700 }}>{row.label}</Typography>
//                   <Typography color="text.secondary">
//                     {row.answers} תשובות • {percentOfTotal}%
//                   </Typography>
//                 </Stack>

//                 {/* Track */}
//                 <Box
//                   sx={{
//                     height: 14,
//                     borderRadius: 999,
//                     backgroundColor: "rgba(25, 118, 210, 0.12)",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {/* Fill */}
//                   <Box
//                     sx={{
//                       height: "100%",
//                       width: `${percentOfMax}%`,
//                       backgroundColor: "#1976d2",
//                       borderRadius: 999,
//                     }}
//                   />
//                 </Box>
//               </Box>
//             );
//           })}
//         </Stack>

//         <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
//           *העמודה הכחולה מייצגת יחס לנושא עם הכי הרבה תשובות.
//         </Typography>
//       </Paper>
//     </Paper>
//   );
// };

// GameStats.propTypes = {
//   gameData: PropTypes.object.isRequired,
//   topicLabels: PropTypes.object,
//   onBackToLobby: PropTypes.func.isRequired,
// };

// export default GameStats;

// תיקון 

// import PropTypes from "prop-types";
// import {
//   Box,
//   Typography,
//   Paper,
//   Stack,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import Button from "../common/Button";

// const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

// const GameStats = ({ gameData, topicLabels, onBackToLobby }) => {
//   const topics = gameData?.topics || [];
//   const students = gameData?.students || [];

//   // ✅ Build per-topic totals/counts across ALL students (weighted)
//   const perTopic = topics.map((topic) => {
//     let totalSum = 0;   // sum of points
//     let totalCount = 0; // sum of answered questions

//     students.forEach((s) => {
//       const stats = s?.scoresByTopic?.[topic];
//       if (stats && safeNum(stats.count) > 0) {
//         totalSum += safeNum(stats.total);
//         totalCount += safeNum(stats.count);
//       }
//     });

//     const avg = totalCount > 0 ? totalSum / totalCount : 0;

//     return {
//       topic,
//       label: topicLabels?.[topic] || topic,
//       totalSum,
//       totalCount,
//       avg, // weighted avg
//     };
//   });

//   // ✅ Overall weighted average across ALL topics (all answered questions)
//   const overallTotalSum = perTopic.reduce((sum, t) => sum + t.totalSum, 0);
//   const overallTotalCount = perTopic.reduce((sum, t) => sum + t.totalCount, 0);
//   const overallAvg = overallTotalCount > 0 ? overallTotalSum / overallTotalCount : 0;

//   // For chart scaling
//   const maxCount = Math.max(1, ...perTopic.map((t) => t.totalCount));
//   const maxAvg = Math.max(1, ...perTopic.map((t) => t.avg)); // for avg bar visualization

//   // Top topic by participation (most answered questions)
//   const topByCount = perTopic.reduce(
//     (best, cur) => (cur.totalCount > best.totalCount ? cur : best),
//     { label: "-", totalCount: -1 }
//   );

//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         p: 4,
//         maxWidth: 1000,
//         width: "100%",
//         mx: "auto",
//         textAlign: "center",
//         direction: "rtl",
//       }}
//     >
//       <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//         <Typography variant="h5" sx={{ fontWeight: 800 }}>
//           סטטיסטיקות משחק (משוקלל)
//         </Typography>

//         <Button variant="secondary" onClick={onBackToLobby}>
//           חזרה ללובי
//         </Button>
//       </Stack>

//       <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
//         שיקלול לפי מספר התשובות בפועל בכל נושא + שיקלול כולל לכל השאלות יחד
//       </Typography>

//       {/* Summary cards */}
//       <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
//         <Paper elevation={0} sx={{ p: 2, flex: 1, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
//           <Typography variant="body2" color="text.secondary">
//             סה״כ שאלות שנענו (בכל הנושאים יחד)
//           </Typography>
//           <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
//             {overallTotalCount}
//           </Typography>
//         </Paper>

//         <Paper elevation={0} sx={{ p: 2, flex: 1, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
//           <Typography variant="body2" color="text.secondary">
//             ציון כללי משוקלל (כל השאלות יחד)
//           </Typography>
//           <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
//             {overallTotalCount > 0 ? overallAvg.toFixed(2) : "-"}
//           </Typography>
//         </Paper>

//         <Paper elevation={0} sx={{ p: 2, flex: 1, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
//           <Typography variant="body2" color="text.secondary">
//             נושא עם הכי הרבה תשובות
//           </Typography>
//           <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
//             {topByCount.label}
//           </Typography>
//         </Paper>
//       </Stack>

//       {/* Table */}
//       <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider", width: "100%" }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 800 }}>נושא</TableCell>
//               <TableCell align="center" sx={{ fontWeight: 800 }}>
//                 כמה שאלות נענו בנושא (Σ count)
//               </TableCell>
//               <TableCell align="center" sx={{ fontWeight: 800 }}>
//                 ציון משוקלל לנושא (Σ total / Σ count)
//               </TableCell>
//               <TableCell align="center" sx={{ fontWeight: 800 }}>
//                 אחוז השתתפות מכלל השאלות
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {perTopic.map((t) => {
//               const percent = overallTotalCount > 0 ? Math.round((t.totalCount / overallTotalCount) * 100) : 0;
//               return (
//                 <TableRow key={t.topic}>
//                   <TableCell>{t.label}</TableCell>
//                   <TableCell align="center">{t.totalCount}</TableCell>
//                   <TableCell align="center">{t.totalCount > 0 ? t.avg.toFixed(2) : "-"}</TableCell>
//                   <TableCell align="center">{percent}%</TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Divider sx={{ my: 4 }} />

//       {/* Charts */}
//       <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
//         גרפים: כמה ענו בכל נושא + ציון משוקלל לנושא
//       </Typography>

//       <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
//         <Stack spacing={3}>
//           {perTopic.map((t) => {
//             const countWidth = Math.round((t.totalCount / maxCount) * 100);
//             const avgWidth = Math.round(((t.avg || 0) / maxAvg) * 100);

//             return (
//               <Box key={t.topic} sx={{ textAlign: "right" }}>
//                 <Typography sx={{ fontWeight: 800, mb: 1 }}>{t.label}</Typography>

//                 {/* Count bar */}
//                 <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
//                   <Typography color="text.secondary">כמות שאלות שנענו</Typography>
//                   <Typography color="text.secondary">{t.totalCount}</Typography>
//                 </Stack>
//                 <Box sx={{ height: 12, borderRadius: 999, backgroundColor: "rgba(25,118,210,0.12)", overflow: "hidden", mb: 1 }}>
//                   <Box sx={{ height: "100%", width: `${countWidth}%`, backgroundColor: "#1976d2", borderRadius: 999 }} />
//                 </Box>

//                 {/* Avg bar */}
//                 <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
//                   <Typography color="text.secondary">ציון משוקלל לנושא</Typography>
//                   <Typography color="text.secondary">{t.totalCount > 0 ? t.avg.toFixed(2) : "-"}</Typography>
//                 </Stack>
//                 <Box sx={{ height: 12, borderRadius: 999, backgroundColor: "rgba(46,125,50,0.12)", overflow: "hidden" }}>
//                   <Box sx={{ height: "100%", width: `${avgWidth}%`, backgroundColor: "#2e7d32", borderRadius: 999 }} />
//                 </Box>
//               </Box>
//             );
//           })}
//         </Stack>

//         <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
//           *כחול = כמה שאלות נענו (השוואה לנושא עם הכי הרבה). ירוק = ציון משוקלל לנושא.
//         </Typography>
//       </Paper>
//     </Paper>
//   );
// };

// GameStats.propTypes = {
//   gameData: PropTypes.object.isRequired,
//   topicLabels: PropTypes.object,
//   onBackToLobby: PropTypes.func.isRequired,
// };

// export default GameStats;


// 4



/* eslint-disable react/prop-types */

import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import Button from "../common/Button";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const clamp01 = (x) => Math.max(0, Math.min(1, x));

/**
 * חשוב:
 * אם אצלכם הציון הוא 0..10 תשאירי 10
 * אם הוא 0..100 תשני ל-100
 * אם הוא 0..1 תשני ל-1
 */
const scoreScaleMax = 10;

// צבעים לגרפים
const COLORS = ["#1976d2", "#9c27b0", "#ff9800", "#2e7d32", "#00838f", "#c2185b"];

const GameStats = ({ gameData, topicLabels, onBackToLobby }) => {
  const topics = gameData?.topics || [];
  const students = gameData?.students || [];

  // === Aggregate per-topic totals/counts across ALL students (בלי "let" שמוקצה מחדש) ===
  const perTopic = topics.map((topic) => {
    const agg = students.reduce(
      (acc, s) => {
        const stats = s?.scoresByTopic?.[topic];
        const c = safeNum(stats?.count);
        const t = safeNum(stats?.total);
        if (c > 0) {
          return {
            totalCount: acc.totalCount + c,
            totalSum: acc.totalSum + t,
          };
        }
        return acc;
      },
      { totalCount: 0, totalSum: 0 }
    );

    const avg = agg.totalCount > 0 ? agg.totalSum / agg.totalCount : 0;

    return {
      topic,
      label: topicLabels?.[topic] || topic,
      totalCount: agg.totalCount,
      totalSum: agg.totalSum,
      avg, // weighted avg per topic
    };
  });

  // === Overall weighted average across ALL topics ===
  const overallTotalCount = perTopic.reduce((sum, t) => sum + t.totalCount, 0);
  const overallTotalSum = perTopic.reduce((sum, t) => sum + t.totalSum, 0);
  const overallAvg = overallTotalCount > 0 ? overallTotalSum / overallTotalCount : 0;

  // אחוז מכלל השאלות לכל נושא
  const perTopicWithPercent = perTopic.map((t) => ({
    ...t,
    percent: overallTotalCount > 0 ? (t.totalCount / overallTotalCount) * 100 : 0,
  }));

  // אחוז כללי ביחס למקסימום ציון
  const overallPercent = clamp01(overallAvg / scoreScaleMax) * 100;

  // === Recharts Data ===
  const pieData = perTopicWithPercent
    .filter((t) => t.totalCount > 0)
    .map((t) => ({
      name: t.label,
      value: t.totalCount, // כמה שאלות נענו בנושא
      percent: t.percent,
    }));

  const barsCountData = perTopicWithPercent.map((t) => ({
    topic: t.label,
    count: t.totalCount,
    percent: t.percent,
  }));

  const barsScoreData = perTopicWithPercent.map((t) => ({
    topic: t.label,
    avg: t.totalCount > 0 ? Number(t.avg.toFixed(2)) : 0,
    scorePercent: clamp01(t.avg / scoreScaleMax) * 100,
  }));

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 1150,
        width: "100%",
        mx: "auto",
        direction: "rtl",
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          סטטיסטיקות משחק (גרפים + אחוזים)
        </Typography>

        <Button variant="secondary" onClick={onBackToLobby}>
          חזרה ללובי
        </Button>
      </Stack>

      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary", textAlign: "right" }}>
        כאן מוצג שיקלול משוקלל לכל נושא (Σ total / Σ count) + שיקלול כולל לכל המשחק (כל השאלות יחד),
        וגם התפלגות שאלות באחוזים לפי נושא.
      </Typography>

      {/* Summary cards */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <Paper elevation={0} sx={{ p: 2, flex: 1, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <Typography variant="body2" color="text.secondary">
            סה״כ שאלות שנענו (כל הנושאים יחד)
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
            {overallTotalCount}
          </Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, flex: 1, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <Typography variant="body2" color="text.secondary">
            ציון כללי משוקלל (כל השאלות יחד)
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
            {overallTotalCount > 0 ? overallAvg.toFixed(2) : "-"} / {scoreScaleMax}
          </Typography>

          <Box sx={{ mt: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                אחוז מהציון המקסימלי
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {overallTotalCount > 0 ? Math.round(overallPercent) : 0}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={overallTotalCount > 0 ? overallPercent : 0}
              sx={{ height: 10, borderRadius: 999 }}
            />
          </Box>
        </Paper>
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Pie + Legend */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, textAlign: "right" }}>
        התפלגות השאלות שנענו לפי נושא (Pie + אחוזים)
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="stretch">
        <Paper
          elevation={0}
          sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", flex: 1 }}
        >
          <Box sx={{ height: 280 }}>
            {pieData.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: "right", mt: 2 }}>
                עדיין אין נתונים לגרף (עוד לא נענו שאלות).
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label={({ percent }) => `${Math.round(percent * 100)}%`}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>

                  <ReTooltip
                    formatter={(value, name, props) => {
                      const p = props?.payload?.percent ?? 0;
                      return [`${value} שאלות (${Math.round(p)}%)`, name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", flex: 1 }}
        >
          <Typography sx={{ fontWeight: 800, mb: 1, textAlign: "right" }}>מקרא</Typography>
          <Stack spacing={1}>
            {pieData.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: "right" }}>
                אין מה להציג עדיין.
              </Typography>
            ) : (
              pieData.map((d, i) => (
                <Stack key={d.name} direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: 999, backgroundColor: COLORS[i % COLORS.length] }} />
                    <Typography>{d.name}</Typography>
                  </Stack>
                  <Typography color="text.secondary">{Math.round(d.percent)}%</Typography>
                </Stack>
              ))
            )}
          </Stack>
        </Paper>
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Bar: Counts/Participation */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, textAlign: "right" }}>
        כמה שאלות נענו בכל נושא (Bar + אחוזים)
      </Typography>

      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barsCountData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" interval={0} tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <ReTooltip
                formatter={(value, name, props) => {
                  const p = props?.payload?.percent ?? 0;
                  return [`${value} שאלות (${Math.round(p)}%)`, "נענו"];
                }}
              />
              <Bar dataKey="count" fill={COLORS[0]}>
                <LabelList
                  dataKey="percent"
                  position="top"
                  formatter={(v) => `${Math.round(v)}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* Bar: Weighted Avg score */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, textAlign: "right" }}>
        ציון משוקלל לכל נושא (Σ total / Σ count)
      </Typography>

      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barsScoreData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" interval={0} tick={{ fontSize: 12 }} />
              <YAxis domain={[0, scoreScaleMax]} />
              <ReTooltip
                formatter={(value, name, props) => {
                  const sp = props?.payload?.scorePercent ?? 0;
                  return [`${value} / ${scoreScaleMax} (${Math.round(sp)}%)`, "ציון משוקלל"];
                }}
              />
              <Bar dataKey="avg" fill={COLORS[3]}>
                <LabelList
                  dataKey="avg"
                  position="top"
                  formatter={(v) => (Number(v) ? Number(v).toFixed(1) : "0")}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* Table */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, textAlign: "right" }}>
        טבלה מסכמת
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>נושא</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800 }}>
                שאלות שנענו
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 800 }}>
                אחוז מכלל השאלות
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 800 }}>
                ציון משוקלל לנושא
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {perTopicWithPercent.map((t) => (
              <TableRow key={t.topic}>
                <TableCell>{t.label}</TableCell>
                <TableCell align="center">{t.totalCount}</TableCell>
                <TableCell align="center">{Math.round(t.percent)}%</TableCell>
                <TableCell align="center">{t.totalCount > 0 ? t.avg.toFixed(2) : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

GameStats.propTypes = {
  gameData: PropTypes.object.isRequired,
  topicLabels: PropTypes.object,
  onBackToLobby: PropTypes.func.isRequired,
};

export default GameStats;
