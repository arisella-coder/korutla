//components/bodyComponents/inventory/Overview.jsx
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";

export default function Overview() {
  const { total, onlineCount, offlineCount, loading, error } = useSelector(
    (state) => state.products
  );

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Total Products</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  {loading ? "Loading..." : error ? "Error" : total}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Products Online</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                {loading ? "Loading..." : onlineCount}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Products Offline</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                {loading ? "Loading..." : offlineCount}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Today sell</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  5241
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Yesterday sell</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  3652
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Total sell</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  11425
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Product Reserved</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  6547
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Stock Issues</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  9562
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
