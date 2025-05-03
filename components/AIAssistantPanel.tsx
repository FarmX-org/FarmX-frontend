import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { FaLeaf, FaSeedling, FaExclamationTriangle } from "react-icons/fa";

// ✅ Define Types
type AlertStatus = "success" | "info" | "warning" | "error" | "loading";

interface Insight {
  id: number;
  type: AlertStatus;
  icon: JSX.Element;
  message: string;
}

interface CropSuggestion {
  name: string;
  suitability: "Excellent" | "Good" | "Poor";
  reason: string;
}

// ✅ Mock Data
const insights: Insight[] = [
  {
    id: 1,
    type: "success",
    icon: <FaLeaf />,
    message: "Tomatoes are ideal to plant this week based on temperature and soil humidity.",
  },
  {
    id: 2,
    type: "info",
    icon: <FaSeedling />,
    message: "Your region is suitable for planting lentils soon.",
  },
  {
    id: 3,
    type: "warning",
    icon: <FaExclamationTriangle />,
    message: "Rain is expected this weekend. Avoid watering on Friday and Saturday.",
  },
];

const smartCrops: CropSuggestion[] = [
  {
    name: "Tomato",
    suitability: "Excellent",
    reason: "Optimal sunlight and moisture levels.",
  },
  {
    name: "Cucumber",
    suitability: "Poor",
    reason: "Too cold in your region this week.",
  },
  {
    name: "Lentils",
    suitability: "Good",
    reason: "Soil type and temperature are moderately suitable.",
  },
];

// ✅ Helper for Badge Color
const getBadgeColor = (suitability: string) => {
  switch (suitability) {
    case "Excellent":
      return "green";
    case "Good":
      return "yellow";
    case "Poor":
      return "red";
    default:
      return "gray";
  }
};

// ✅ Main Component
const AIAssistantPanel: React.FC = () => {
  return (
    <Box p={6} bg="gray.50" borderRadius="2xl" boxShadow="lg">
      <Heading size="lg" mb={4}>
        🤖 Smart Farming Assistant
      </Heading>

      <VStack spacing={3} align="stretch">
        {insights.map((item) => (
          <Alert key={item.id} status={item.type} variant="left-accent" borderRadius="md">
            <AlertIcon boxSize={5} mr={2}>
              {item.icon}
            </AlertIcon>
            <Text fontSize="sm">{item.message}</Text>
          </Alert>
        ))}
      </VStack>

      <Divider my={6} />

      <Box>
        <Heading size="md" mb={3}>
          🌾 Crop Suitability Suggestions
        </Heading>

        <Table variant="striped" size="md" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Crop</Th>
              <Th>Suitability</Th>
              <Th>Reason</Th>
            </Tr>
          </Thead>
          <Tbody>
            {smartCrops.map((crop, index) => (
              <Tr key={index}>
                <Td fontWeight="medium">{crop.name}</Td>
                <Td>
                  <Badge colorScheme={getBadgeColor(crop.suitability)}>{crop.suitability}</Badge>
                </Td>
                <Td>{crop.reason}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default AIAssistantPanel;
