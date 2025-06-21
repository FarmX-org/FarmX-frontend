"use client";
import React, { useEffect, useState } from "react";
import {
  Box, Button, FormControl, FormLabel, Input, VStack, HStack, Heading,
  Table, Thead, Tbody, Tr, Th, Td, Spacer, Flex, useToast, Spinner,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, useDisclosure, Image
} from "@chakra-ui/react";
import { apiRequest } from "@/lib/api";
import { FiEdit, FiTrash2 } from 'react-icons/fi';

type CropDTO = {
  id?: number;
  name: string;
  category: string;
  season: string;
  description: string;
  averagePrice: number;
  growthDays?: number;
  imageUrl?: string | null;
  preferredRegion?: string | null;
  preferredSoilType?: string | null;
  temperatureSensitivity?: string | null;
  waterNeedLevel?: string | null;
};

export default function AdminCropsDashboard() {
  const [crops, setCrops] = useState<CropDTO[]>([]);
  const [formData, setFormData] = useState<CropDTO>({
    name: "",
    category: "",
    season: "",
    description: "",
    averagePrice: 0,
    growthDays: undefined,
    imageUrl: "",
    preferredRegion: "",
    preferredSoilType: "",
    temperatureSensitivity: "",
    waterNeedLevel: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/crops", "GET");
      console.log(data);
      setCrops(data);
    } catch (error: any) {
      toast({ title: "Failed to fetch crops", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image.", status: "error" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      season: "",
      description: "",
      averagePrice: 0,
      growthDays: undefined,
      imageUrl: "",
      preferredRegion: "",
      preferredSoilType: "",
      temperatureSensitivity: "",
      waterNeedLevel: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    try {
      const endpoint = isEditing ? `/crops/${editingId}` : "/crops";
      const method = isEditing ? "PUT" : "POST";
      await apiRequest(endpoint, method, formData);
      toast({
        title: isEditing ? "Crop updated successfully" : "Crop added successfully",
        status: "success",
      });
      resetForm();
      onClose();
      fetchCrops();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  const handleEdit = (crop: CropDTO) => {
    setFormData({ ...crop });
    setIsEditing(true);
    setEditingId(crop.id ?? null);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    try {
      await apiRequest(`/crops/${id}`, "DELETE");
      toast({ title: "Crop deleted", status: "info" });
      fetchCrops();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, status: "error" });
    }
  };

  return (
    <Box p={6} mt={10}>
      <Flex mb={6} alignItems="center">
        <Heading size="lg" color="green.600">Crop Management</Heading>
        <Spacer />
        <Button colorScheme="green" onClick={() => { resetForm(); onOpen(); }}>Add Crop</Button>
      </Flex>
      {loading ? (
        <Flex justify="center" mt={10}><Spinner size="xl" /></Flex>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg="green.500">
              <Tr>
                <Th color="white">Name</Th>
                <Th color="white">Category</Th>
                <Th color="white">Season</Th>
                <Th color="white">Description</Th>
                <Th color="white">Average Price</Th>
                <Th color="white">Growth Days</Th>
                <Th color="white">Image</Th>
                <Th color="white">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {crops.map((crop) => (
                <Tr key={crop.id}>
                  <Td>{crop.name}</Td>
                  <Td>{crop.category}</Td>
                  <Td>{crop.season}</Td>
                  <Td>{crop.description}</Td>
                  <Td>{crop.averagePrice}</Td>
                  <Td>{crop.growthDays}</Td>
                  <Td>
                    {crop.imageUrl ? (
                      <Image src={crop.imageUrl} boxSize="50px" objectFit="cover" borderRadius="md" />
                    ) : "No Image"}
                  </Td>
                  <Td>
                    <Button size="sm" colorScheme="green" mr={2} onClick={() => handleEdit(crop)}>Edit</Button>
                    <Button size="sm" colorScheme="green" onClick={() => handleDelete(crop.id ?? 0)}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Crop" : "Add Crop"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {[
                "name", "category", "season", "description",
                "averagePrice", "growthDays", "preferredRegion",
                "preferredSoilType", "temperatureSensitivity", "waterNeedLevel"
              ].map(field => (
                <FormControl key={field}>
                  <FormLabel>{field}</FormLabel>
                  <Input
                    name={field}
                    value={(formData as any)[field] ?? ""}
                    onChange={handleChange}
                    type={field === "averagePrice" || field === "growthDays" ? "number" : "text"}
                  />
                </FormControl>
              ))}
              <FormControl>
                <FormLabel>Upload Image</FormLabel>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
              </FormControl>
              {formData.imageUrl && (
                <Image src={formData.imageUrl} alt="Crop Image" boxSize="100px" objectFit="cover" borderRadius="md" />
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => { resetForm(); onClose(); }}>Cancel</Button>
            <Button colorScheme="green" ml={3} onClick={handleSubmit}>
              {isEditing ? "Update" : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
