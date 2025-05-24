import { Box, useTheme } from "@mui/material";
import { Login } from "./Login";
import LanguageSelect from "../i18n/LanguageSelect";

export function LoginPage() {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor={theme.palette.surface.main}
      flexDirection="column"
      gap="50px"
    >
      <Login>
        {/* Login Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: theme.palette.surface.card,
            padding: "60px 0px",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              width: "80%",
              height: "80%",
            }}
          >
            <Box sx={{ textAlign: "center", width: "100%" }}>
              <Login.Title />
              <Login.Input />
            </Box>
            <Login.Button />
          </Box>
        </Box>

        {/* Banner Section */}
        <Box
          sx={{
            display: { xs: "none", sm: "none", md: "none", lg: "flex" },
            flex: 1,
            bgcolor: "#E0F7FA",
          }}
        >
          <Login.Banner />
        </Box>
      </Login>
      <LanguageSelect />
    </Box>
  );
}
