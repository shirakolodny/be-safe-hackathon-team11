import { useState } from "react";
import PropTypes from "prop-types";

// MUI Imports
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "../common/Button";

const TOPICS = [
  { value: "Cyberbullying", label: "בריונות ברשת" },
  { value: "Privacy", label: "פרטיות ומידע אישי" },
  { value: "Fakenews", label: "זיהוי פייק ניוז" },
  { value: "Shaming", label: "שיימינג וחרם" },
];

// Uniform application colors
const COLORS = {
  title: "#2B3752",
  primary: "#2E6E65",
  primaryHover: "#265751",
  paperBorder: "rgba(43, 55, 82, 0.12)",
  softBg: "#E8F6F3",
  textMuted: "text.secondary",
};

const CreateGame = ({ onBack, onGameCreated }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedTopics(typeof value === "string" ? value.split(",") : value);
  };

  const handleCreateGame = async () => {
    setLoading(true);

    const profile = {
      topics: selectedTopics,
      focus: selectedTopics[0],
      issues: selectedTopics.slice(1),
    };

    try {
      const res = await fetch("http://localhost:5001/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      if (data.gameCode) onGameCreated(data.gameCode);
      else console.error("No game code returned from server");
    } catch (err) {
      console.error(err);
      alert("Error creating game");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        maxWidth: 650,
        width: "100%",
        mx: "auto",
        borderRadius: 3,
        border: `1.5px solid ${COLORS.paperBorder}`,
        backgroundColor: "#fff",
        direction: "rtl",
        fontFamily: "Rubik, sans-serif", // Default font for the paper
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 1,
          fontWeight: 800,
          color: COLORS.title,
          fontFamily: "Rubik, sans-serif",
          textAlign: "right",
        }}
      >
        בחירת נושאים בהם המשחק יתמקד
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 3,
          color: COLORS.textMuted,
          textAlign: "right",
          lineHeight: 1.8,
          fontFamily: "Rubik, sans-serif",
        }}
      >
        אפשר לבחור כמה נושאים. לאחר יצירת המשחק יופק קוד כניסה לתלמידים.
      </Typography>

      <TextField
        select
        label="נושאי השיעור (ניתן לבחור כמה)"
        fullWidth
        value={selectedTopics}
        onChange={handleChange}
        dir="rtl"
        sx={{
          mb: 3,

          // Text inside the field (selection)
          "& .MuiSelect-select": {
            color: COLORS.primary,
            fontWeight: 600,
            fontFamily: "Rubik, sans-serif",
          },

          // Default label (gray)
          "& .MuiInputLabel-root": {
            color: "#7b7b7b",
            fontFamily: "Rubik, sans-serif",
          },

          // Focused label (green)
          "& .MuiInputLabel-root.Mui-focused": {
            color: COLORS.primary,
          },

          // Standard border
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(43, 55, 82, 0.25)",
          },

          // Hover over field
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.primary,
          },

          // Focused border
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: COLORS.primary,
            },
        }}
        SelectProps={{
          multiple: true,
          MenuProps: {
            PaperProps: {
              sx: {
                borderRadius: 2,
                border: `1px solid ${COLORS.paperBorder}`,
                mt: 1,
                "& .MuiMenuItem-root": {
                  color: COLORS.title,
                  fontFamily: "Rubik, sans-serif", // Font for menu items
                },
                "& .MuiMenuItem-root:hover": {
                  backgroundColor: "rgba(46,110,101,0.08)",
                },
                "& .MuiMenuItem-root.Mui-selected": {
                  backgroundColor: "rgba(46,110,101,0.16)",
                },
                "& .MuiMenuItem-root.Mui-selected:hover": {
                  backgroundColor: "rgba(46,110,101,0.24)",
                },
              },
            },
          },

          renderValue: (selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {selected.map((value) => {
                const topic = TOPICS.find((t) => t.value === value);
                return (
                  <Chip
                    key={value}
                    label={topic ? topic.label : value}
                    sx={{
                      backgroundColor: COLORS.primary,
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: 2,
                      fontFamily: "Rubik, sans-serif", // Font for chips
                    }}
                  />
                );
              })}
            </Box>
          ),
        }}
      >
        {TOPICS.map((topic) => (
          <MenuItem key={topic.value} value={topic.value} dir="rtl">
            {topic.label}
          </MenuItem>
        ))}
      </TextField>

      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          backgroundColor: COLORS.softBg,
          border: `1px solid rgba(46,110,101,0.25)`,
          textAlign: "right",
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            color: COLORS.title,
            mb: 0.5,
            fontFamily: "Rubik, sans-serif",
          }}
        >
          נבחרו:
        </Typography>

        {selectedTopics.length === 0 ? (
          <Typography color="text.secondary" sx={{ fontFamily: "Rubik, sans-serif" }}>
            עדיין לא נבחרו נושאים.
          </Typography>
        ) : (
          <Typography
            sx={{
              color: COLORS.primary,
              fontWeight: 700,
              fontFamily: "Rubik, sans-serif",
            }}
          >
            {selectedTopics
              .map((v) => TOPICS.find((t) => t.value === v)?.label || v)
              .join(" • ")}
          </Typography>
        )}
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button
          variant="secondary"
          onClick={onBack}
          sx={{
            color: COLORS.primary,
            border: `2px solid ${COLORS.primary}`,
            backgroundColor: "transparent",
            fontWeight: "bold",
            fontFamily: "Rubik, sans-serif", // Font for button
            px: 4,
            py: 1.2,
            "&:hover": {
              backgroundColor: COLORS.softBg,
              borderColor: COLORS.primaryHover,
            },
          }}
        >
          ביטול
        </Button>

        <Button
          variant="success"
          onClick={handleCreateGame}
          disabled={selectedTopics.length === 0 || loading}
          sx={{
            backgroundColor: COLORS.primary,
            color: "#fff",
            fontWeight: "bold",
            fontFamily: "Rubik, sans-serif", // Font for button
            px: 4,
            py: 1.2,
            "&:hover": {
              backgroundColor: COLORS.primaryHover,
            },
            "&.Mui-disabled": {
              backgroundColor: "#cfcfcf",
              color: "#ffffff",
            },
          }}
        >
          {loading ? "יוצר משחק..." : "קבל/י קוד משחק"}
        </Button>
      </Stack>
    </Paper>
  );
};

CreateGame.propTypes = {
  onBack: PropTypes.func.isRequired,
  onGameCreated: PropTypes.func.isRequired,
};

export default CreateGame;