import React from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2"; // v7 (or v6)
import UilReceipt from "@iconscout/react-unicons/icons/uil-receipt";
import UilBox from "@iconscout/react-unicons/icons/uil-box";
import UilTruck from "@iconscout/react-unicons/icons/uil-truck";
import UilCheckCircle from "@iconscout/react-unicons/icons/uil-check-circle";
import InfoCard from "../../subComponents/InfoCard";
import TotalSales from "../home/TotalSales";
import SalesByCity from "../home/SalesByCity";
import Channels from "../home/Channels";
import TopSellingProduct from "../home/TopSellingProduct";

const Home = () => {
  const data = {};
  const cardComponent = [
    { icon: <UilBox size={60} color="#F6F4EB" />, title: "Picked", subTitle: "1256" },
    { icon: <UilTruck size={60} color="#F6F4EB" />, title: "Shipped", subTitle: "12" },
    { icon: <UilCheckCircle size={60} color="#F6F4EB" />, title: "Delivered", subTitle: "15" },
    { icon: <UilReceipt size={60} color="#F6F4EB" />, title: "Invoice", subTitle: "07" },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2} sx={{ mx: 3, borderRadius: 2 }}>
        {cardComponent.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoCard card={card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mx: 3, mt: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <TotalSales data={data} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SalesByCity data={data} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ m: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Channels />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TopSellingProduct />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
