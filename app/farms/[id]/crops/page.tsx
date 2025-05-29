'use client';
import React, { useEffect, useState } from "react";
import { Cards } from "@/components/Cards"; 
import Sidebar from "@/components/Sidebar";
import { keyframes } from "@emotion/react";
import { Image, Box, Flex, SimpleGrid, useToast, useDisclosure } from "@chakra-ui/react";
import { MdAdd } from 'react-icons/md';
import { apiRequest } from "@/lib/api";
import CropModal from "@/components/CropModal";
import Lottie from "lottie-react";
import farmGif from "../../../../public/images/farm.json";
import flowerGif from "../../../../public/images/flower.json";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import SendToStoreModal from "@/components/SendToStoreModal";


interface BaseCrop {
  id: number;
  name: string;
  category: string;

}

interface Crop extends BaseCrop {
  imageUrl: string;
  quantity: number;
  available: boolean;
  farmId?: number;
  plantedDate?: string;
  estimatedHarvestDate?: string;
  actualHarvestDate?: string;
  notes?: string;
  status?: string;
  cropId: number;
  allCrops: BaseCrop[];

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
const [allCrops, setAllCrops] = useState<BaseCrop[]>([]);
const [isSendModalOpen, setIsSendModalOpen] = useState(false);
const [selectedCropToSend, setSelectedCropToSend] = useState<Crop | null>(null);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const params = useParams();
const farmId = params?.id ? parseInt(params.id as string) : null;
const handleOpenSendModal = (crop: Crop) => {
  setSelectedCropToSend(crop);
  setIsSendModalOpen(true);
};
useEffect(() => {
  if (!farmId) return;

  const fetchData = async () => {
    try {
      const plantedCrops = await apiRequest(`/planted-crops/farm/${farmId}`, "GET");
      const cropsList = await apiRequest("/crops", "GET");
      setAllCrops(cropsList);
      const merged = plantedCrops.map((planted: any) => {
        const cropDetails = cropsList.find((c: BaseCrop) => c.id === planted.cropId);
        console.log("cropId:", planted.cropId);
        return {
          ...planted,
          name: cropDetails?.name || "Unknown",
          category: cropDetails?.category || "Uncategorized",
        };
      });

      setCropsData(merged);

      toast({
        title: "Welcome back, Farmer 👨‍🌾",
        description: "You can manage your crops or add a new one from here.",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        colorScheme: "green",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error loading data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [farmId, toast]);

  const filteredCrops = cropsData.filter((crop) => {
  const name = crop?.name ?? "";
  const category = crop?.category ?? "";
  const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = selectedCategory ? category === selectedCategory : true;
  return matchesSearch && matchesCategory;
});

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  const handleAddCrop = async (crop: Crop) => {
  try {
    const { id: plantedId, cropId, name, category, ...rest } = crop;

    const cropToSend = {
      ...rest,
      farmId: crop.farmId ?? farmId,
      cropId: cropId, 
    };

   if (!crop.cropId) {
  throw new Error("Missing cropId!");
}

    console.log("Sending cropToSend:", cropToSend);

    const addedCrop = await apiRequest("/planted-crops", "POST", cropToSend);

    const newCrop: Crop = {
      ...addedCrop,
      name,
      category,
    };

    setCropsData((prev) => [...prev, newCrop]);
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
const handleQuantityUpdate = async (newQuantity: number, cropId: number) => {
  try {
    const oldCrop = cropsData.find((c) => c.id === cropId);
    if (!oldCrop) return;

    const updated = await apiRequest(`/planted-crops/${cropId}`, "PUT", {
      quantity: newQuantity,
      imageUrl: oldCrop.imageUrl,
      name: oldCrop.name,
      available: oldCrop.available,
      notes: oldCrop.notes,
      status: oldCrop.status,
    });

    setCropsData((prev) =>
      prev.map((crop) =>
        crop.id === cropId
          ? {
              ...updated, 
            }
          : crop
      )
    );

    toast({
      title: "Updated successfully ",
      description: `Updated crop quantity (${oldCrop.name}) to ${newQuantity}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    console.error("Error updating crop quantity:", error);
    toast({
      title: "Error updating quantity",
      description: "Something went wrong while updating the crop quantity.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};


 const handleSendToStore = async (data: {
  name: string;
  category: string;
  quantity: number;
  imageUrl: string;
  description: string;
  plantedCropId: number;
}) => {
  try {
    const originalCrop = cropsData.find(c => c.id === data.plantedCropId);
    if (!originalCrop) throw new Error("Crop not found");

    if (data.quantity > originalCrop.quantity) {
      toast({
        title: "Invalid quantity",
        description: `You only have ${originalCrop.quantity} units.`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

await apiRequest("/api/products", "POST", {
  ...data,
  available: true
});

    const remainingQuantity = originalCrop.quantity - data.quantity;

    await handleQuantityUpdate(remainingQuantity, data.plantedCropId);

    toast({
      title: "Sent to store",
      description: "Successfully added to store",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  } catch (err) {
    console.error(err);
    toast({
      title: "Failed to send",
      description: "Error sending to store",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};


  const handleUpdateCrop = async (crop: Crop) => {
  try {
    const { id, cropId, name, category, ...rest } = crop;

    const cropToSend = {
      ...rest,
      cropId,  
      farmId: crop.farmId ?? farmId,
    };

    const updatedCrop = await apiRequest(`/planted-crops/${id}`, "PUT", cropToSend);

    const updatedWithMeta: Crop = {
      ...updatedCrop,
      name,
      category,
    };

    setCropsData((prev) =>
      prev.map((c) => (c.id === id ? updatedWithMeta : c))
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
      await apiRequest(`/planted-crops/${id}`, "DELETE");
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
         farmId={Number(farmId)}
         allCrops={allCrops}
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
            style={{ width: "100%", height: "auto", zIndex: -1 }}
          />
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={1} mt={10}>
          {filteredCrops.map((card) => (
            <Cards
              id={card.id}
  imageSrc={card.imageUrl}
  title={card.name}
  available={card.available}
  quantity={card.quantity}
  plantedDate={card.plantedDate}
  estimatedHarvestDate={card.estimatedHarvestDate}
  actualHarvestDate={card.actualHarvestDate}
  notes={card.notes}
  status={card.status}
  farmId={card.farmId}
  variant="planted"
  onDelete={handleDelete}
  onEdit={() => {
    setSelectedCrop(card);
    onOpen();
              }}

               onSendToStore={() => handleOpenSendModal(card)}
              cropId={card.cropId}

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

       <SendToStoreModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        crop={selectedCropToSend}
        onSend={handleSendToStore}
        onQuantityUpdate={handleQuantityUpdate}
      />
      
    </Flex>
  );
};

export default CropShowcase;
