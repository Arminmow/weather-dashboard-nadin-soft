import { Box, Typography } from "@mui/material";
import { Login } from "./Login";

export function LoginPage() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#F3FAFE">
      <Login>
        {/* Login Section */}
        <Box
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            bgcolor: "white",
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
    </Box>
  );
}
