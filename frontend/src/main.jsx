import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import "@fontsource/inter";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00B4DB'
    }
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3} autoHideDuration={4000} anchorOrigin={{ horizontal: "center", vertical: "bottom" }}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </SnackbarProvider>
  </React.StrictMode>
)
