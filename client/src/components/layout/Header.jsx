import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import logo from "../../assets/logo.png";

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#2c3e50" }}>
      <Toolbar sx={{ position: "relative", justifyContent: "center", gap: 2 }}>
        {/* לוגו - במרכז */}
        <Box
          component="img"
          src={logo}
          alt="BeSafe Logo"
          sx={{ height: 50, borderRadius: 1 }}
        />

        {/* {/כותרת  /} */}
        <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
          Viral Decision - BeSafe
        </Typography>

        {/* כפתור הבית*/}
        <IconButton
          href="/" // כאן תוכלי לשנות את הנתיב בעתיד
          sx={{
            position: "absolute",
            right: 12, // העברנו לצד ימין
            color: "white",
          }}
        >
          <HomeIcon fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
