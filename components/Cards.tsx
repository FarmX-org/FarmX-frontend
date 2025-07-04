'use client';
import React, { useState, useEffect } from "react";
import {
  Box,
  Image,
  Text,
  Badge,
  Button,
  Flex,
  Stack,
  useBreakpointValue,
  IconButton,
  Progress,
  Tooltip,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,

} from "@chakra-ui/react";
import { MdAddShoppingCart, MdStar, MdStarBorder, MdShoppingCart, MdEdit, MdDelete, MdLocalShipping } from "react-icons/md";
import { motion } from "framer-motion";
import useSound from 'use-sound';
import { apiRequest } from "@/lib/api";



const flipSound = "/sounds/flip.wav";
const addToCartSound = "/sounds/Add.mp3";
const ratingSound = "/sounds/rating.mp3"; 


const MotionBox = motion(Box);

interface CardProps {
  id: number;
  imageSrc: string;
  title: string;
  available: boolean;
  quantity?: number;
  variant: 'product' | 'planted';

  // product فقط
  price?: number;
  description?: string;
  onAddToCart?: (id: number, quantity: number) => void;
  unit?: string; 
  category?: string;
  rating?: number;
  ratingCount?: number;
  

  // planted فقط
  plantedDate?: string;
  estimatedHarvestDate?: string;
  actualHarvestDate?: string;
  notes?: string;
  status?: string;
  farmId?: number;
  cropId?: number;


  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;

   onSendToStore?: (data: {
    name: string;
    category: string;
    quantity: number;
    imageUrl: string;
    description: string;
    plantedCropId: number;
  }) => void;
}

export const Cards = ({
  id,
  imageSrc,
  title,
  description,
  price,
  available,
  quantity,
  variant,
  plantedDate,
  estimatedHarvestDate,
  actualHarvestDate,
  notes,
  status,
  unit,
  cropId,
  category,
  ratingCount,
  rating,
  onAddToCart,
  onDelete,
  onEdit,
  onSendToStore
}: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const responsiveWidth = useBreakpointValue({ base: "90%", md: "260px" });
  const responsiveMarginTop = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const [playFlip] = useSound(flipSound);
  const [playAddToCart] = useSound(addToCartSound);
  const [playRating] = useSound(ratingSound);
  const [selectedQty, setSelectedQty] = useState(1);
  const toast = useToast();
  const [isConsumer, setIsConsumer] = useState(false);

  const handleAdd = () => {
    if (onAddToCart) onAddToCart(id, 1);
    playAddToCart();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    playFlip();
    console.log("rating", rating);
  };

 useEffect(() => {
  if (typeof window !== 'undefined') {
    const roleString = localStorage.getItem('roles');
    if (roleString) {
      try {
        const roles = JSON.parse(roleString);
        setIsConsumer(Array.isArray(roles) && roles.includes('ROLE_CONSUMER'));
      } catch (e) {
        console.error("Failed to parse roles from localStorage", e);
        setIsConsumer(false);
      }
    }
  }
}, []);


  return (
    <Box
      mt={responsiveMarginTop}
      width={responsiveWidth}
      height="340px"
      sx={{ perspective: "1000px" }}
      onClick={() => handleFlip()}
      position="relative"
      _hover={{
        boxShadow: "0 10px 25px rgba(0, 128, 0, 0.2)",
        transform: "scale(1.03)",
        transition: "all 0.3s ease-in-out"
      }}
      transition="all 0.3s ease-in-out"
      cursor="pointer"
    >
      <MotionBox
        position="absolute"
        width="100%"
        height="100%"
        sx={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Front Side */}
        <Box
          position="absolute"
          width="100%"
          height="100%"
          bg="white"
          boxShadow="md"
          borderRadius="2xl"
          overflow="hidden"
          p={4}
          sx={{ backfaceVisibility: "hidden" }}
          border="1px solid #E2E8F0"
        >
          <Badge colorScheme={available ? "green" : "red"} mb={2} borderRadius="full" px={2}>
            {available ? "Available" : "Out of Stock"}
          </Badge>
          <Image
            src={imageSrc}
            alt={title}
            boxSize="180px"
            objectFit="cover"
            mx="auto"
            borderRadius="md"
          />
          <Stack mt={4} spacing={1} textAlign="center">
            <Text fontWeight="bold" fontSize="lg" color="green.700">{title}</Text>
          </Stack>
        </Box>

        {/* Back Side */}
        <Box
          position="absolute"
          width="100%"
          height="100%"
          boxShadow="md"
          borderRadius="2xl"
          overflow="hidden"
          p={4}
          sx={{ backfaceVisibility: "hidden" }}
          transform="rotateY(180deg)"
          border="1px solid #E2E8F0"
          bg={"#FFFFFF"}
        >
          {variant === 'planted' && (
            <Stack spacing={2} mt={4} fontSize="sm" color="gray.700">
              <Text><b>Status:</b> {status}</Text>
              <Text><b>Quantity:</b> {quantity} units</Text>
              <Text><b>Planted Date:</b> {new Date(plantedDate || "").toLocaleDateString()}</Text>
              <Text><b>Estimated Harvest:</b> {estimatedHarvestDate ? new Date(estimatedHarvestDate).toLocaleDateString() : 'N/A'}</Text>
              <Text><b>Actual Harvest:</b> {actualHarvestDate ? new Date(actualHarvestDate).toLocaleDateString() : 'Not yet'}</Text>
              {notes && <Text><b>Notes:</b> {notes}</Text>}

              <Flex justify="center" gap={4} pt={2}>
                <Tooltip label="Delete Crop" hasArrow>
                  <Button
                    size="sm"
                    color="red.500"
                    variant="ghost"
                    _hover={{ bg: "red.50", transform: "scale(1.1)" }}
                    leftIcon={<MdDelete />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete && onDelete(id);
                    }}
                  >
                    Delete
                  </Button>
                </Tooltip>

                <Tooltip label="Edit Crop" hasArrow>
                  <Button
                    size="sm"
                    color="green.600"
                    variant="ghost"
                    _hover={{ bg: "green.50", transform: "scale(1.1)" }}
                    leftIcon={<MdEdit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit && onEdit(id);
                    }}
                  >
                    Edit
                  </Button>
                </Tooltip>
                  {available && (
  <Tooltip label="Send to Store" hasArrow>
    <Button
      size="sm"
      leftIcon={<MdLocalShipping />}
      color="green.600"
      variant="ghost"
      _hover={{ bg: "green.50", transform: "scale(1.1)" }}
    onClick={(e) => {
        e.stopPropagation();
        if (!onSendToStore || cropId === undefined) {
          return;
        }

        const payload = {
          name: title,
          category: category || "General",
          quantity: quantity || 0,
          imageUrl: imageSrc,
          description: notes || "No description",
          plantedCropId: id,
        };
        onSendToStore(payload);
      }}
    >
      send
    </Button>
  </Tooltip>
)}
              </Flex>
            </Stack>
          )}

          {variant === 'product' && (
  <Stack spacing={3} mt={4}>
    <Text fontSize="md" fontWeight="bold" color="green.700" textAlign="center">
      {description || "No description"}
    </Text>

    <Stack spacing={1} fontSize="sm" color="gray.600" textAlign="center">
      {quantity !== undefined && (
        <Text><b>Quantity:</b> {quantity} {unit || "units"}</Text>
      )}
    </Stack>

   <Flex justify="center" align="center" mt={1}>
  {[1, 2, 3, 4, 5].map((i) => (
    <Box key={i} color={i <= Math.round(rating ?? 0) ? "yellow.400" : "gray.300"}>
      {i <= Math.round(rating ?? 0) ? <MdStar /> : <MdStarBorder />}
    </Box>
  ))}

  <Text ml={2} fontSize="sm" color="gray.600">
    {typeof rating === "number" && !isNaN(rating) ? rating.toFixed(1) : "No ratings"}
  </Text>

  {ratingCount !== undefined && (
    <Text ml={1} fontSize="xs" color="gray.500">
      ({ratingCount} ratings)
    </Text>
  )}
</Flex>




    {isConsumer &&<Flex align="center" gap={2} justify="center">
      <Text fontSize="sm">Quantity:</Text>
      <NumberInput
        size="sm"
        maxW={20}
        defaultValue={1}
        min={1}
        onChange={(valueString) => setSelectedQty(Number(valueString))}
      >
        <NumberInputField onClick={(e) => e.stopPropagation()} />
        <NumberInputStepper>
          <NumberIncrementStepper onClick={(e) => e.stopPropagation()} />
          <NumberDecrementStepper onClick={(e) => e.stopPropagation()} />
        </NumberInputStepper>
      </NumberInput>
    </Flex>}

    {isConsumer && <Flex justify="center">
      <Button
        size="sm"
        colorScheme="green"
        leftIcon={<MdAddShoppingCart />}
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart && onAddToCart(id, selectedQty);
          playAddToCart();
        }}
      >
        Add to Cart
      </Button>
    </Flex>}

    {price !== undefined && (
      <Text fontSize="md" fontWeight="bold" color="teal.600" textAlign="center">
        💰 {price}$
      </Text>
    )}
  </Stack>
)}

          
        </Box>
      </MotionBox>
    </Box>
  );
};
