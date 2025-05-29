import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useToast,
  FormLabel,
  FormControl,
  Select,
} from "@chakra-ui/react";

interface SendToStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: {
    id: number;
    name: string;
    category: string;
    quantity: number;
    imageUrl: string;
    cropId: number;
  } | null;
  onSend: (payload: {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    imageUrl: string;
    description: string;
    plantedCropId: number;
    price: number;
  }) => void;
  onQuantityUpdate: (newQuantity: number, cropId: number) => void;
}

const SendToStoreModal: React.FC<SendToStoreModalProps> = ({
  isOpen,
  onClose,
  crop,
  onSend,
  onQuantityUpdate,
}) => {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const toast = useToast();

  const handleSubmit = () => {
    const quantity = parseInt(amount);
    const parsedPrice = parseFloat(price);

    if (!crop || isNaN(quantity) || quantity <= 0) {
      toast({
        title: "Please enter a valid quantity.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!unit) {
      toast({
        title: "Please select a unit.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (quantity > crop.quantity) {
      toast({
        title: "Quantity is greater than available quantity.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast({
        title: "Please enter a valid price.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    onSend({
      name: crop.name,
      category: crop.category,
      quantity,
      unit,
      imageUrl: crop.imageUrl,
      description: `send ${quantity} ${unit} of ${crop.name} to store`,
      plantedCropId: crop.id,
      price: parsedPrice,
    });

    const remaining = crop.quantity - quantity;
    onQuantityUpdate(remaining, crop.id);
    setAmount("");
    setPrice("");
    setUnit("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send to Store</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Quantity</FormLabel>
            <Input
              placeholder="Enter quantity"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="1"
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Unit</FormLabel>
            <Select
              placeholder="Select unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="kg">kg</option>
              <option value="box">Box</option>
              <option value="piece">Piece</option>
              <option value="liter">liter</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Price per unit</FormLabel>
            <Input
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min="0"
              step="0.01"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleSubmit}>
            Send
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SendToStoreModal;
