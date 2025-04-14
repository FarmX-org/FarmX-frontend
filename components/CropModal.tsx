import React, { useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Input, FormControl, FormLabel,
  Select, Grid, GridItem, Button, Box, Image, useToast
} from "@chakra-ui/react";


interface CropModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCrop: any | null;
  onSave: (crop: any) => void; 
}

const CropModal: React.FC<CropModalProps> = ({
  isOpen,
  onClose,
  selectedCrop,
  onSave
}) => {
  const toast = useToast();
  const [cropData, setCropData] = React.useState<any>({
    name: "",
    category: "",
    price: 0,
    quantity: 0,
    description: "",
    harvestDate: "",
    imageUrl: "",
    available: true,
    farmId: null,
  });

  useEffect(() => {
    if (selectedCrop) {
      setCropData(selectedCrop);
    } else {
      setCropData({
        name: "",
        category: "",
        price: 0,
        quantity: 0,
        description: "",
        harvestDate: "",
        imageUrl: "",
        available: true,
        farmId: null,
      });
    }
  }, [selectedCrop, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropData({ ...cropData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleSave = () => {
    if (!cropData.name || !cropData.category || !cropData.harvestDate) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    onSave(cropData);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selectedCrop ? "Edit Crop" : "Add New Crop"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Crop Name</FormLabel>
                <Input
                  value={cropData.name}
                  onChange={(e) => setCropData({ ...cropData, name: e.target.value })}
                  placeholder="e.g. Tomatoes"
                />
              </FormControl>
            </GridItem>

            <FormControl>
              <FormLabel>Price ($)</FormLabel>
              <Input
                type="number"
                value={cropData.price}
                onChange={(e) => setCropData({ ...cropData, price: Number(e.target.value) })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Quantity (Kg)</FormLabel>
              <Input
                type="number"
                value={cropData.quantity}
                onChange={(e) => setCropData({ ...cropData, quantity: Number(e.target.value) })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Harvest Date</FormLabel>
              <Input
                type="date"
                value={cropData.harvestDate}
                onChange={(e) => setCropData({ ...cropData, harvestDate: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                placeholder="Select category"
                value={cropData.category}
                onChange={(e) => setCropData({ ...cropData, category: e.target.value })}
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains</option>
                <option value="Herbs">Herbs</option>
              </Select>
            </FormControl>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  value={cropData.description}
                  onChange={(e) => setCropData({ ...cropData, description: e.target.value })}
                  placeholder="Brief description of the crop"
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Upload Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </FormControl>

              {cropData.imageUrl && (
                <Box mt={3} textAlign="center">
                  <Image
                    src={cropData.imageUrl}
                    alt="Preview"
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius="md"
                    mx="auto"
                    border="2px solid #ccc"
                  />
                  <Box fontSize="sm" color="gray.500" mt={1}>Image Preview</Box>
                </Box>
              )}
            </GridItem>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleSave}>
            {selectedCrop ? "Update" : "Save"}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CropModal;
