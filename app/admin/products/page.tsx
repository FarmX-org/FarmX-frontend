"use client";

import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  useToast,
  Spinner,
  Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ProductModal from "@/components/ProductModal";
import { apiRequest } from "@/lib/api";

type Product = {
  id: number;
  cropName: string;
  quantity: number;
  unit: string;
  price: number;
  available: boolean;
  description: string;
  imageUrl: string;
  category: string;
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/products");
      setProducts(data);
    } catch (err: any) {
      toast({ status: "error", description: err.message || "Failed to fetch products " });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedProduct: Product) => {
    try {
      await apiRequest(`/products/${updatedProduct.id}`, "PUT", updatedProduct);
      toast({ status: "success", description: "Updated successfully " });
      onClose();
      fetchProducts();
    } catch (err: any) {
      toast({ status: "error", description: err.message || "Failed to update " });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiRequest(`/products/${id}`, "DELETE");
      toast({ status: "info", description: "Deleted successfully" });
      fetchProducts();
    } catch (err: any) {
      toast({ status: "error", description: err.message || "Failed to delete " });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box p={5} mt={20} >
      <Text fontSize="2xl" fontWeight="bold" mb={4} color={"green.600"}>
        Products Management 
      </Text>

      {loading ? (
        <Spinner />
      ) : (
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Crop</Th>
              <Th>Quantity</Th>
              <Th>Price</Th>
              <Th>Availability</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((prod) => (
              <Tr key={prod.id}>
                <Td>{prod.cropName}</Td>
                <Td>{prod.quantity} {prod.unit}</Td>
                <Td>${prod.price.toFixed(2)}</Td>
                <Td>{prod.available ? "✅" : "❌"}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="green"
                    mr={2}
                    onClick={() => {
                      setSelected(prod);
                      onOpen();
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => handleDelete(prod.id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {selected && (
        <ProductModal
          isOpen={isOpen}
          onClose={() => {
            setSelected(null);
            onClose();
          }}
          onSubmit={handleUpdate}
          initialData={selected}
        />
      )}
    </Box>
  );
}
