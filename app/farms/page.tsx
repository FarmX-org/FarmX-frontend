"use client";

import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  Flex,
  useToast,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Stack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

const FarmListPage = () => {
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingFarmId, setDeletingFarmId] = useState<number | null>(null);
  const cancelRef = useRef(null);

  const toast = useToast();
  const router = useRouter();
const [locationNames, setLocationNames] = useState<Record<number, string>>({});

  const fetchFarms = async () => {
    try {
      const data = await apiRequest("/farms");
      setFarms(data);
    } catch (error: any) {
      toast({
        title: "Failed to load farms",
        description: error?.message ?? String(error) ?? "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);


  useEffect(() => {
  const fetchLocationNames = async () => {
    const updated: Record<number, string> = {};

    await Promise.all(
      farms.map(async (farm) => {
        const { latitude, longitude, id } = farm;

        if (latitude && longitude) {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            updated[id] = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          } catch {
            updated[id] = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          }
        }
      })
    );

    setLocationNames(updated);
  };

  if (farms.length > 0) fetchLocationNames();
}, [farms]);


  const handleEditFarm = (id: number) => {
    router.push(`/farms/${id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingFarmId) return;
    try {
      await apiRequest(`/farms/${deletingFarmId}`, "DELETE");
      toast({
        title: "Farm deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchFarms();
    } catch (error: any) {
      toast({
        title: "Failed to delete farm",
        description: error?.message ?? String(error) ?? "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeletingFarmId(null);
    }
  };

  return (
    <Box px={{ base: 6, md: 16 }} py={10} mt={20}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="green.700">
          Your Farms
        </Heading>
        <Button colorScheme="green" onClick={() => router.push("/farms/new")}>
          + Add Farm
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" mt={20}>
          <Spinner size="xl" color="green.500" />
        </Flex>
      ) : farms.length === 0 ? (
        <Text>No farms found. Add your first farm!</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {farms.map((farm) => (
  <Card key={farm.id} shadow="md" border="1px solid #ddd">
   
    <CardBody>
      <Stack spacing={2}>
        {farm.licenseDocumentUrl && (
          <Box mb={3} maxH="200px" overflow="hidden" borderRadius="md">
            <img
              src={farm.licenseDocumentUrl}
              alt={`${farm.name} License Document`}
              style={{ width: "100%", objectFit: "cover", borderRadius: "8px" }}
            />
          </Box>
        )}
        
        <Text>🌿 Farm Name: {farm.name}</Text>
        <Text>🌿 Area: {farm.areaSize} dunum</Text>
        <Text>📍 Location: {locationNames[farm.id] || "Loading..."}</Text>


        <Flex gap={3} mt={4} wrap="wrap">
          <Button
            colorScheme="green"
            onClick={() => router.push(`/farms/${farm.id}/crops`)}
          >
            View Crops
          </Button>
          <Button
            colorScheme="green"
            variant="outline"
            onClick={() => handleEditFarm(farm.id)}
          >
            Edit
          </Button>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setDeletingFarmId(farm.id)}
          >
            Delete
          </Button>
        </Flex>
      </Stack>
    </CardBody>
  </Card>
))}

        </SimpleGrid>
      )}

      <AlertDialog
        isOpen={!!deletingFarmId}
        leastDestructiveRef={cancelRef}
        onClose={() => setDeletingFarmId(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Farm</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this farm? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setDeletingFarmId(null)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default FarmListPage;
