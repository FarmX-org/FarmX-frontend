"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Stack,
  Spinner,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  Heading,
  Select,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import { apiRequest } from "@/lib/api";

type OrderItemDTO = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  productName: string;
};

type FarmOrderDTO = {
  id: number;
  farmId: number;
  farmName: string;
  orderStatus: string;
  deliveryTime: string;
  items: OrderItemDTO[];
};

type OrderDTO = {
  id: number;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
  deliveryCode?: string;
  deliveryCodeExpiresAt?: string;
  farmOrders: FarmOrderDTO[];
};

const statusColors: Record<string, string> = {
  PENDING: "gray",
  PROCESSING: "blue",
  READY: "orange",
  DELIVERED: "green",
  CANCELED: "red",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDTO[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiRequest("/orders/admin");
        setOrders(data);
        setFilteredOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === "ALL") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((o) => o.orderStatus === statusFilter)
      );
    }
  }, [statusFilter, orders]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" mt={6}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  const exportOrdersToCSV = (orders: OrderDTO[]) => {
  const headers = [
    "Order ID",
    "Order Status",
    "Created At",
    "Total Amount",
    "Farm Name",
    "Farm Order Status",
    "Delivery Time",
    "Product Name",
    "Quantity",
    "Price",
  ];

  const rows: string[][] = [];

  orders.forEach((order) => {
    order.farmOrders.forEach((farmOrder) => {
      farmOrder.items.forEach((item) => {
        rows.push([
          order.id.toString(),
          order.orderStatus,
          new Date(order.createdAt).toLocaleString(),
          order.totalAmount.toFixed(2),
          farmOrder.farmName,
          farmOrder.orderStatus,
          farmOrder.deliveryTime
            ? new Date(farmOrder.deliveryTime).toLocaleString()
            : "Not Set",
          item.productName,
          item.quantity.toString(),
          item.price.toFixed(2),
        ]);
      });
    });
  });

  const csvContent =
    [headers, ...rows]
      .map((e) =>
        e.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "orders_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6} mt={10} wrap="wrap" gap={4}>
  <Heading size="lg">Orders Overview</Heading>
  <Flex gap={3}>
    <Select
      maxW="200px"
      variant="filled"
      bg="gray.100"
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="ALL">All Statuses</option>
      <option value="PENDING">Pending</option>
      <option value="READY">Ready</option>
      <option value="DELIVERED">Delivered</option>
    </Select>
    <Button
      px={4}
      py={2}
      colorScheme="green"
      borderRadius="md"
      variant={"outline"}
      _hover={{ bg: "green.100" }}
      onClick={() => exportOrdersToCSV(filteredOrders)}
    >
      Export CSV
    </Button>
  </Flex>
</Flex>


      <SimpleGrid spacing={6} columns={{ base: 1, md: 2 }}>
        {filteredOrders.map((order) => (
          <Box
            key={order.id}
            bg="white"
            borderRadius="2xl"
            p={5}
            boxShadow="lg"
            transition="0.2s"
            _hover={{ boxShadow: "xl", transform: "scale(1.01)" }}
          >
            <Flex justify="space-between" align="center" mb={3}>
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  Order #{order.id}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(order.createdAt).toLocaleString()}
                </Text>
              </Box>
              <Badge colorScheme={statusColors[order.orderStatus]}>
                {order.orderStatus}
              </Badge>
            </Flex>

            <Divider my={2} />

            <Stack spacing={4}>
              {order.farmOrders.map((farmOrder) => (
                <Box
                  key={farmOrder.id}
                  bg="gray.50"
                  borderRadius="lg"
                  p={3}
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Flex justify="space-between" mb={1}>
                    <Text fontWeight="medium">{farmOrder.farmName}</Text>
                    <Badge colorScheme={statusColors[farmOrder.orderStatus]}>
                      {farmOrder.orderStatus}
                    </Badge>
                  </Flex>
                  <Text fontSize="sm" color="gray.500">
                    Delivery:{" "}
                    {farmOrder.deliveryTime
                      ? new Date(farmOrder.deliveryTime).toLocaleString()
                      : "Not Set"}
                  </Text>

                  <Stack mt={2} spacing={1}>
                    {farmOrder.items.map((item) => (
                      <Flex
                        key={item.id}
                        justify="space-between"
                        fontSize="sm"
                        color="gray.700"
                      >
                        <Text>{item.productName}</Text>
                        <Text>
                          {item.quantity} x {item.price.toFixed(2)} JD
                        </Text>
                      </Flex>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>

            <Divider my={3} />
            <Text textAlign="right" fontWeight="medium">
              Total: {order.totalAmount.toFixed(2)} JD
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
