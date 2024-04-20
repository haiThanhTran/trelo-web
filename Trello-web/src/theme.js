import { createTheme, hexToRgb } from "@mui/material/styles";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { deepOrange, teal, orange, cyan } from "@mui/material/colors";

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: "58px",
    boardBarHeight: "60px",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange,
      },
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange,
      },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdc3c7",
            borderRadius: "8px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#6ab04c",
            borderRadius: "8px",
          },
        },
      },
    },
    // Name of the component
    MuiInputLabel: {
      styleOverrides: {
        // Name of the slot
        root: ({ theme }) => ({
          // Some CSS
          color: theme.palette.primary.main,
          fontSize: "0.875rem",
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // Name of the slot
        root: ({ theme }) => {
          // Some CSS
          return {
            color: theme.palette.primary.main,
            fontSize: "0.875rem",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.light,
            },
            "&:hover": {
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
            },
          };
        },
      },
    },
  },
});

export default theme;
