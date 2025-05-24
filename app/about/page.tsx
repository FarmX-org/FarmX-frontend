'use client';
import React from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Icon,
  useColorModeValue,
  Container
} from "@chakra-ui/react";
import { FaSeedling, FaWater, FaTractor } from "react-icons/fa";

const features = [
  {
    icon: FaSeedling,
    title: "Smart Crop Management",
    description: "Track your crops and optimize their growth using AI-powered insights.",
  },
  {
    icon: FaWater,
    title: "Intelligent Irrigation",
    description: "Get watering recommendations based on real-time soil and weather data.",
  },
  {
    icon: FaTractor,
    title: "Efficient Resource Use",
    description: "Manage tools, fertilizers, and resources to maximize productivity.",
  },
];

const AboutPage = () => {
  return (
    <Box my={20} py={10} px={6} bg={useColorModeValue("green.50", "gray.800")} minH="100vh">
      <Container maxW="5xl">
        <Heading textAlign="center" mb={6} color="green.600">
          About Our Smart Farm
        </Heading>
        <Text fontSize="lg" textAlign="center" mb={10}>
          Welcome to GreenFarm – a smart solution that helps farmers manage their land,
          crops, and resources efficiently. Our goal is to empower local agriculture
          through modern technology, making farming easier, smarter, and more sustainable.
        </Text>

        <Stack spacing={8}>
          {features.map((feature, index) => (
            <Box
              key={index}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
            >
              <Stack direction="row" align="center" spacing={4}>
                <Icon as={feature.icon} boxSize={8} color="green.500" />
                <Box>
                  <Heading fontSize="xl">{feature.title}</Heading>
                  <Text mt={2} fontSize="md">{feature.description}</Text>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default AboutPage;
