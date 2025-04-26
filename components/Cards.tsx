'use client';
import React, { useState } from "react";
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

const flipSound = "/sounds/flip.wav";
const addToCartSound = "/sounds/Add.mp3";
const ratingSound = "/sounds/rating.mp3"; // ملف صوت للتقييم (اختياري)

const MotionBox = motion(Box);

interface CardProps {
  id: number;
  imageSrc: string;
  title: string;
  description?: string;
  price: number;
  available: boolean;
  quantity?: number;
  harvestDate?: string;
  variant: 'product' | 'crop';
  onAddToCart?: (id: number, quantity: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

export const Cards = ({
  id,
  imageSrc,
  title,
  description,
  price,
  available,
  quantity,
  harvestDate,
  variant,
  onAddToCart,
  onDelete,
  onEdit
}: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const responsiveWidth = useBreakpointValue({ base: "90%", md: "260px" });
  const responsiveMarginTop = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const [playFlip] = useSound(flipSound);
  const [playAddToCart] = useSound(addToCartSound);
  const [playRating] = useSound(ratingSound); // صوت عند التقييم
  const [selectedQty, setSelectedQty] = useState(1);
  const [rating, setRating] = useState(0);
  const toast = useToast();

  const handleAdd = () => {
    if (onAddToCart) onAddToCart(id, 1);
    playAddToCart();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    playFlip();
  };

  const handleRating = (star: number) => {
    setRating(star);
    playRating(); // يشغل الصوت لما يقيم
    toast({
      title: `Thank you for rating ${star}/5! 🌟`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

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
        animate={{
          rotateY: isFlipped ? 180 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >

        {/* الوجه الأمامي */}
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

            {/* النجوم التفاعلية */}
            {variant === 'product' && (
              <Flex justify="center" mt={2}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconButton
                    key={star}
                    aria-label={`Rate ${star}`}
                    icon={star <= rating ? <MdStar color="#f2f745" size={23} /> : <MdStarBorder color="#f2f745" size={23} />}
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRating(star);
                    }}
                    size="sm"
                    _hover={{ transform: "scale(1.2)" }}
                  />
                ))}
              </Flex>
            )}

          </Stack>
        </Box>

        {/* الوجه الخلفي */}
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
          {variant === 'crop' && (
            <Stack spacing={2} mt={6}>
              <Text fontSize="xl" fontWeight="bold" color="green.700" textAlign="center">
                {title}
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                {description}
              </Text>

              <Flex justify="space-between">
                <Text fontSize="sm" color="gray.600"><b>{harvestDate}</b></Text>
                <Text fontSize="sm" color="gray.600"><b>{quantity} Kg</b></Text>
              </Flex>

              <Progress
                value={quantity || 0}
                max={100}
                size="sm"
                colorScheme={available ? "green" : "red"}
                borderRadius="md"
              />

              <Text fontSize="md" fontWeight="bold" color="teal.600">
                💰 {price}$
              </Text>
            </Stack>
          )}

          {variant === 'product' && (
            <Stack spacing={3} mt={4}>
              <Text fontSize="xl" fontWeight="bold" color="green.700" textAlign="center">
                {title}
              </Text>

              <Stack spacing={1} fontSize="sm" color="gray.600" textAlign="center">
                <Text><b>Weight:</b> 500g</Text>
                <Text><b>Origin:</b> Palestine</Text>
                <Text><b>Storage:</b> Keep refrigerated</Text>
              </Stack>

              <Flex gap={2} justify="center">
                <Badge colorScheme="purple">Organic</Badge>
              </Flex>

              <Text fontSize="xs" color="gray.500" textAlign="center">
                ⭐ Rated {rating || 4.2}/5 by 120 users
              </Text>

              <Flex align="center" gap={2} justify="center">
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
              </Flex>

              <Flex justify="center">
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
              </Flex>

              <Text fontSize="md" fontWeight="bold" color="teal.600" textAlign="center">
                💰 {price}$
              </Text>
            </Stack>
          )}

          {variant === 'crop' && (
            <Flex justify="center" gap={4} pt={4}>
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
                      console.log(`Sending ${title} to the store`);
                    }}
                  >
                    Send
                  </Button>
                </Tooltip>
              )}
            </Flex>
          )}
        </Box>
      </MotionBox>
    </Box>
  );
};
