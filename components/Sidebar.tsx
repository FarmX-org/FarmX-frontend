'use client';
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Input,
  SimpleGrid,
  Text,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { MdAdd } from 'react-icons/md';
import { FaChartBar } from 'react-icons/fa';

interface SidebarProps {
  onSearchChange: (value: string) => void;
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
  onResetFilters: () => void;
  showCropActions?: boolean; 
  onAddCrop?: () => void; 
  onViewReport?: () => void;  
}

const Sidebar: React.FC<SidebarProps> = ({
  onSearchChange,
  onCategorySelect,
  selectedCategory,
  onResetFilters,
  showCropActions = false,
  onAddCrop,
  onViewReport
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categories = [
    { label: "Vegetables", icon: "./images/vegetable1.png" },
    { label: "Fruits", icon: "./images/fruit.png" },
    { label: "Grains", icon: "./images/rice.png" },
    { label: "Herbs", icon: "./images/rosemary.png" },
  ];

  const SidebarContent = () => (
    <Box w="250px" bg="#FFFFFF" p={4} minH="100vh" position="relative">
      <Image
        src="./images/farmerr.png"
        alt="Jumping Crop"
        position="absolute"
        top="100px"
        left="0px"
        boxSize="130px"
        zIndex={2}
      />
      <Input
        placeholder="Search"
        mb={4}
        mt="200px"
        onChange={(e) => onSearchChange(e.target.value)}
        borderRadius="lg"
      />
      <Button colorScheme="green" width="100%" mb={4} onClick={onResetFilters}>
        View All
      </Button>

      {showCropActions && (
        <>
          <Button
            colorScheme="green"
            leftIcon={<MdAdd />}
            width="100%"
            mb={3}
            onClick={onAddCrop}
          >
            Add Crop
          </Button>

        </>
      )}

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
            _hover={{ bg: "gray.100", color: "green.500" }}
            _active={{ bg: "gray.100", color: "green.500" }}
            _focus={{ bg: "gray.100", color: "green.500" }}
            onClick={() => {
              onCategorySelect(cat.label);
              if (isMobile) onClose();
            }}
          >
            <Image src={cat.icon} boxSize="40px" mb={1} alt={cat.label} />
            <Text fontSize="sm" textAlign="center">
              {cat.label}
            </Text>
          </Button>
        ))}

        
      </SimpleGrid>

      <Button
            colorScheme="green"
            variant={"outline"}
            leftIcon={<FaChartBar />}
            mt={10}
            width="100%"
            mb={4}
            onClick={onViewReport}
          >
            View Farm Report
          </Button>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            icon={<FiMenu />}
            aria-label="Open menu"
            onClick={onOpen}
            m={2}
            mt={16}
          />
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Filters</DrawerHeader>
              <DrawerBody p={0}>
                <SidebarContent />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <SidebarContent />
      )}
    </>
  );
};

export default Sidebar;
