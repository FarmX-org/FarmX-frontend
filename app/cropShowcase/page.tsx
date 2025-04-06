'use client';
import React, { useEffect } from "react";
import { Cards } from "../../components/Cards";
import Sidebar from "@/components/Sidebar";

import {
  Box,
  Flex,
  SimpleGrid,
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import { MdAdd } from 'react-icons/md';

interface Crop {
  imageSrc: string;
  title: string;
  description: string;
  price: number;
  harvestDate: string;
  quantity: number;
  available: boolean;
}

const CropShowcase = () => {
  const cropsData: Crop[] = [
    { imageSrc: "./images/Tomato.png", title: "Wheat", description: "High-quality wheat for bread and other uses.", price: 50, harvestDate: "2025-04-01", quantity: 100, available: true },
    { imageSrc: "./images/Tomato.png", title: "Tomatoes", description: "Fresh, organic tomatoes grown locally.", price: 30, harvestDate: "2025-03-20", quantity: 50, available: true },
    { imageSrc: "./images/Tomato.png", title: "Carrots", description: "Crisp and fresh carrots for all your meals.", price: 20, harvestDate: "2025-03-15", quantity: 0, available: false },
  ];

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
  

  return (
    <Flex>
      <Sidebar />

      <Box bg="white" minHeight="100vh" padding="20px" flex="1">
        <Button
          colorScheme="green"
          color="white"
          variant="solid"
          mt={20}
          _hover={{ bg: "#00802b", transform: "scale(1.05)" }}
          _active={{ bg: "#00802b" }}
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
      <FormControl mb={3}>
        <FormLabel>Crop Name</FormLabel>
        <Input placeholder="e.g. Tomatoes" />
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Description</FormLabel>
        <Input placeholder="Brief description of the crop" />
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Price ($)</FormLabel>
        <Input type="number" placeholder="e.g. 25" />
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Harvest Date</FormLabel>
        <Input type="date" />
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Quantity (Kg)</FormLabel>
        <Input type="number" placeholder="e.g. 100" />
      </FormControl>
    </ModalBody>

    <ModalFooter>
      <Button colorScheme="green" mr={3}>
        Save
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>


        <SimpleGrid columns={[1, 2, 3, 4]} gap={5} mt={10}>
          {cropsData.map((card, index) => (
            <Cards
              key={index}
              imageSrc={card.imageSrc}
              title={card.title}
              description={card.description}
              price={card.price}
              harvestDate={card.harvestDate}
              Quntity={card.quantity}
              available={card.available}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default CropShowcase;
