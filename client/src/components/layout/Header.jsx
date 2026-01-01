// We don't need PropTypes here because this component doesn't receive props
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import logo from '../../assets/logo.png'; 

const Header = () => {
  return (
    // AppBar: The main container bar
    <AppBar position="static" sx={{ backgroundColor: '#2c3e50' }}>
      
      {/* Toolbar: Aligns items horizontally and adds padding */}
      <Toolbar sx={{ justifyContent: 'center', gap: 2 }}>
        
        {/* Logo Image wrapped in a Box for easy styling */}
        <Box 
          component="img" 
          src={logo} 
          alt="BeSafe Logo" 
          sx={{ 
            height: 50, 
            borderRadius: 1 
          }} 
        />

        {/* Title Text */}
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Viral Decision - BeSafe
        </Typography>

      </Toolbar>
    </AppBar>
  );
};

export default Header;