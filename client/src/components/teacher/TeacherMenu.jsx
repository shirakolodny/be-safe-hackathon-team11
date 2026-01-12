import PropTypes from "prop-types";
// MUI Imports
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
// Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AssessmentIcon from "@mui/icons-material/Assessment";

const TeacherMenu = ({ onNavigate }) => {
  // A helper function to create the card style
  const cardStyle = {
    p: 5,
    width: { xs: "100%", sm: 300 }, // Fixed width
    minHeight: 280, // Fixed height
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderRadius: 4,
    transition: "all 0.3s ease",
    fontFamily: "Rubik, sans-serif",

    // Standard border
    border: "1px solid transparent",

    // Hover effect
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 12px 32px rgba(46,110,101,0.2)",
      borderColor: "#2E6E65",
    },

    // Focus state
    "&:focus-visible": {
      outline: "none",
      borderColor: "#2E6E65",
      boxShadow: "0 0 0 3px rgba(46,110,101,0.35)",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row", // Force items to be in a row
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        flexWrap: "wrap", // Allow wrapping on small screens
        gap: 6, // Increased gap for better separation (48px)
        width: "100%",
        minHeight: "60vh", // ADDED: Takes up vertical space to center items vertically
      }}
    >
      {/* Option 1: Create New Game */}
      <Paper elevation={4} sx={cardStyle} onClick={() => onNavigate("create")}>
        <AddCircleOutlineIcon sx={{ fontSize: 70, color: "#2E6E65" }} />
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ fontFamily: "Rubik, sans-serif", textAlign: "center" }}
        >
          פתיחת משחק חדש
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ fontFamily: "Rubik, sans-serif" }}
        >
          בחירת נושא/ים להתמקדות וקבלת קוד משחק
        </Typography>
      </Paper>

      {/* Option 2: View Stats */}
      <Paper elevation={4} sx={cardStyle} onClick={() => onNavigate("stats")}>
        <AssessmentIcon sx={{ fontSize: 70, color: "#2E6E65" }} />
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ fontFamily: "Rubik, sans-serif", textAlign: "center" }}
        >
          כניסה למשחק קיים
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ fontFamily: "Rubik, sans-serif" }}
        >
          צפייה בסטטיסטיקות של משחק פעיל
        </Typography>
      </Paper>
    </Box>
  );
};

TeacherMenu.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

export default TeacherMenu;