import PropTypes from 'prop-types';
import MuiButton from '@mui/material/Button'; 

const Button = ({ onClick, children, variant = 'primary', ...props }) => {
  
  // Map custom variants to Material UI props
  let muiVariant = "contained";
  let muiColor = "primary";

  if (variant === 'secondary') {
    muiVariant = "outlined";
    muiColor = "primary";
  } else if (variant === 'success') {
    muiColor = "success";
  } else if (variant === 'danger') {
    muiColor = "error";
  }

  return (
    <MuiButton 
      variant={muiVariant} 
      color={muiColor} 
      onClick={onClick}
      style={{ margin: '5px', fontWeight: 'bold' }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

// Define prop types for validation
Button.propTypes = {
  onClick: PropTypes.func,           // Optional function
  children: PropTypes.node.isRequired, // Content inside button
  variant: PropTypes.string,         // Style variant ('primary', 'secondary', etc.)
};

export default Button;