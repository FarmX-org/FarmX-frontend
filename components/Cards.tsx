'use client';

import React from "react";
import { Button, Image, Text, Box, Progress, Tooltip } from "@chakra-ui/react";
import { MdEdit, MdDelete } from 'react-icons/md';
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface CardsProps {
  imageSrc: string;
  title: string;
  description: string;
  price: number;
  harvestDate: string;
  Quntity: number;
  available: boolean;
}

export const Cards = ({
  imageSrc,
  title,
  description,
  price,
  harvestDate,
  Quntity,
  available,
}: CardsProps) => {
  return (
    <MotionBox
      maxW="xs"
      maxH="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bgColor="white"
      mt="5"
      boxShadow="lg"
      transition="all 0.3s duration-.4s"
      _hover={{ transform: "scale(1.05)", boxShadow: "xl" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Image
        src={imageSrc}
        alt={title}
        maxW="80%"
        height="auto"
        maxH={{ base: "130px", md: "150px", lg: "180px" }}
        objectFit="contain"
        mx="auto"
        display="block"
      />

      <Box p="4">
        <Text fontWeight="bold" fontSize="md" color="gray.700">
          {description}
        </Text>

        <Text fontSize="sm" color="gray.600" mt="2">
          Harvest Date: <b>{harvestDate}</b>
        </Text>

        <Text fontSize="sm" color="gray.600" mt="2">
          Quantity: <b>{Quntity} Kg</b>
        </Text>

        <Progress
          value={Quntity}
          max={100}
          size="sm"
          colorScheme={available ? "green" : "red"}
          borderRadius="md"
          mt={2}
        />

        <Text fontSize="sm" color={available ? "green.500" : "red.500"} mt="2">
          {available ? "Available ✅" : "Out of Stock ❌"}
        </Text>

        <Text fontSize="lg" fontWeight="bold" mt="2" color="teal.600">
          Price: {price} $
        </Text>
      </Box>

      <Box p="3" display="flex" justifyContent="center">
        <Tooltip label="Delete Crop" hasArrow>
          <Button
            size="sm"
            colorScheme="white"
            color="green"
            _hover={{ bg:"rgb(215, 237, 222)", transform: "scale(1.05)" }}
            _active={{bg:"rgb(215, 237, 222)" }}
            marginRight="30px"
            leftIcon={<MdDelete />}
          />
        </Tooltip>

        <Tooltip label="Edit Crop" hasArrow>
          <Button
            size="sm"
            colorScheme="white"
            color="green"
            _hover={{ bg:"rgb(215, 237, 222)", transform: "scale(1.05)" }}
            _active={{ bg: "rgb(215, 237, 222)" }}
            leftIcon={<MdEdit />}
          />
        </Tooltip>
      </Box>
    </MotionBox>
  );
};
