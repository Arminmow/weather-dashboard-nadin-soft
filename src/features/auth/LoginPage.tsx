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
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              width: "386px",
              height: "355px",
            }}
          >
            <Box sx={{ textAlign: "center", width: "100%" }}>
              <Typography variant="h4" fontWeight="bold" mb={4}>
                Log in
              </Typography>

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
