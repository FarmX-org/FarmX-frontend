'use client';

import React from "react";
import {
  Box,
  Image,
  Text,
  Progress,
  Button,
  Tooltip,
  Badge,
  Flex,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { MdEdit, MdDelete, MdLocalShipping } from 'react-icons/md';
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface CardsProps {
  imageSrc: string;
  title: string;
  description: string;
  price: number;
  harvestDate: string;
  Quantity: number;
  available: boolean;
}

export const Cards = ({
  imageSrc,
  title,
  description,
  price,
  harvestDate,
  Quantity,
  available,
}: CardsProps) => {
  const responsiveMarginTop = useBreakpointValue({ base: 6, md: 10, lg: 24 });

  return (
    <MotionBox
      maxW="xs"
      borderWidth="1px"
      borderRadius="2xl"
      overflow="hidden"
      mt={responsiveMarginTop}
      px={4}
      pb={5}
      boxShadow="lg"
      transition={{ duration: 0.3, ease: "easeInOut" }} 
      _hover={{ transform: "scale(1.03)", boxShadow: "2xl" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      position="relative"
      bg="rgb(241, 245, 241)"


    >
      <Badge
        position="absolute"
        top={3}
        left={3}
        px={3}
        py={1}
        borderRadius="full"
        colorScheme={available ? "green" : "red"}
        fontSize="0.7em"
      >
        {available ? "Available" : "Out of Stock"}
      </Badge>

      <Flex justify="center" mt={4}>
        <Image
          src={imageSrc}
          alt={title}
          boxSize="120px"
          objectFit="cover"
          borderRadius="full"
          border="4px solid white"
          boxShadow="md"
        />
      </Flex>

      <Box pt={4}>
        <Stack spacing={1}>
          <Text fontSize="xl" fontWeight="bold" color="green.700" textAlign="center">
            {title}
          </Text>

          <Text fontSize="sm" color="gray.600" textAlign="center">
            {description}
          </Text>

          <Flex justify="space-between" mt={2}>
            <Text fontSize="sm" color="gray.600">
               <b>{harvestDate}</b>
            </Text>
            <Text fontSize="sm" color="gray.600">
               <b>{Quantity} Kg</b>
            </Text>
          </Flex>

          <Progress
            value={Quantity}
            max={100}
            size="sm"
            colorScheme={available ? "green" : "red"}
            borderRadius="md"
            mt={1}
          />

          <Text fontSize="md" fontWeight="bold" color="teal.600" mt={1}>
            💰 {price}$
          </Text>
        </Stack>
      </Box>

      <Flex justify="center" gap={4} pt={4}>
        <Tooltip label="Delete Crop" hasArrow>
          <Button
            size="sm"
            color="red.500"
            variant="ghost"
            _hover={{ bg: "red.50", transform: "scale(1.1)" }}
            leftIcon={<MdDelete />}
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
      onClick={() => {
        console.log(`Sending ${title} to the store`);
      }}
    >
      Send to Store
    </Button>
  </Tooltip>
  
  )}
      </Flex>
    </MotionBox>
  );
};
