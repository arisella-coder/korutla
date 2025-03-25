import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NavBarComponent from "../components/NavBarComponent";
import SideBarComponent from "../components/SideBarComponent";
import { Outlet } from "react-router-dom";

const theme = createTheme({
  spacing: 2,
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: "Inter",
  },
});

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Outer container: full viewport height, column layout */}
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* NavBar at the top (row) */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <NavBarComponent handleDrawerToggle={handleDrawerToggle} />
        </Box>

        {/* Main area: sidebar + content in a row, no scrolling here */}
        <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Sidebar for md+ screens */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: 240, // or any fixed width
              borderRight: "1px solid #ccc",
            }}
          >
            <SideBarComponent />
          </Box>

          {/* Drawer for xs/sm screens */}
          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{ display: { md: "none" } }}
          >
            <SideBarComponent />
          </Drawer>

          {/* Scrollable content area */}
          <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;
