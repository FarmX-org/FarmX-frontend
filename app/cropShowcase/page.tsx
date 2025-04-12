'use client';
import React, { useEffect,useState  } from "react";
import { Cards } from "../../components/Cards";
import Sidebar from "@/components/Sidebar";
import { keyframes } from "@emotion/react";
import { Image } from "@chakra-ui/react";


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
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
`;
const peekaboo = keyframes`
  0%, 100% { transform: translateY(100%); opacity: 0.5; }
  40% { transform: translateY(-20px); opacity: 1; }
  60% { transform: translateY(-20px); opacity: 1; }
`;

const CropShowcase = () => {
  
  const [cropsData, setCropsData] = useState<Crop[]>([]);
  const [showCactus, setShowCactus] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8081/crops")
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data)) {
          setCropsData(data);
        } else {
          console.error("Invalid data format", data);
        }
      })
      .catch((err) => console.error("Error fetching crops:", err));
  }, []);
  
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");


  const filteredCrops = cropsData.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? crop.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };
  

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
      <Image
    src="./images/farmer.png"
    alt="Peekaboo Cactus"
    position="fixed"
    top="80px"
    left="0px"
    boxSize="150px"
    zIndex={2}
  />
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
      <Button colorScheme="green" mr={3}
      onClick={() => {
        onOpen();
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
      }}
      >
        Save
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>


        <SimpleGrid columns={[1, 2, 3, 4]} gap={5} mt={10}>
        {filteredCrops.map((card, index) => (
  <Cards
    key={index}
    imageSrc={card.imageUrl}
    title={card.name}
    description={card.description}
    price={card.price}
    harvestDate={card.harvestDate}
    Quntity={card.quantity}
    available={card.available}
  />
))}

        </SimpleGrid>
      </Box>
      <Image
      src="./images/cuteTree.png"
      alt="Jumping Crop"
      position="fixed"
      bottom="20px"
      right="20px"
      boxSize="250px"
      animation={`${bounce} 1.5s infinite`}
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
