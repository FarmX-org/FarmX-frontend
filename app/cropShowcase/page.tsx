'use client';
import React, { useEffect, useState } from "react";
import { Cards } from "../../components/Cards";
import Sidebar from "@/components/Sidebar";
import { keyframes } from "@emotion/react";
import { Image } from "@chakra-ui/react";
import {
  Box, Flex, SimpleGrid, Button, useToast, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Input, FormControl, FormLabel,
  Select, Grid, GridItem
} from "@chakra-ui/react";
import { MdAdd } from 'react-icons/md';

interface Crop {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  price: number;
  harvestDate: string;
  quantity: number;
  available: boolean;
  category: string;
}

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const peekaboo = keyframes`
  0%, 100% { transform: translateY(100%) scale(0.8); opacity: 0.5; }
  40%, 60% { transform: translateY(-20px) scale(1); opacity: 1; }
`;

const CropShowcase = () => {
  const [cropsData, setCropsData] = useState<Crop[]>([
    { id: 1, imageUrl: "./images/Tomato.png", name: "Wheat", description: "High-quality wheat", price: 50, harvestDate: "2025-04-01", quantity: 100, available: true, category: "Grains" },
    { id: 2, imageUrl: "./images/Tomato.png", name: "Tomatoes", description: "Fresh, organic tomatoes", price: 30, harvestDate: "2025-03-20", quantity: 50, available: true, category: "Vegetables" },
    { id: 3, imageUrl: "./images/Tomato.png", name: "Carrots", description: "Crisp and fresh carrots", price: 20, harvestDate: "2025-03-15", quantity: 0, available: false, category: "Vegetables" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCactus, setShowCactus] = useState(false);

  const [newCrop, setNewCrop] = useState<Omit<Crop, 'id'>>({
    name: '',
    description: '',
    price: 0,
    harvestDate: '',
    quantity: 0,
    available: true,
    category: '',
    imageUrl: './images/Tomato.png'
  });

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    toast({
      title: "Welcome back, Farmer 👨‍🌾",
      description: "You can manage your crops or add a new one from here.",
      status: "info",
      duration: 5000,
      isClosable: true,
      position: "top-right",
      colorScheme: "green",
    });
  }, []);

  const filteredCrops = cropsData.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? crop.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  const handleAddCrop = () => {
    if (!newCrop.name || !newCrop.description || !newCrop.harvestDate || !newCrop.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before saving.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newCrop.price <= 0 || newCrop.quantity <= 0) {
      toast({
        title: "Invalid Numbers",
        description: "Price and quantity must be greater than 0.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newId = cropsData.length + 1;
    const cropToAdd: Crop = { id: newId, ...newCrop };
    setCropsData(prev => [...prev, cropToAdd]);
    setShowCactus(true);
    setTimeout(() => setShowCactus(false), 3000);
    onClose();
    toast({
      title: "Crop added!",
      description: "New crop has been added successfully 🌱",
      status: "success",
      duration: 1000,
      isClosable: true,
    });

    // Reset form
    setNewCrop({
      name: '',
      description: '',
      price: 0,
      harvestDate: '',
      quantity: 0,
      available: true,
      category: '',
      imageUrl: './images/default.png'
    });
  };

  return (
    <Flex>
      <Sidebar
        onSearchChange={setSearchTerm}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
        onResetFilters={handleResetFilters}
      />
    

      <Box bg="white" minHeight="100vh" padding="20px" flex="1">
        <Button
          colorScheme="green"
          color="white"
          variant="solid"
          mt={20}
          position="absolute"
          right="30px"
          top="30px"
          _hover={{ bg: "#00802b", transform: "scale(1.05)" }}
          leftIcon={<MdAdd />}
          onClick={onOpen}
        >
          Add Crop
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Crop</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Crop Name</FormLabel>
                    <Input
                      value={newCrop.name}
                      onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                      placeholder="e.g. Tomatoes"
                    />
                  </FormControl>
                </GridItem>

                <FormControl>
                  <FormLabel>Price ($)</FormLabel>
                  <Input
                    type="number"
                    value={newCrop.price}
                    onChange={(e) => setNewCrop({ ...newCrop, price: Number(e.target.value) })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Quantity (Kg)</FormLabel>
                  <Input
                    type="number"
                    value={newCrop.quantity}
                    onChange={(e) => setNewCrop({ ...newCrop, quantity: Number(e.target.value) })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Harvest Date</FormLabel>
                  <Input
                    type="date"
                    value={newCrop.harvestDate}
                    onChange={(e) => setNewCrop({ ...newCrop, harvestDate: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    placeholder="Select category"
                    value={newCrop.category}
                    onChange={(e) => setNewCrop({ ...newCrop, category: e.target.value })}
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Herbs">Herbs</option>
                  </Select>
                </FormControl>

                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input
                      value={newCrop.description}
                      onChange={(e) => setNewCrop({ ...newCrop, description: e.target.value })}
                      placeholder="Brief description of the crop"
                    />
                  </FormControl>
                </GridItem>

                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Upload Image</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (!file.type.startsWith("image/")) {
                            toast({
                              title: "Invalid File Type",
                              description: "Please upload an image file only.",
                              status: "error",
                              duration: 3000,
                              isClosable: true,
                            });
                            return;
                          }
                          const url = URL.createObjectURL(file);
                          setNewCrop({ ...newCrop, imageUrl: url });
                        }
                      }}
                    />
                  </FormControl>

                  {newCrop.imageUrl && (
                    <Box mt={3} textAlign="center">
                      <Image
                        src={newCrop.imageUrl}
                        alt="Preview"
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                        mx="auto"
                        border="2px solid #ccc"
                      />
                      <Box fontSize="sm" color="gray.500" mt={1}>Image Preview</Box>
                    </Box>
                  )}
                </GridItem>
              </Grid>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="green" mr={3} onClick={handleAddCrop}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={1} mt={10}>
          {filteredCrops.map((card, index) => (
            <Cards
              key={index}
              imageSrc={card.imageUrl}
              title={card.name}
              description={card.description}
              price={card.price}
              harvestDate={card.harvestDate}
              Quantity={card.quantity}
              available={card.available}
            />
          ))}
        </SimpleGrid>
      </Box>

      <Image
  src="./images/cuteTree.png"
  alt="Jumping Crop"
  position="fixed"
  bottom={{ base: "10px", sm: "20px", md: "30px", lg: "0px" }}
  right={{ base: "10px", sm: "20px", md: "50px", lg: "0px" }}
  boxSize={{ base: "90px", sm: "120px", md: "150px", lg: "180px" }}
  animation={`${bounce} 3s infinite`}
  zIndex={100}
/>


      {showCactus && (
        <Image
          src="./images/cuteFlower.png"
          alt="Peekaboo Cactus"
          position="fixed"
          bottom="-30px"
          left="650px"
          boxSize="200px"
          zIndex={100}
          animation={`${peekaboo} 8s ease-in-out`}
          pointerEvents="none"
        />
      )}
    </Flex>
  );
};

export default CropShowcase;
