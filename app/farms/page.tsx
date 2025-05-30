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
  CardBody,
  Stack,
  Card,
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
import { motion } from "framer-motion";
import { MdDelete, MdEdit } from "react-icons/md";
const MotionCard = motion(Card);


const FarmListPage = () => {
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingFarmId, setDeletingFarmId] = useState<number | null>(null);
  const [soilTypes, setSoilTypes] = useState<Record<number, string>>({});

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

useEffect(() => {
  const fetchLocationAndSoilTypes = async () => {
    const updatedLocations: Record<number, string> = {};
    const updatedSoil: Record<number, string> = {};

    await Promise.all(
      farms.map(async (farm) => {
        const { latitude, longitude, id } = farm;

        if (latitude && longitude) {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            updatedLocations[id] = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          } catch {
            updatedLocations[id] = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          }

          try {
            const soil = await apiRequest(`/soil/type?lat=${latitude}&lon=${longitude}`);
            console.log("soil:", soil);
            updatedSoil[id] = soil; 
          } catch {
            updatedSoil[id] = "Unknown";
          }
        }
      })
    );

    setLocationNames(updatedLocations);
    setSoilTypes(updatedSoil);
  };

  if (farms.length > 0) fetchLocationAndSoilTypes();
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
    <Box
      px={{ base: 6, md: 16 }}
      py={10}
      mt={20}
      bgGradient="linear(to-br, green.50, white)"
      minH="100vh"
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Flex direction="column">
          <Heading size="lg" color="green.700">
            🌾 Your Smart Farms
          </Heading>
          <Text fontSize="sm" color="gray.500">
            Manage and track all your farms with ease.
          </Text>
        </Flex>
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
          {farms.map((farm, i) => (
            <MotionCard
              key={farm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              bg="whiteAlpha.800"
              backdropFilter="blur(10px)"
              boxShadow="lg"
              borderRadius="2xl"
              transitionDuration="0.3s"
              _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
            >
              <CardBody p={4}>
                <Stack spacing={3}>
                  {farm.licenseDocumentUrl && (
                    <Box borderRadius="xl" overflow="hidden" height="180px">
                      <img
                        src={farm.licenseDocumentUrl}
                        alt={`${farm.name} License`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Box>
                  )}

                  <Heading fontSize="xl" color="green.700">
                    {farm.name}
                  </Heading>

                  <Text fontSize="sm" color="gray.600">
                    📍 <strong>Location:</strong> {locationNames[farm.id] || "Loading..."}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    🌱 <strong>Soil Type:</strong> {soilTypes[farm.id] || "Loading..."}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    📏 <strong>Area:</strong> {farm.areaSize} dunum
                  </Text>

                  <Flex gap={2} mt={3} flexWrap="wrap">
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => router.push(`/farms/${farm.id}/crops`)}
                    >
                      View Crops
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="green"
                      onClick={() => handleEditFarm(farm.id)}
                    >
                      <MdEdit />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="green"
                      onClick={() => setDeletingFarmId(farm.id)}
                    >
                      <MdDelete/>
                      Delete
                    </Button>
                  </Flex>
                </Stack>
              </CardBody>
            </MotionCard>
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
