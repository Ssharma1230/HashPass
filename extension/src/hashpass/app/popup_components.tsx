import React from 'react'; 
import { createRoot } from 'react-dom/client';
import Site_LogIn from './site_login_popup/site_login_component';
import Site_SignUp from './site_signup_popup/site_signup_component';

// Original popup styling: a fixed popup flush to the right side
const popupWrapperStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    right: '0', // flush to the right edge
    transform: 'translateY(-50%)',
    width: '300px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px 0 0 8px', // only round the left corners
    boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.15)',
    zIndex: 10000,
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };
  
  // Style for the close (X) button at the top right of the popup
  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer'
  };
  
  export function renderSiteLogIn(container: HTMLElement) {
    // Function to remove the popup container from the DOM when closing
    const handleClose = () => {
      container.remove();
    };
  
    const root = createRoot(container);
    root.render(
      <div style={popupWrapperStyle}>
        <button style={closeButtonStyle} onClick={handleClose}>×</button>
        <Site_LogIn />
      </div>
    );
  }
  
  export function renderSiteSignUp(container: HTMLElement) {
    const handleClose = () => {
      container.remove();
    };
  
    const root = createRoot(container);
    root.render(
      <div style={popupWrapperStyle}>
        <button style={closeButtonStyle} onClick={handleClose}>×</button>
        <Site_SignUp />
      </div>
    );
  }