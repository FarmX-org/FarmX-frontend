'use client';
import React, { useEffect, useState } from "react";
import { Cards } from "../../components/Cards";
import Sidebar from "@/components/Sidebar";
import { keyframes } from "@emotion/react";
import { Image } from "@chakra-ui/react";
import {
  Box, Flex, SimpleGrid, Button, useToast, useDisclosure,
} from "@chakra-ui/react";
import { MdAdd } from 'react-icons/md';
import { apiRequest } from "@/lib/api";
import CropModal from "../../components/CropModal";
import Lottie from "lottie-react";
import farmGif from "../../public/images/farm.json";
import flowerGif from "../../public/images/flower.json";
import { FaChartBar } from 'react-icons/fa';
import { useRouter } from "next/navigation";


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
  farmId?: number;
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
  const [cropsData, setCropsData] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCactus, setShowCactus] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstFarmId = React.useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const data = await apiRequest("/crops", "GET");
        setCropsData(data);
        if (data.length > 0) {
          firstFarmId.current = data[0].farmId;
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Error loading crops",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();

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

  const handleAddCrop = async (crop: Crop) => {
    try {
      const { id, ...cropWithoutId } = crop;
      const cropToSend = { ...cropWithoutId, farmId: crop.farmId ?? firstFarmId.current };
      const addedCrop = await apiRequest("/crops", "POST", cropToSend);
      setCropsData((prev) => [...prev, addedCrop]);
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
    } catch (err) {
      console.error(err);
      toast({
        title: "Error adding crop",
        description: "Something went wrong while adding the crop.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateCrop = async (crop: Crop) => {
    try {
      const updatedCrop = await apiRequest(`/crops/${crop.id}`, "PUT", crop);
      setCropsData((prev) =>
        prev.map((c) => (c.id === crop.id ? updatedCrop : c))
      );
      onClose();
      toast({
        title: "Crop updated!",
        description: "Crop updated successfully 🌾",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSelectedCrop(null);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error updating crop",
        description: "Something went wrong while updating the crop.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiRequest(`/crops/${id}`, "DELETE");
      setCropsData(prev => prev.filter(crop => crop.id !== id));
      toast({
        title: "Crop deleted!",
        description: "The crop was successfully removed.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error deleting crop",
        description: "Something went wrong while deleting the crop.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex>
     <Sidebar
  onSearchChange={setSearchTerm}
  onCategorySelect={setSelectedCategory}
  selectedCategory={selectedCategory}
  onResetFilters={handleResetFilters}
  showCropActions={true} 
  onAddCrop={onOpen}      
  onViewReport={() => router.push("/productionReport")} 
/>

      <Box bgColor={"#FFFFFF"} minHeight="100vh" padding="20px" flex="1">

        
        <CropModal
          isOpen={isOpen}
          onClose={onClose}
          selectedCrop={selectedCrop}
          onSave={(crop) => {
            if (selectedCrop) {
              handleUpdateCrop(crop);
            } else {
              handleAddCrop(crop);
            }
          }}
        />

  <Box
  position={"relative"}
  top={{ base: "10px", md: "20px", lg: "40px" }}
  right={{ base: "10px", md: "20px", lg: "-70px" }}
  width={{ base: "120px", md: "150px", lg: "900px" }} 
  marginBottom={{ base: "0px", md: "0px", lg: "150px" }}

  zIndex={100}
>
  <Lottie 
    animationData={farmGif}
    loop={true}
    style={{ width: "100%", height: "auto",zIndex: -1 }}

    
  />
</Box>


        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={1} mt={10}>
          {filteredCrops.map((card) => (
            <Cards
              key={card.id}
              id={card.id}
              imageSrc={card.imageUrl}
              title={card.name}
              description={card.description}
              price={card.price}
              harvestDate={card.harvestDate}
              variant="crop"
              quantity ={card.quantity}
              available={card.available}
              onDelete={handleDelete}
              onEdit={() => {
                setSelectedCrop(card);
                onOpen();
              }}
            />
          ))}
        </SimpleGrid>
      </Box>
      <Box
  position="fixed"
  bottom={{ base: "10px", md: "20px", lg: "0px" }}
  right={{ base: "0px", md: "20px", lg: "0px" }}
  width={{ base: "120px", md: "150px", lg: "300px" }} 

  zIndex={100}
>
  <Lottie 
    animationData={flowerGif}
    loop={true}
    style={{ width: "100%", height: "auto" }}

    
  />
 
</Box>


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
