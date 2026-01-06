// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";

// const mockResults = [
//   { topic: "Cyber Safety", answers: 12 },
//   { topic: "Privacy", answers: 8 },
//   { topic: "Phishing", answers: 15 },
//   { topic: "Social Networks", answers: 6 },
// ];

// const AdminResultsPage = () => {
//   return (
//     <Box>
//       <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
//         מצב מנהל – ניתוח תוצאות
//       </Typography>

//       <Typography variant="body1" sx={{ mb: 4 }}>
//         סיכום תוצאות המשחק לפי נושאים
//       </Typography>

//       {/* Results Table */}
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell><strong>נושא</strong></TableCell>
//               <TableCell align="center"><strong>מספר תשובות</strong></TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {mockResults.map((row, index) => (
//               <TableRow key={index}>
//                 <TableCell>{row.topic}</TableCell>
//                 <TableCell align="center">{row.answers}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Simple Bar Chart */}
//       <Box sx={{ mt: 5 }}>
//         <Typography variant="h6" sx={{ mb: 2 }}>
//           גרף התפלגות תשובות
//         </Typography>

//         {mockResults.map((row, index) => (
//           <Box key={index} sx={{ mb: 1 }}>
//             <Typography variant="body2">{row.topic}</Typography>
//             <Box
//               sx={{
//                 height: 20,
//                 width: `${row.answers * 10}px`,
//                 backgroundColor: "#1976d2",
//                 borderRadius: 1,
//               }}
//             />
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default AdminResultsPage;

// //2
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
} from "@mui/material";

const mockResults = [
  { topic: "Cyber Safety", answers: 12 },
  { topic: "Privacy", answers: 8 },
  { topic: "Phishing", answers: 15 },
  { topic: "Social Networks", answers: 6 },
];

const AdminResultsPage = () => {
  // --- Calculations (summary) ---
  const totalAnswers = mockResults.reduce((sum, r) => sum + r.answers, 0);
  const maxAnswers = Math.max(...mockResults.map((r) => r.answers));
  const topTopic = mockResults.find((r) => r.answers === maxAnswers)?.topic ?? "-";

  // For chart scaling (0..100%)
  const maxForChart = maxAnswers || 1;

  return (
    <Box sx={{ direction: "rtl" }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>
        מצב מנהל – ניתוח תוצאות
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        סיכום תוצאות המשחק לפי נושאים
      </Typography>

      {/* Summary Cards */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2,
            flex: 1,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            סה״כ תשובות
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
            {totalAnswers}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            flex: 1,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            נושא מוביל
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
            {topTopic}
          </Typography>
        </Paper>
      </Stack>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>נושא</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800 }}>
                מספר תשובות
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 800 }}>
                אחוז מכלל התשובות
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {mockResults.map((row, index) => {
              const percent =
                totalAnswers > 0 ? Math.round((row.answers / totalAnswers) * 100) : 0;

              return (
                <TableRow key={index}>
                  <TableCell>{row.topic}</TableCell>
                  <TableCell align="center">{row.answers}</TableCell>
                  <TableCell align="center">{percent}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 4 }} />

      {/* Bar Chart */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
        גרף התפלגות תשובות לפי נושאים
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2}>
          {mockResults.map((row, index) => {
            const percentOfMax = Math.round((row.answers / maxForChart) * 100);
            const percentOfTotal =
              totalAnswers > 0 ? Math.round((row.answers / totalAnswers) * 100) : 0;

            return (
              <Box key={index}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 700 }}>{row.topic}</Typography>
                  <Typography color="text.secondary">
                    {row.answers} תשובות • {percentOfTotal}%
                  </Typography>
                </Stack>

                {/* Track */}
                <Box
                  sx={{
                    height: 14,
                    borderRadius: 999,
                    backgroundColor: "rgba(25, 118, 210, 0.12)",
                    overflow: "hidden",
                  }}
                >
                  {/* Fill */}
                  <Box
                    sx={{
                      height: "100%",
                      width: `${percentOfMax}%`,
                      backgroundColor: "#1976d2",
                      borderRadius: 999,
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
          *העמודה הכחולה מייצגת יחס לנושא עם הכי הרבה תשובות.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminResultsPage;
