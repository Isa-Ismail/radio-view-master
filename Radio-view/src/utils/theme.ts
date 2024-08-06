import { ThemeOptions, createTheme } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff",
      light: "#e0e0e0",
      dark: "#b8b8b8",
    },
    secondary: {
      main: "#ffcc00",
    },
    background: {
      default: "#070707",
      paper: "#0A0B0F",
    },

    success: {
      main: "#297be5",
      light: "#649ae2",
      dark: "#075dd8",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "white",
        },
        contained: {
          backgroundColor: "#539DF3",
          color: "white",
          "&:hover": {
            backgroundColor: "white",
            color: "black",
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        style: {
          borderRadius: "8px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px",
          backgroundColor: "var(--background-paper)",
          elevation: 0,
        },
      },
    },
    MUIDataTableHeadCell: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
          fontSize: 16,
          padding: 8,
          backgroundColor: "var(--background-paper)",
        },
      },
    },

    MUIDataTableFilterList: {
      styleOverrides: {
        root: {
          display: "none",
        },
      },
    },
    MUIDataTableSelectCell: {
      styleOverrides: {
        checkboxRoot: {
          color: "white !important",
          backgroundColor: "var(--background-paper)",
        },
        root: {
          backgroundColor: "var(--background-paper)",
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "white !important",
        },
      },
    },
  },

  typography: {
    fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
  },
};

export const theme = createTheme(themeOptions);
