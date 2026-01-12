import { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SecurityIcon from "@mui/icons-material/Security";
import SchoolIcon from "@mui/icons-material/School";

const heroImage = "/images/besafepic.jpg"; // public/images/besafepic.jpg

function Feature({ Icon, title, text }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        textAlign: "center",
        color: "#0E2A2A",
        px: 1,
      }}
    >
      <Icon sx={{ fontSize: 40, mb: 1 }} />
      <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
        {text}
      </Typography>
    </Box>
  );
}

export default function HomePage() {
  // ✅ בלי לשנות App/Header ובלי לחשב גובה:
  // הופכים זמנית את #root ל-flex column בגובה מסך, כדי שהעמוד יתחלק: Header למעלה + HomePage למטה
  useEffect(() => {
    const root = document.getElementById("root");
    const html = document.documentElement;
    const body = document.body;

    const prev = {
      rootDisplay: root?.style.display,
      rootFlexDirection: root?.style.flexDirection,
      rootHeight: root?.style.height,
      rootOverflow: root?.style.overflow,
      bodyMargin: body.style.margin,
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverflowX: html.style.overflowX,
      bodyOverflowX: body.style.overflowX,
    };

    if (root) {
      root.style.display = "flex";
      root.style.flexDirection = "column";
      root.style.height = "100vh";
      root.style.overflow = "hidden";
    }

    body.style.margin = "0";
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overflowX = "hidden";
    body.style.overflowX = "hidden";

    return () => {
      if (root) {
        root.style.display = prev.rootDisplay || "";
        root.style.flexDirection = prev.rootFlexDirection || "";
        root.style.height = prev.rootHeight || "";
        root.style.overflow = prev.rootOverflow || "";
      }
      body.style.margin = prev.bodyMargin || "";
      html.style.overflow = prev.htmlOverflow || "";
      body.style.overflow = prev.bodyOverflow || "";
      html.style.overflowX = prev.htmlOverflowX || "";
      body.style.overflowX = prev.bodyOverflowX || "";
    };
  }, []);

  return (
    <Box
      dir="rtl"
      sx={{
        flex: 1, // ✅ תופס את כל מה שנשאר מתחת ל-header
        minHeight: 0,
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#F4F7ED",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HERO (כחול על כל הרוחב) */}
      <Box
        sx={{
          flex: "0 0 66%",
          minHeight: 0,
          width: "100%",
          backgroundColor: "#89b7c5ff",
          display: "flex",
          alignItems: "center",
          px: { xs: 2, md: 6 },
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: { xs: 2, md: 4 },
            overflow: "hidden",
          }}
        >
          {/* תמונה - קצת קטנה יותר + רדיוס גדול */}
          <Box
            sx={{
              flex: "0 0 50%",
              minWidth: 0,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt="BeSafe"
              sx={{
                width: "100%",
                maxHeight: "84%", // ✅ טיפה קטן יותר
                objectFit: "contain", // ✅ תמונה שלמה
                borderRadius: 8, // ✅ יותר עגול
                display: "block",
              }}
            />
          </Box>

          <Box
            sx={{
              flex: "0 0 50%", // ✅ אותו רוחב כמו התמונה
              minWidth: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 1.4,
              px: 3, // ריווח פנימי – לא משפיע על הרוחב
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: "clamp(2rem, 2.6vw, 3rem)",
                lineHeight: 1.12,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              המרחב הדיגיטלי שלכם
              <br />
              בטוח, חכם ומבוסס חוויה
            </Typography>

            <Typography
              sx={{
                fontSize: "clamp(1.2rem, 1.2vw, 1.25rem)",
                lineHeight: 1.75,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              לומדים להתמודד עם סיטואציות אמיתיות ברשת – פרטיות, שיימינג, פייק ,
              ניוז ובריונות. מתרגלים קבלת החלטות, מקבלים פידבק חכם.
            </Typography>

            {/* כפתור כניסה - מרובע + רווח בין האייקון לטקסט */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{
                  backgroundColor: "#2E6E65",
                  px: 4,
                  py: 1.2,
                  borderRadius: 1, // מרובע
                  fontWeight: 800,
                  fontSize: "1rem",
                  "& .MuiButton-startIcon": {
                    marginLeft: 1, // ✅ רווח (RTL)
                    marginRight: 0,
                  },
                  "&:hover": { backgroundColor: "#255E56" },
                }}
              >
                כניסה
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FEATURES - על כל הרוחב, בלי רקע נוסף */}
      <Box
        sx={{
          flex: "1 1 auto",
          minHeight: 0,
          width: "100%",
          backgroundColor: "#F4F7ED",
          display: "flex",
          alignItems: "center",
          px: { xs: 2, md: 6 },
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            gap: { xs: 1, md: 3 },
          }}
        >
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
