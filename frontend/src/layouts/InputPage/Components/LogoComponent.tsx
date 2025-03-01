import * as React from "react";
import { Typography, Box } from "@mui/material";

export const LogoComponent: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 3 }}>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "48px", md: "96px" },
          color: "black",
          mb: 1,
          fontWeight: "bold",
        }}
      >
        ECHO
      </Typography>
      <Typography variant="h4" sx={{ color: "black", mb: 1 }}>
        LLM-powered Scribing and Analysis
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.25rem", mt: 2 }}>
        Boost your efficiency and productivity with AI.
      </Typography>
    </Box>
  );
};