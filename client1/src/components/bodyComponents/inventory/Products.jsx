import { useEffect, useState } from "react";
import Product from "./Product";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  updateProduct,
} from "./../../../redux/features/products/productSlice";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon, Edit as EditIcon } from "@mui/icons-material";
import ProductForm from "./ProductForm";

export default function Products() {
  const dispatch = useDispatch();
  const { products, total, loading, error } = useSelector((state) => state.products);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Local state for search
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: paginationModel.page + 1,  // backend is 1-indexed
        limit: paginationModel.pageSize,
        search: searchTerm,             // pass search term
      })
    );
  }, [dispatch, paginationModel, searchTerm]);

  const handleCreateClose = () => setCreateOpen(false);

  const handleEdit = (product) => {
    setProductToEdit(product);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setProductToEdit(null);
  };

  const handleToggleOnline = (product, newState) => {
    const updatedProduct = { ...product, online: newState };
    dispatch(updateProduct(updatedProduct))
      .unwrap()
      .then(() => {
        console.log(`Product ${product._id} online set to ${newState}`);
      })
      .catch((err) => {
        console.error("Failed to update online status", err);
      });
  };

  // Called when user types in the search field
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Optionally reset pagination to first page
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      width: 50,
      description: "id of the product",
    },
    {
      field: "product",
      headerName: "Product",
      width: 180,
      renderCell: (cellData) => <Product productName={cellData.row.name} />,
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
    },
    {
      field: "subcategory",
      headerName: "Sub-Category",
      width: 100,
    },
    {
      field: "price",
      headerName: "Price",
      width: 80,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 80,
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 80,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      renderCell: (cellData) => (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(cellData.row);
          }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "online",
      headerName: "Online/Offline",
      width: 120,
      renderCell: (cellData) => (
        <Switch
          checked={cellData.row.online}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleToggleOnline(cellData.row, e.target.checked)}
          color="primary"
        />
      ),
    },
  ];

  return (
    <div>
      {/* Create Product Button & Search Field */}
      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          Add Product
        </Button>

        <TextField
          size="small"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 300 }}
        />
      </Box>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* DataGrid Container */}
      <Box sx={{ height: "75vh", width: "100%" }}>
        <DataGrid
          rows={products}
          getRowId={(row) => row._id}
          columns={columns}
          rowCount={total}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
        />
      </Box>

      {/* Dialog for creating a new product */}
      <Dialog open={createOpen} onClose={handleCreateClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Add New Product
          <IconButton
            aria-label="close"
            onClick={handleCreateClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ProductForm mode="create" onSuccess={handleCreateClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for editing an existing product */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Edit Product
          <IconButton
            aria-label="close"
            onClick={handleEditClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {productToEdit ? (
            <ProductForm
              mode="edit"
              initialData={productToEdit}
              onSuccess={handleEditClose}
            />
          ) : (
            <p>Loading...</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
