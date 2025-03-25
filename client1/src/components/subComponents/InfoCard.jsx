import { Card, Box, CardContent, Typography } from "@mui/material";

export default function InfoCard({ card }) {
  return (
    <Card
      elevation={6}
      sx={{
        borderRadius: 2,
        width: "100%", // Fill the container's width
        m: 1,        // Relative margin for spacing
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
        <Box
          p={1}
          m={2}
          sx={{
            display: "flex",
            bgcolor: "primary.main",
            borderRadius: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {card.icon}
        </Box>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            p: 1,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {card.title}
          </Typography>
          <Typography variant="h5" fontWeight="bolder" color="text.secondary">
            {card.subTitle}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}