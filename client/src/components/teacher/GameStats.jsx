import PropTypes from "prop-types";
import { useState, useEffect } from "react";
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
  Card,
  CardContent,
} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
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
 * Scale definition (0-10 or 0-100)
 */
const scoreScaleMax = 10;

// Theme Colors
const THEME = {
  primary: "#2E6E65",
  primaryHover: "#265751",
  title: "#2B3752",
  border: "rgba(43, 55, 82, 0.16)",
  softBg: "rgba(46, 110, 101, 0.08)",
  grid: "rgba(46, 110, 101, 0.18)",
};

// Pie Chart Colors
const PIE_COLORS = [
  "#2E6E65",
  "#3C8076",
  "#4B9287",
  "#5BA498",
  "#6CB7AA",
  "#7DC9BC",
];

// --- Custom Label Function for Pie Chart ---
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    // Push the label out by 1.2x the radius
    const radius = outerRadius * 1.2; 
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    // Do not show label if slice is very small (< 1%)
    if (percent < 0.01) return null;
  
    return (
      <text
        x={x}
        y={y}
        fill={THEME.title}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontWeight="bold"
        fontSize="14px"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
};

const GameStats = ({ gameData, topicLabels, onBackToLobby }) => {
  const topics = gameData?.topics || [];
  const students = gameData?.students || [];

  // --- AI Summary State ---
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  
  // Determine if game is active (default to true if undefined)
  const isActive = gameData?.isActive ?? true;

  const API_BASE = (import.meta?.env?.VITE_SERVER_API_URL || "http://localhost:5001").replace(/\/$/, "");

  // --- Effect: Fetch AI Summary if game is INACTIVE ---
  useEffect(() => {
    if (!isActive && !summary) {
        const fetchSummary = async () => {
            setLoadingSummary(true);
            try {
                const res = await fetch(`${API_BASE}/games/${gameData.gameCode}/summary`);
                if (!res.ok) throw new Error("Failed to fetch summary");
                const data = await res.json();
                setSummary(data.summary);
            } catch (error) {
                console.error("Failed to fetch summary", error);
                setSummary("Failed to load recommendations.");
            } finally {
                setLoadingSummary(false);
            }
        };
        fetchSummary();
    }
  }, [isActive, gameData.gameCode, summary, API_BASE]);

  // === Aggregate stats per topic ===
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
      avg,
    };
  });

  const overallTotalCount = perTopic.reduce((sum, t) => sum + t.totalCount, 0);
  const overallTotalSum = perTopic.reduce((sum, t) => sum + t.totalSum, 0);
  const overallAvg =
    overallTotalCount > 0 ? overallTotalSum / overallTotalCount : 0;

  const perTopicWithPercent = perTopic.map((t) => ({
    ...t,
    percent:
      overallTotalCount > 0 ? (t.totalCount / overallTotalCount) * 100 : 0,
  }));

  const overallPercent = clamp01(overallAvg / scoreScaleMax) * 100;

  // === Prepare Chart Data ===
  const pieData = perTopicWithPercent
    .filter((t) => t.totalCount > 0)
    .map((t) => ({
      name: t.label,
      value: t.totalCount,
      // CHANGE: Renamed to avoid conflict with Recharts 'percent' prop
      dataPercent: t.percent, 
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
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 1000,
          width: "100%",
          mx: "auto",
          direction: "rtl",
          borderRadius: 3,
        }}
      >
        <Stack spacing={5}>
          {/* --- Header --- */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 900, color: THEME.title }}
            >
              סטטיסטיקות משחק
            </Typography>

            <Button
              variant="secondary"
              onClick={onBackToLobby}
              sx={{
                color: THEME.primary,
                border: `2px solid ${THEME.primary}`,
                backgroundColor: "transparent",
                fontWeight: "bold",
                px: 2.2,
                py: 1,
                "&:hover": {
                  backgroundColor: THEME.softBg,
                  borderColor: THEME.primaryHover,
                },
              }}
            >
              חזרה ללובי
            </Button>
          </Stack>

          {/* --- AI Recommendation Section --- */}
          <Card sx={{ 
                border: "1px solid #2E6E65", 
                backgroundColor: isActive ? "#f5f5f5" : "#E8F6F3",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)" 
            }}>
                <CardContent sx={{ textAlign: "right", p: 3 }}>
                    <Stack direction="row" alignItems="center" gap={1} mb={2} justifyContent="flex-start">
                        <AutoAwesomeIcon sx={{ color: "#2E6E65" }} />
                        <Typography variant="h6" fontWeight="bold" color="#2E6E65">
                             המלצות להמשך
                        </Typography>
                    </Stack>

                    {isActive ? (
                        <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                            המשחק כעת פעיל. בסיום המשחק (כשתנעל/י אותו), המערכת תנתח את התוצאות ותפיק המלצות פדגוגיות להמשך השיעור.
                        </Typography>
                    ) : (
                        loadingSummary ? (
                            <Typography>מנתח נתונים ומגבש המלצות...</Typography>
                        ) : (
                            <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
                                {summary || "לא התקבלו המלצות."}
                            </Typography>
                        )
                    )}
                </CardContent>
            </Card>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              textAlign: "right",
              lineHeight: 1.8,
            }}
          >
            שיקלול משוקלל לכל נושא (Σ total / Σ count) + שיקלול כולל לכל המשחק +
            התפלגות באחוזים.
          </Typography>

          {/* --- Summary cards --- */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            sx={{ alignItems: "stretch", gap: 4 }}
          >
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2.8,
                borderRadius: 2.5,
                border: `1px solid ${THEME.border}`,
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                סה״כ שאלות שנענו
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, color: THEME.title }}
              >
                {overallTotalCount}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2.8,
                borderRadius: 2.5,
                border: `1px solid ${THEME.border}`,
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                ציון כללי משוקלל
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: 900, color: THEME.title }}
              >
                {overallTotalCount > 0 ? overallAvg.toFixed(2) : "-"} /{" "}
                {scoreScaleMax}
              </Typography>

              <Box sx={{ mt: 1.5 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 0.8 }}
                >
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
                  sx={{
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: "rgba(46,110,101,0.18)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: THEME.primary,
                      borderRadius: 999,
                    },
                  }}
                />
              </Box>
            </Paper>
          </Stack>

          <Divider />

          {/* --- Pie + Legend --- */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 900,
                textAlign: "right",
                color: THEME.title,
              }}
            >
              התפלגות שאלות לפי נושא (Pie + אחוזים)
            </Typography>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              sx={{ alignItems: "stretch", gap: 4 }}
            >
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2.5,
                  borderRadius: 2.5,
                  border: `1px solid ${THEME.border}`,
                }}
              >
                <Box sx={{ height: 300 }}>
                  {pieData.length === 0 ? (
                    <Typography
                      color="text.secondary"
                      sx={{ textAlign: "right", mt: 2 }}
                    >
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
                          // Enable lines connecting text to slice
                          labelLine={{
                            stroke: THEME.border,
                            strokeWidth: 1,
                            length: 15, 
                            length2: 15 
                          }}
                          // Use the custom function (receives Recharts' percent 0-1)
                          label={renderCustomizedLabel} 
                        >
                          {pieData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <ReTooltip
                          formatter={(value, name, tooltipItem) => {
                            // Use our renamed dataPercent for the tooltip
                            const p = tooltipItem?.payload?.dataPercent ?? 0;
                            return [`${value} שאלות (${Math.round(p)}%)`, name];
                          }}
                          contentStyle={{
                            borderRadius: 12,
                            border: `1px solid ${THEME.border}`,
                            textAlign: "right",
                            direction: "rtl"
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2.5,
                  borderRadius: 2.5,
                  border: `1px solid ${THEME.border}`,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    mb: 2,
                    textAlign: "right",
                    color: THEME.title,
                  }}
                >
                  מקרא
                </Typography>

                <Stack spacing={1.5}>
                  {pieData.length === 0 ? (
                    <Typography
                      color="text.secondary"
                      sx={{ textAlign: "right" }}
                    >
                      אין מה להציג עדיין.
                    </Typography>
                  ) : (
                    pieData.map((d, i) => (
                      <Stack
                        key={d.name}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          p: 1.2,
                          borderRadius: 2,
                          backgroundColor: "rgba(46,110,101,0.06)",
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              backgroundColor:
                                PIE_COLORS[i % PIE_COLORS.length],
                            }}
                          />
                          <Typography
                            sx={{ color: THEME.title, fontWeight: 700 }}
                          >
                            {d.name}
                          </Typography>
                        </Stack>

                        <Typography
                          sx={{ color: THEME.primary, fontWeight: 900 }}
                        >
                          {/* Use our renamed dataPercent */}
                          {Math.round(d.dataPercent)}%
                        </Typography>
                      </Stack>
                    ))
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Box>

          <Divider />

          {/* --- Bar: Counts --- */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 900,
                textAlign: "right",
                color: THEME.title,
              }}
            >
              כמה שאלות נענו בכל נושא (Bar + אחוזים)
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                border: `1px solid ${THEME.border}`,
              }}
            >
              <Box sx={{ height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barsCountData}
                    margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="topic"
                      interval={0}
                      tick={{ fontSize: 12, fill: THEME.title }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: THEME.title }}
                      tickMargin={10}
                    />
                    <ReTooltip
                      formatter={(value, _name, tooltipItem) => {
                        const p = tooltipItem?.payload?.percent ?? 0;
                        return [`${value} שאלות (${Math.round(p)}%)`, "נענו"];
                      }}
                      contentStyle={{
                        borderRadius: 12,
                        border: `1px solid ${THEME.border}`,
                      }}
                    />

                    <Bar dataKey="count" fill={THEME.primary}>
                      <LabelList
                        dataKey="percent"
                        position="top"
                        formatter={(v) => `${Math.round(v)}%`}
                        fill={THEME.primary}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>

          <Divider />

          {/* --- Bar: Scores --- */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 900,
                textAlign: "right",
                color: THEME.title,
              }}
            >
              ציון משוקלל לכל נושא (Σ total / Σ count)
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                border: `1px solid ${THEME.border}`,
              }}
            >
              <Box sx={{ height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barsScoreData}
                    margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="topic"
                      interval={0}
                      tick={{ fontSize: 12, fill: THEME.title }}
                    />
                    <YAxis
                      domain={[0, scoreScaleMax]}
                      tick={{ fontSize: 12, fill: THEME.title }}
                      tickMargin={10}
                    />
                    <ReTooltip
                      formatter={(value, _name, tooltipItem) => {
                        const sp = tooltipItem?.payload?.scorePercent ?? 0;
                        return [
                          `${value} / ${scoreScaleMax} (${Math.round(sp)}%)`,
                          "ציון משוקלל",
                        ];
                      }}
                      contentStyle={{
                        borderRadius: 12,
                        border: `1px solid ${THEME.border}`,
                      }}
                    />
                    <Bar dataKey="avg" fill={THEME.primary}>
                      <LabelList
                        dataKey="avg"
                        position="top"
                        formatter={(v) =>
                          Number(v) ? Number(v).toFixed(1) : "0"
                        }
                        fill={THEME.primary}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>

          <Divider />

          {/* --- Table --- */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 900,
                textAlign: "right",
                color: THEME.title,
              }}
            >
              טבלה מסכמת
            </Typography>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 2.5,
                border: `1px solid ${THEME.border}`,
                overflow: "hidden",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "rgba(46,110,101,0.08)" }}>
                    <TableCell sx={{ fontWeight: 900, color: THEME.title }}>
                      נושא
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 900, color: THEME.title }}
                    >
                      שאלות שנענו
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 900, color: THEME.title }}
                    >
                      אחוז מכלל השאלות
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 900, color: THEME.title }}
                    >
                      ציון משוקלל לנושא
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {perTopicWithPercent.map((t) => (
                    <TableRow key={t.topic} hover>
                      <TableCell sx={{ color: THEME.title, fontWeight: 700 }}>
                        {t.label}
                      </TableCell>
                      <TableCell align="center" sx={{ color: THEME.title }}>
                        {t.totalCount}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: THEME.primary, fontWeight: 900 }}
                      >
                        {Math.round(t.percent)}%
                      </TableCell>
                      <TableCell align="center" sx={{ color: THEME.title }}>
                        {t.totalCount > 0 ? t.avg.toFixed(2) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

GameStats.propTypes = {
  gameData: PropTypes.object.isRequired,
  topicLabels: PropTypes.object,
  onBackToLobby: PropTypes.func.isRequired,
};

export default GameStats;