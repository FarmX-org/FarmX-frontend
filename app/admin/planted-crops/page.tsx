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
import { FiTrash2, FiEdit, FiPlus } from "react-icons/fi";
import CropModal from "@/components/CropModal";

type PlantedCropDTO = {
  id: number;
  name: string;
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

type BaseCrop = {
  id: number;
  name: string;
  category: string;
};

export default function AdminPlantedCropsDashboard() {
  const [farmCrops, setFarmCrops] = useState<FarmCropsDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<PlantedCropDTO | null>(null);
  const [allCrops, setAllCrops] = useState<BaseCrop[]>([]);
  const toast = useToast();

  const fetchPlantedCrops = async () => {
    try {
      setLoading(true);
      const plantedCropsData = await apiRequest("/planted-crops/by-farmer", "GET");
      const cropsList = await apiRequest("/crops", "GET");
      setAllCrops(cropsList);

      const cropMap = new Map<number, string>();
      cropsList.forEach((crop: BaseCrop) => {
        cropMap.set(crop.id, crop.name);
      });

      const merged: FarmCropsDTO[] = plantedCropsData.map((farm: any) => ({
        farmId: farm.farmId,
        farmName: farm.farmName,
        plantedCrops: farm.plantedCrops.map((crop: any) => ({
          ...crop,
          name: cropMap.get(crop.cropId) || "Unknown Crop",
        })),
      }));

      setFarmCrops(merged);
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

  const handleEdit = (crop: PlantedCropDTO) => {
    setSelectedCrop(crop);
    setModalOpen(true);
  };

  const handleSaveCrop = async (cropData: any) => {
    try {
      if (cropData.id) {
        await apiRequest(`/planted-crops/${cropData.id}`, "PUT", cropData);
        toast({ title: "Crop updated successfully", status: "success" });
      } else {
        await apiRequest(`/planted-crops`, "POST", cropData);
        toast({ title: "Crop added successfully", status: "success" });
      }
      fetchPlantedCrops();
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message,
        status: "error",
      });
    }
  };

  useEffect(() => {
    fetchPlantedCrops();
  }, []);

  const exportFarmCropsToCSV = (farm: FarmCropsDTO) => {
  const headers = [
    "Crop Name",
    "Planted Date",
    "Estimated Harvest Date",
    "Actual Harvest Date",
    "Quantity",
    "Status",
    "Notes",
    "Available"
  ];

  const rows = farm.plantedCrops.map((crop) => [
    crop.name,
    crop.plantedDate,
    crop.estimatedHarvestDate,
    crop.actualHarvestDate || "",
    crop.quantity,
    crop.status,
    crop.notes,
    crop.available ? "Yes" : "No"
  ]);

  const csvContent =
    [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${farm.farmName.replace(/\s+/g, "_")}_crops.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


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
        ) : farmCrops.length === 0 ? (
          <Box mt={10} textAlign="center">
            No planted crops found.
          </Box>
        ) : (
          farmCrops.map((farm) => (
            <Box key={farm.farmId} mb={10}>
              <Heading size="md" mb={4} color="green.500">
                {farm.farmName}
              </Heading>
              <Button
  size="sm"
  colorScheme="green"
  variant="outline"
  mb={3}
  onClick={() => exportFarmCropsToCSV(farm)}
>
  Export Crops to CSV
</Button>

              <Box borderRadius="lg" overflow="hidden" boxShadow="md" bg="white">
                <Table variant="simple">
                  <Thead bg="green.500">
                    <Tr>
                      <Th color="white">Name</Th>
                      <Th color="white">Planted Date</Th>
                      <Th color="white">Harvest (Est./Actual)</Th>
                      <Th color="white">Quantity</Th>
                      <Th color="white">Status</Th>
                      <Th color="white">Notes</Th>
                      <Th color="white">Available</Th>
                      <Th color="white">Image</Th>
                      <Th color="white">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {farm.plantedCrops.map((crop) => (
                      <Tr key={crop.id} _hover={{ bg: "green.50" }}>
                        <Td>{crop.name}</Td>
                        <Td>{crop.plantedDate}</Td>
                        <Td>
                          {crop.estimatedHarvestDate}
                          {crop.actualHarvestDate ? ` / ${crop.actualHarvestDate}` : ""}
                        </Td>
                        <Td>{crop.quantity}</Td>
                        <Td>{crop.status}</Td>
                        <Td>{crop.notes}</Td>
                        <Td>{crop.available ? "Yes" : "No"}</Td>
                        <Td>
                          {crop.imageUrl ? (
                            <Image
                              src={crop.imageUrl}
                              alt="crop"
                              boxSize="50px"
                              objectFit="cover"
                              borderRadius="md"
                            />
                          ) : (
                            "-"
                          )}
                        </Td>
                        <Td>
                          <HStack>
                            <Button
                              size="sm"
                              onClick={() => handleDelete(crop.id)}
                              colorScheme="green"
                              leftIcon={<FiTrash2 />}
                            >
                              Delete
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="green"
                              leftIcon={<FiEdit />}
                              onClick={() => handleEdit(crop)}
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
      </Box>

      <CropModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedCrop={selectedCrop}
        onSave={handleSaveCrop}
        allCrops={allCrops}
      />
    </Box>
  );
}
