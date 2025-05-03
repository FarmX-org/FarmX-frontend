import React from "react";
import { Box, Grid, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import AIAssistantPanel from "@/components/AIAssistantPanel";

const CropOverview = () => (
  <Box p={4} bg="white" borderRadius="xl" boxShadow="md">
    <Heading size="md" mb={2}>🌱 My Crops</Heading>
    <Text fontSize="sm">You have 4 crops currently growing.</Text>
  </Box>
);

const WeatherWidget = () => (
  <Box p={4} bg="white" borderRadius="xl" boxShadow="md">
    <Heading size="md" mb={2}>☁️ Weather Forecast</Heading>
    <Text fontSize="sm">Today: Sunny, 25°C. Rain expected on Friday.</Text>
  </Box>
);

const Notifications = () => (
  <Box p={4} bg="white" borderRadius="xl" boxShadow="md">
    <Heading size="md" mb={2}>🔔 Notifications</Heading>
    <Text fontSize="sm">3 new insights from your smart assistant.</Text>
  </Box>
);

const DashboardPage: React.FC = () => {
  return (
    <Box p={6} bg="gray.100" minHeight="100vh">
      <Heading size="lg" mb={6}>📊 Farm Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
        <CropOverview />
        <WeatherWidget />
        <Notifications />
      </SimpleGrid>

      <AIAssistantPanel />
    </Box>
  );
};

export default DashboardPage;
