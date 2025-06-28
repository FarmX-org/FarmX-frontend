import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Button,
  Box,
  Image,
  useToast,
  Select,
  Switch,
} from "@chakra-ui/react";
import { apiRequest } from "@/lib/api";

interface BaseCrop {
  id: number;
  name: string;
  category: string;
  imageUrl?: string;
}

interface CropModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCrop: any | null;
  onSave: (crop: any) => void;
  farmId?: number | null;
  allCrops: BaseCrop[];
}

const CropModal: React.FC<CropModalProps> = ({
  isOpen,
  onClose,
  selectedCrop,
  onSave,
  farmId,
  allCrops,
}) => {
  const toast = useToast();
  const [useAI, setUseAI] = useState(false);
  const [soilType, setSoilType] = useState("");
  const [season, setSeason] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<BaseCrop[]>([]);

  const [cropData, setCropData] = useState<any>({
    cropId: "",
    name: "",
    category: "",
    quantity: 0,
    status: "planted",
    notes: "",
    imageUrl: "",
    available: true,
    farmId: null,
  });

  useEffect(() => {
    if (selectedCrop) {
      setCropData({
        ...selectedCrop,
        cropId: selectedCrop.cropId || selectedCrop.id,
        farmId: selectedCrop.farmId || farmId,
      });
    } else {
      setCropData({
        cropId: "",
        name: "",
        category: "",
        quantity: 0,
        status: "planted",
        notes: "",
        imageUrl: "",
        available: true,
        farmId: farmId ?? null,
      });
    }
  }, [selectedCrop, isOpen, farmId]);

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
    const cropIdNumber = Number(cropData.cropId);

    if (!cropData.cropId || isNaN(Number(cropData.cropId))) {
      toast({
        title: "Missing fields",
        description: "Please select a crop and set planted date.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const finalCropData = {
      ...cropData,
      cropId: cropIdNumber,
      farmId: cropData.farmId || farmId,
    };

    onSave(finalCropData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selectedCrop ? "Edit Crop" : "Add New Crop"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl display="flex" alignItems="center" mb={4}>
            <FormLabel htmlFor="use-ai" mb="0">
              Use AI to suggest crop?
            </FormLabel>
            <Switch
              id="use-ai"
              isChecked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
            />
          </FormControl>

          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem colSpan={2}>
              {useAI ? (
                <>
                  <FormControl>
                    <FormLabel>Soil Type</FormLabel>
                    <Input
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      placeholder="e.g., Clay"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Season</FormLabel>
                    <Input
                      value={season}
                      onChange={(e) => setSeason(e.target.value)}
                      placeholder="e.g., Summer"
                    />
                  </FormControl>

                  <Button
                    mt={2}
                    colorScheme="green"
                    onClick={async () => {
                      try {
                      const suggestions = await apiRequest(
  "/recommendations/recommend",
  "POST",
  {
    soilType,
    season,
  }
);

// لو suggestions مصفوفة خليه هيك، لو عنصر واحد حوّله لمصفوفة بعنصر واحد
const suggestionsArray = Array.isArray(suggestions) ? suggestions : [suggestions];

setAiSuggestions(suggestionsArray);

                        toast({
                          title: "Suggestions received",
                          description: "Choose a crop from the list below.",
                          status: "info",
                          duration: 3000,
                          isClosable: true,
                        });
                      } catch (err) {
                        toast({
                          title: "Error",
                          description: "Failed to get suggestions.",
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                        });
                      }
                    }}
                  >
                    Get Suggestions
                  </Button>

                  {aiSuggestions.length > 0 && (
                    <FormControl mt={3}>
                      <FormLabel>Select from suggestions</FormLabel>
                      <Select
                        placeholder="Select suggested crop"
                        onChange={(e) => {
                          const selectedId = Number(e.target.value);
                          const selected = aiSuggestions.find(
                            (c) => c.id === selectedId
                          );
                          if (selected) {
                            setCropData({
                              ...cropData,
                              cropId: selected.id,
                              name: selected.name,
                              category: selected.category,
                              imageUrl: selected.imageUrl || "",
                            });
                          }
                        }}
                      >
                        {aiSuggestions.map((crop) => (
                          <option key={crop.id} value={crop.id}>
                            {crop.name} ({crop.category})
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </>
              ) : (
                <FormControl isRequired>
                  <FormLabel>Crop</FormLabel>
                  <Select
                    placeholder="Select a crop"
                    value={cropData.cropId}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value);
                      const selected = allCrops.find(
                        (c) => c.id === selectedId
                      );
                      if (selected) {
                        setCropData({
                          ...cropData,
                          cropId: selected.id,
                          name: selected.name,
                          category: selected.category,
                          imageUrl: selected.imageUrl || "",
                        });
                      }
                    }}
                  >
                    {allCrops.map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name} ({crop.category})
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            </GridItem>

            <FormControl>
              <FormLabel>Quantity (units)</FormLabel>
              <Input
                type="number"
                value={cropData.quantity}
                onChange={(e) =>
                  setCropData({ ...cropData, quantity: Number(e.target.value) })
                }
              />
            </FormControl>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Input
                  value={cropData.status}
                  onChange={(e) =>
                    setCropData({ ...cropData, status: e.target.value })
                  }
                  placeholder="status of this crop"
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Input
                  value={cropData.notes}
                  onChange={(e) =>
                    setCropData({ ...cropData, notes: e.target.value })
                  }
                  placeholder="Extra notes about this crop"
                />
              </FormControl>
            </GridItem>

            <FormControl mb={3}>
              <FormLabel>Available</FormLabel>
              <Switch
                isChecked={cropData.available}
                onChange={(e) =>
                  setCropData({ ...cropData, available: e.target.checked })
                }
              />
            </FormControl>

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
                  <Box fontSize="sm" color="gray.500" mt={1}>
                    Image Preview
                  </Box>
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
