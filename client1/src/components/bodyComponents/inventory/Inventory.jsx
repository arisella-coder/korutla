import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Products from "./Products";
import Overview from "./Overview";

const Inventory = () => {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.default", pl: 5, pr: 5 }}>
      <Grid container>
        <Grid size={{ md: 9 }}>
          <Box sx={{ bgcolor: "white", borderRadius: 2, height: "100%" }}>
            <Typography variant="h5" sx={{ m: 3, fontWeight: "bold" }}>
              Inventory
            </Typography>
            <Products />
          </Box>
        </Grid>
        <Grid size={{ md: 3 }}>
          <Box
            sx={{
              margin: 3,
              bgcolor: "white",
              borderRadius: 2,
              padding: 3,
              height: "100%",
            }}
          >
            <Typography variant="h5" sx={{ m: 3, fontWeight: "bold" }}>
              Overview
            </Typography>
            <Overview />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Inventory;