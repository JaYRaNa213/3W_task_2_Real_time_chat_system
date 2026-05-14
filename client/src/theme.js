import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7E57C2", // Deep premium purple
      light: "#B085F5",
      dark: "#4D2C91",
    },
    secondary: {
      main: "#00E5FF", // Cyan accent
      light: "#6EFFFF",
      dark: "#00B2CC",
    },
    background: {
      default: "#0A0A0A", // Very deep dark background
      paper: "#121212", // Soft black for cards/surfaces
    },
    text: {
      primary: "#F3F4F6",
      secondary: "#9CA3AF",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
    body1: { fontSize: "1rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.43 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0A0A0A",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.2) transparent",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 6,
            height: 6,
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 8,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 24px",
          transition: "all 0.2s ease-in-out",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #7E57C2 0%, #4D2C91 100%)",
          boxShadow: "0 4px 14px 0 rgba(126, 87, 194, 0.39)",
          "&:hover": {
            background: "linear-gradient(135deg, #8E67D2 0%, #5D3CA1 100%)",
            boxShadow: "0 6px 20px rgba(126, 87, 194, 0.5)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: 12,
            transition: "all 0.2s",
            "& fieldset": {
              borderColor: "rgba(255,255,255,0.1)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255,255,255,0.2)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#7E57C2",
              borderWidth: "1px",
              boxShadow: "0 0 0 4px rgba(126, 87, 194, 0.1)",
            },
          },
        },
      },
    },
  },
});

export default theme;
