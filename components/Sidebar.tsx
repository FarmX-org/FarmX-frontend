'use client';
import React from "react";
import {
  Box,
  Button,
  Divider,
  Input,
  SimpleGrid,
  Text,
  Image
} from "@chakra-ui/react";

const Sidebar = ({
  onSearchChange,
  onCategorySelect,
  selectedCategory,
  onResetFilters 
}: {
  onSearchChange: (value: string) => void;
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
  onResetFilters: () => void;
}) => {
  const categories = [
    { label: "Vegetables", icon: "./images/vegetable1.png" },
    { label: "Fruits", icon: "./images/fruit.png" },
    { label: "Grains", icon: "./images/rice.png" },
    { label: "Herbs", icon: "./images/rosemary.png" },
  ];

  return (
    <Box w="250px" bg="gray.50" p={4} borderRight="1px solid #ccc" minH="100vh">
      <Input
        placeholder="Search crops"
        mb={4}
        marginTop={"200px"}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Button colorScheme="green" width="100%" mb={4} onClick={onResetFilters}>
        View All Crops
      </Button>

      <Divider mb={3} />
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Categories
      </Text>

      <SimpleGrid columns={3} spacing={3}>
        {categories.map((cat) => (
          <Button
            key={cat.label}
            variant={selectedCategory === cat.label ? "solid" : "ghost"}
            colorScheme="green"
            p={2}
            height="auto"
            display="flex"
            flexDirection="column"
            _hover={{ bg: "gray.100", color : "green.500" }}
            _active={{ bg: "gray.100", color : "green.500" }}
            _focus={{ bg: "gray.100", color : "green.500" }}
            onClick={() => onCategorySelect(cat.label)}
          >
            <Image src={cat.icon} boxSize="40px" mb={1} alt={cat.label} />
            <Text fontSize="sm" textAlign="center">
              {cat.label}
            </Text>
          </Button>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Sidebar;
