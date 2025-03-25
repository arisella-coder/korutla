// NavBarComponent.jsx
import {
  Box,
  AppBar,
  Container,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import {
  NotificationsOutlined,
  Settings,
  Logout,
  AccountCircleOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/auth/authSlice";
import MenuIcon from '@mui/icons-material/Menu';

export default function NavBarComponent({ handleDrawerToggle }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);

  const handleAvatarClicked = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClicked = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const notificationHandleClose = () => {
    setNotificationAnchorEl(null);
  };

  const fullName = user ? user.name : "Guest User";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <AppBar position="static" sx={{ width: "100%" }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
            px: 10,
          }}
        >
          {/* Show hamburger button only on xs/sm */}
          <IconButton
            onClick={handleDrawerToggle}
            aria-label="open drawer"
            sx={{
              display: { md: "none" },
              bgcolor: "primary.main", // button color
              color:"white",
              width: 48, // button width
              height: 48, // button height
              "&:hover": {
                bgcolor: "primary.dark", // hover color
              },
            }}
          >
            <MenuIcon sx={{ fontSize: 24 }} />
          </IconButton>
          <Typography
            variant="h6"
            component="a"
            href="/dashboard/home"
            sx={{
              display: { xs: "none", sm: "block" },
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ADIMS
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit" onClick={handleNotificationClicked}>
              <Badge variant="dot" color="error">
                <NotificationsOutlined sx={{ width: 32, height: 32 }} />
              </Badge>
            </IconButton>
            <Menu
              open={notificationOpen}
              anchorEl={notificationAnchorEl}
              onClose={notificationHandleClose}
            >
              <MenuItem>Notification number 1</MenuItem>
              <Divider />
              <MenuItem>Notification number 2</MenuItem>
              <MenuItem>Notification number 3</MenuItem>
            </Menu>
            <IconButton
              onClick={handleAvatarClicked}
              size="small"
              sx={{ mx: 2 }}
            >
              <Tooltip title="Account settings">
                <Avatar sx={{ width: 32, height: 32 }}>{initials}</Avatar>
              </Tooltip>
            </IconButton>
            <Typography
              variant="body1"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {fullName}
            </Typography>
            <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
              <MenuItem>
                <ListItemIcon>
                  <AccountCircleOutlined fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
}
