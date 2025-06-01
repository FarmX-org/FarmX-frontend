"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Spinner,
  HStack,
  Image,
} from "@chakra-ui/react";
import { apiRequest } from "@/lib/api";
import { FiTrash2, FiEdit } from "react-icons/fi";


type PlantedCropDTO = {
  id: number;
  cropId: number;
  farmId: number;
  plantedDate: string;
  estimatedHarvestDate: string;
  actualHarvestDate: string | null;
  quantity: number;
  available: boolean;
  notes: string;
  status: string;
  imageUrl: string;
};

type FarmCropsDTO = {
  farmId: number;
  farmName: string;
  plantedCrops: PlantedCropDTO[];
};

export default function AdminPlantedCropsDashboard() {
  const [farmCrops, setFarmCrops] = useState<FarmCropsDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchPlantedCrops = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/planted-crops/by-farmer", "GET");
      setFarmCrops(data);
    } catch (error: any) {
      toast({
        title: "Failed to fetch planted crops",
        description: error.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  


  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this planted crop?")) return;

    try {
      await apiRequest(`/planted-crops/${id}`, "DELETE");
      toast({ title: "Planted crop deleted", status: "info" });
      fetchPlantedCrops();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        status: "error",
      });
    }
  };

  useEffect(() => {
    fetchPlantedCrops();
  }, []);

  return (
    <Box p={6} mt={20}>
      <Box mt={10} bg="gray.50" minH="100vh">
        <Flex mb={6} alignItems="center">
          <Heading size="lg" color="green.600">
            Planted Crops Management
          </Heading>
          <Spacer />
        </Flex>

        {loading ? (
          <Flex justify="center" mt={10}>
            <Spinner size="xl" />
          </Flex>
        ) : (
          <>
            {farmCrops.length === 0 ? (
              <Box mt={10} textAlign="center">
                No planted crops found.
              </Box>
            ) : (
              farmCrops.map((farm) => (
                <Box key={farm.farmId} mb={10}>
                  <HStack mb={4} justify="space-between">
                  <Heading size="md" mb={4} color="green.500">
                    {farm.farmName}
                  </Heading>
                   <Button
                    colorScheme="green"
                    mb={4}
                    onClick={() => {
                      
                    }}
                    >
                    Add Crop
                  </Button>
                  </HStack>
                 
                  <Box borderRadius="lg" overflow="hidden" boxShadow="md" bg="white">
                    <Table variant="simple">
                      <Thead bg="green.500">
                        <Tr>
                          <Th color="white">ID</Th>
                          <Th color="white">Planted Date</Th>
                          <Th color="white">Harvest (Est./Actual)</Th>
                          <Th color="white">Quantity</Th>
                          <Th color="white">Status</Th>
                          <Th color="white">Available</Th>
                          <Th color="white">Image</Th>
                          <Th color="white">Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {farm.plantedCrops.map((crop) => (
                          <Tr key={crop.id} _hover={{ bg: "green.50" }}>
                            <Td>{crop.id}</Td>
                            <Td>{crop.plantedDate}</Td>
                            <Td>
                              {crop.estimatedHarvestDate}
                              {crop.actualHarvestDate ? ` / ${crop.actualHarvestDate}` : ""}
                            </Td>
                            <Td>{crop.quantity}</Td>
                            <Td>{crop.status}</Td>
                            <Td>{crop.available ? "Yes" : "No"}</Td>
                            <Td>
                              {crop.imageUrl ? (
                                <Image src={crop.imageUrl} alt="crop" boxSize="50px" objectFit="cover" borderRadius="md" />
                              ) : (
                                "-"
                              )}
                            </Td>
                            <Td>
                              <HStack>
                                <Button
                                  size="sm"
                                  onClick={() => handleDelete(crop.id)}
                                  colorScheme="red"
                                  leftIcon={<FiTrash2 />}
                                >
                                  Delete
                                </Button>
                                <Button 
                                size="sm"
                                 colorScheme="green"
                                 leftIcon={<FiEdit />}
                                 >
                                  Edit
                                </Button>

                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              ))
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
