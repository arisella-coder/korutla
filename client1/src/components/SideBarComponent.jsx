import React from "react";
import "../../public/styles/links.css";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Box,
} from "@mui/material";
import {
  HomeOutlined,
  Inventory2Outlined,
  SettingsOutlined,
  DescriptionOutlined,
  MonetizationOnOutlined,
  CardTravelOutlined,
  TrendingUpOutlined,
  PeopleAltOutlined,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const SideBarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname; // e.g. /dashboard/home

  const sideBarComponent = [
    { title: "Home", icon: <HomeOutlined fontSize="medium" color="primary" /> },
    { title: "Inventory", icon: <Inventory2Outlined fontSize="medium" color="primary" /> },
    { title: "Orders", icon: <CardTravelOutlined fontSize="medium" color="primary" /> },
    { title: "Customers", icon: <PeopleAltOutlined fontSize="medium" color="primary" /> },
    { title: "Revenue", icon: <MonetizationOnOutlined fontSize="medium" color="primary" /> },
    { title: "Growth", icon: <TrendingUpOutlined fontSize="medium" color="primary" /> },
    { title: "Reports", icon: <DescriptionOutlined fontSize="medium" color="primary" /> },
    { title: "Settings", icon: <SettingsOutlined fontSize="medium" color="primary" /> },
  ];

  const handleSelectedComponent = (index) => {
    // Navigate to /dashboard/{lowercase title}
    navigate(`/dashboard/${sideBarComponent[index].title.toLowerCase()}`);
  };

  return (
    <List elevtion={8} sx={{ width: "100%", height: "100vh" }}>
      {sideBarComponent.map((comp, index) => (
        <ListItem disablePadding dense key={index}>
          <Box width="100%">
            <ListItemButton
              onClick={() => handleSelectedComponent(index)}
              selected={currentPath === `/dashboard/${comp.title.toLowerCase()}`}
              sx={{
                mb: 3,
                ml: 1,
              }}
            >
              <ListItemIcon>
                <IconButton>{comp.icon}</IconButton>
              </ListItemIcon>
              <ListItemText
                primary={comp.title}
                primaryTypographyProps={{
                  fontSize: "medium",
                  fontWeight: currentPath === `/dashboard/${comp.title.toLowerCase()}` ? "bold" : "normal",
                  color: currentPath === `/dashboard/${comp.title.toLowerCase()}` ? "primary.main" : "inherit",
                }}
              />
            </ListItemButton>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default SideBarComponent;
