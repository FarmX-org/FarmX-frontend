import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  NumberInput,
  NumberInputField,
  useToast
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  cropName: string;
  quantity: number;
  unit: string;
  price: number;
  available: boolean;
  description: string;
  imageUrl: string;
  category: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Product) => void;
  initialData: Product;
};

export default function ProductModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<Product>(initialData);
  const toast = useToast();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (value: string, field: keyof Product) => {
    setFormData(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, available: e.target.checked }));
  };

  const handleSubmit = () => {
    if (!formData.cropName || formData.quantity <= 0 || formData.price <= 0) {
      toast({ status: "warning", description: "Please fill in all the required fields." });
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mb={3} isRequired>
            <FormLabel>Product Name </FormLabel>
            <Input name="cropName" value={formData.cropName} onChange={handleChange} />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Quantity</FormLabel>
            <NumberInput value={formData.quantity} min={0} onChange={(val) => handleNumberChange(val, "quantity")}>
              <NumberInputField name="quantity" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Unit</FormLabel>
            <Input name="unit" value={formData.unit} onChange={handleChange} />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Price</FormLabel>
            <NumberInput value={formData.price} min={0} precision={2} onChange={(val) => handleNumberChange(val, "price")}>
              <NumberInputField name="price" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Description</FormLabel>
            <Textarea name="description" value={formData.description} onChange={handleChange} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Image URL </FormLabel>
            <Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Category</FormLabel>
            <Input name="category" value={formData.category} onChange={handleChange} />
          </FormControl>

          <FormControl display="flex" alignItems="center" mt={4}>
            <FormLabel htmlFor="available" mb="0">Available</FormLabel>
            <Switch id="available" isChecked={formData.available} onChange={handleSwitchChange} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleSubmit}>
            Update
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
