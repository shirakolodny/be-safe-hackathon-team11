import { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; // ייבוא הניווט
import { Box, Typography, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SecurityIcon from "@mui/icons-material/Security";
import SchoolIcon from "@mui/icons-material/School";

const heroImage = "/images/besafepic.png";
Feature.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

function Feature({ Icon, title, text }) {
  return (
    <Box sx={{ flex: 1, textAlign: "center", color: "#0E2A2A", px: 1 }}>
      <Icon sx={{ fontSize: 42, mb: 1.5 }} />
      <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", mb: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
        {text}
      </Typography>
    </Box>
  );
}

export default function HomePage() {
  const navigate = useNavigate(); // אתחול הניווט

  useEffect(() => {
    const root = document.getElementById("root");
    const html = document.documentElement;
    const body = document.body;

    if (root) {
      root.style.display = "flex";
      root.style.flexDirection = "column";
      root.style.height = "100vh";
      root.style.overflow = "hidden";
    }
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      if (root) {
        root.style.display = "";
        root.style.flexDirection = "";
        root.style.height = "";
      }
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, []);

  return (
    <Box
      dir="rtl"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F4F7ED",
        overflow: "hidden",
      }}
    >
      {/* HERO SECTION */}
      <Box
        sx={{
          flex: "0 0 72%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#89b7c5ff",
          px: { xs: 4, md: 10 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "85%",
            alignItems: "stretch",
            gap: 10,
          }}
        >
          {/* תמונה בצד ימין - גדולה יותר (55%) */}
          <Box
            sx={{
              flex: "0 0 55%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt="BeSafe"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 12,
                filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.15))",
              }}
            />
          </Box>

          {/* טקסט בצד שמאל */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              py: 2,
            }}
          >
            {/* כותרת - הוקטנה */}
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: "clamp(1.8rem, 2.4vw, 2.8rem)",
                lineHeight: 1.2,
                color: "#0E2A2A",
              }}
            >
              המרחב הדיגיטלי שלכם
              <br />
              בטוח, חכם ומבוסס חוויה
            </Typography>

            {/* תיאור - הוגדל משמעותית */}
            <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  fontSize: "clamp(1.3rem, 1.6vw, 1.8rem)",
                  lineHeight: 1.6,
                  fontWeight: 500,
                  color: "rgba(14, 42, 42, 0.9)",
                }}
              >
                לומדים להתמודד עם סיטואציות אמיתיות ברשת – פרטיות, שיימינג, פייק
                ניוז ובריונות. מתרגלים קבלת החלטות ומקבלים פידבק חכם בזמן אמת.
              </Typography>
            </Box>

            {/* כפתור כניסה עם ניווט */}
            <Box>
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={() => navigate("/login")} // מעבר לדף לוגין
                sx={{
                  backgroundColor: "#2B3752", // הצבע שציינת
                  px: 6,
                  py: 2,
                  borderRadius: 1.5,
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  "& .MuiButton-startIcon": { ml: 2, mr: 0 },
                  "&:hover": {
                    backgroundColor: "#232d44ff",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s",
                }}
              >
                כניסה למערכת
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FEATURES SECTION */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          px: { xs: 4, md: 12 },
          backgroundColor: "#F4F7ED",
        }}
      >
        <Box sx={{ width: "100%", display: "flex", gap: 6 }}>
          <Feature
            Icon={PsychologyIcon}
            title="פידבק חכם"
            text="הכוונה מותאמת אישית לפי הבחירות שלכם."
          />
          <Feature
            Icon={SecurityIcon}
            title="כלים אמיתיים"
            text="התמודדות בטוחה עם מצבים ברשת."
          />
          <Feature
            Icon={SchoolIcon}
            title="למידה חווייתית"
            text="תרגול דרך סיטואציות אמיתיות."
          />
        </Box>
      </Box>
    </Box>
  );
}
