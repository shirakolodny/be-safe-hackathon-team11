// // We don't need PropTypes here because this component doesn't receive props
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import logo from '../../assets/logo.png'; 

// const Header = () => {
//   return (
//     // AppBar: The main container bar
//     <AppBar position="static" sx={{ backgroundColor: '#2c3e50' }}>
      
//       {/* Toolbar: Aligns items horizontally and adds padding */}
//       <Toolbar sx={{ justifyContent: 'center', gap: 2 }}>
        
//         {/* Logo Image wrapped in a Box for easy styling */}
//         <Box 
//           component="img" 
//           src={logo} 
//           alt="BeSafe Logo" 
//           sx={{ 
//             height: 50, 
//             borderRadius: 1 
//           }} 
//         />

//         {/* Title Text */}
//         <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
//           Viral Decision - BeSafe
//         </Typography>

//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;


import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import logo from "../../assets/logo.png";

const Header = () => {
  // ✅ בדיקה בזמן רינדור (תמיד עדכני)
  const isLoggedIn = Boolean(localStorage.getItem("authUser"));

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("studentSession"); // אם קיים אצלכם

    // חוזר למסך כניסה
    window.location.reload();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#2c3e50" }}>
      <Toolbar sx={{ position: "relative", justifyContent: "center", gap: 2 }}>
        {/* ✅ Logout */}
        {isLoggedIn && (
          <Button
            onClick={handleLogout}
            variant="outlined"
            sx={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
              borderColor: "rgba(255,255,255,0.6)",
              fontWeight: "bold",
              borderRadius: 2,
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            התנתקות
          </Button>
        )}

        <Box
          component="img"
          src={logo}
          alt="BeSafe Logo"
          sx={{ height: 50, borderRadius: 1 }}
        />

        <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
          Viral Decision - BeSafe
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;