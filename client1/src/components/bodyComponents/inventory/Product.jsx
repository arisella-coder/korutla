import { Avatar, Typography, Box } from "@mui/material";
import React from "react";

export default function Product({ productName }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
      <Avatar alt="alt" sx={{ width: 10, height: 10 }}>
        A
      </Avatar>
      <Typography sx={{ ml: 1 }} variant="p">
        {productName}
      </Typography>
    </Box>
  );
}
