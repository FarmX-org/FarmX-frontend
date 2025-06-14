'use client';
import React, { useEffect, useState } from "react";
import { Cards } from "@/components/Cards";
import Sidebar from "@/components/Sidebar";
import { keyframes } from "@emotion/react";
import { Image, Box, Flex, SimpleGrid, useToast, useDisclosure } from "@chakra-ui/react";
import { apiRequest } from "@/lib/api";
import CropModal from "@/components/CropModal";
import SendToStoreModal from "@/components/SendToStoreModal";
import farmGif from "../../public/images/farm.json";
import flowerGif from "../../public/images/flower.json";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});
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

const peekaboo = keyframes`
  0%, 100% { transform: translateY(100%) scale(0.8); opacity: 0.5; }
  40%, 60% { transform: translateY(-20px) scale(1); opacity: 1; }
`;

const AllCropsShowcase = () => {
  const [cropsData, setCropsData] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCactus, setShowCactus] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [allCrops, setAllCrops] = useState<BaseCrop[]>([]);
  const [farmList, setFarmList] = useState<{ id: number; name: string }[]>([]);
const [isSendModalOpen, setIsSendModalOpen] = useState(false);
const [selectedCropToSend, setSelectedCropToSend] = useState<Crop | null>(null);
const [cropPage, setCropPage] = useState(1);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
const handleOpenSendModal = (crop: Crop) => {
  setSelectedCropToSend(crop);
  setIsSendModalOpen(true);
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCropPage(0);
        const plantedFarms = await apiRequest("/planted-crops/by-farmer", "GET");
        const cropsList = await apiRequest("/crops", "GET");
        setAllCrops(cropsList);
        const merged = plantedFarms.flatMap((farm: any) =>
          farm.plantedCrops.map((planted: any) => {
            const cropDetails = cropsList.find((c: BaseCrop) => c.id === planted.cropId);
            return {
              ...planted,
              farmId: farm.farmId,
              name: cropDetails?.name || "Unknown",
              category: cropDetails?.category || "Uncategorized",
            };
          })
        );

        setCropsData(merged);
        toast({
          title: "All Crops Loaded",
          description: "Successfully loaded all crops from all farms.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
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
  }, [toast]);

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
      title: "updated successfully",
      description: `Updated crop quantity   (${oldCrop.name}) to ${newQuantity}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    console.error("Error updating crop quantity:", error);
    toast({
      title: "Error updating quantity",
      description: "Failed to update crop quantity.",
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
    const { id, name, category, ...rest } = crop;
    const cropToSend = {
      ...rest,
      cropId: crop.cropId,
    };

    const updatedCrop = await apiRequest(`/planted-crops/${crop.id}`, "PUT", cropToSend);

    const updatedWithNames: Crop = {
      ...updatedCrop,
      name,
      category,
    };

    setCropsData((prev) =>
      prev.map((c) => (c.id === crop.id ? updatedWithNames : c))
    );

    onClose();
    setSelectedCrop(null);

    toast({
      title: "Crop updated! 🌾",
      description: "Crop updated successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
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
      setCropsData((prev) => prev.filter((crop) => crop.id !== id));
      toast({
        title: "Crop deleted!",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error deleting crop",
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
        onViewReport={() => router.push("/productionReport")}
        cropPage={cropPage}
      />
      

      <Box bgColor="#FFFFFF" minHeight="100vh" padding="20px" flex="1">
        <CropModal
          isOpen={isOpen}
          onClose={onClose}
          selectedCrop={selectedCrop}
          onSave={(crop) => {
            if (selectedCrop) {
              handleUpdateCrop(crop);
            }
          }}
          allCrops={allCrops}
        />

        <Box
          position="relative"
          top={{ base: "10px", md: "20px", lg: "40px" }}
          right={{ base: "10px", md: "20px", lg: "-70px" }}
          width={{ base: "120px", md: "150px", lg: "900px" }}
          marginBottom={{ base: "0px", md: "0px", lg: "150px" }}
          zIndex={100}
        >
          <Lottie animationData={farmGif} loop style={{ width: "100%", height: "auto" }} />
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={1} mt={10}>
          {filteredCrops.map((card) => (
            <Cards
              key={card.id}
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
              category={card.category}
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
        <Lottie animationData={flowerGif} loop style={{ width: "100%", height: "auto" }} />
      </Box>

      {showCactus && (
        <Image
          src="/images/cuteFlower.png"
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

export default AllCropsShowcase;
