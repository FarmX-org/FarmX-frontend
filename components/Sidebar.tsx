import {
    Box,
    Input,
    Button,
    Text,
    Image,
    Divider,
    SimpleGrid,
  } from "@chakra-ui/react";
  import React from "react";

  const Sidebar = () => {
    const categories = [
      { label: "Vegetables", icon: "./images/food.png" },
      { label: "Fruits", icon: "./images/food.png" },
      { label: "Grains", icon: "./images/food.png" },
      { label: "Herbs", icon: "./images/food.png" },
    ];
  
    return (
      <Box
        w="250px"
        bg="gray.50"
        p={4}
        borderRight="1px solid #ccc"
        minH="100vh"
      >
        <Input placeholder="Search" mb={4}   marginTop={"200px"}/>
        <Button colorScheme="green" width="100%" mb={4}>
          View My Crops
        </Button>
  
        <Divider mb={3} />
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Categories
        </Text>
  
        <SimpleGrid columns={3} spacing={3}  >
          {categories.map((cat) => (
            <Button
              key={cat.label}
              variant="ghost"
              p={2}
              height="auto"
              display="flex"
              flexDirection="column"
            >
              <Image src={cat.icon} boxSize="20px" mb={1} alt={cat.label}  />

              <Text fontSize="sm" textAlign={"center"}>{cat.label} </Text>
            </Button>
          ))}
        </SimpleGrid>
      </Box>
    );
  };
export default Sidebar;
      
    
  