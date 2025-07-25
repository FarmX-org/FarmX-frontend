'use client';
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar";
import { Cards } from "@/components/Cards";
import { MdShoppingCart } from "react-icons/md";
import { motion } from "framer-motion";
import { Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";



interface Product {
  id: number;
  imageSrc: string;
  title: string;
  price: number;
  available: boolean;
  category: string;
  unit: string;
  quantity: number;
  description: string;
  rating?: number;
  ratingCount?: number;
}

const StorePage = () => {
  const toast = useToast();
  const cartRef = useRef<HTMLDivElement | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [flyingItem, setFlyingItem] = useState<null | Product>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isConsumer, setIsConsumer] = useState(false);
  


  const router = useRouter();

  useEffect(() => {
  const fetchProducts = async () => {
    try {
const data = await apiRequest("/products/store" );
    console.log("Fetched products:", data); 
    

      const formattedProducts = data.map((product: any) => ({
  id: product.id,
  imageSrc: product.imageUrl || "/images/Tomato.png",
  title: product.cropName || "No description",
  price: product.price ?? 0,
  available: product.available ?? false,
  category: product.category || "Vegetables",

  unit: product.unit || "",
  quantity: product.quantity || 0,
  description: product.description || "",
  rating: product.rating,           
  ratingCount: product.ratingCount  
}));

      setProducts(formattedProducts);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to fetch products",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  fetchProducts();
}, []);


  const filteredProducts = products.filter((product) => {
  const matchesSearch = product.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  const matchesCategory = selectedCategory
    ? product.category.toLowerCase() === selectedCategory.toLowerCase()
    : true;
  return matchesSearch && matchesCategory;
});


  const handleAddToCart = async  (id: number, quantity: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    if (quantity > product.quantity) {
    toast({
      title: "Quantity is greater than available quantity.",
      description: `You only have  ${product.quantity} units.`,
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
    return;
  }
    try{
      await apiRequest("/cart/items", "POST", {
        productId: id,
        quantity: quantity,
      });
      toast({
        title: "Added to Cart",
        description: `Product #${id} with quantity ${quantity} added to cart.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      } catch (err: any) {
        toast({
          title: "Error adding to cart",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      
    }
    

    const cartRect = cartRef.current?.getBoundingClientRect();
    if (cartRect) {
      setFlyingItem(product);
      setCoords({ x: cartRect.left, y: cartRect.top });
    }

    setTimeout(() => {
      toast({
        title: "Added to Cart",
        description: `Product #${id} with quantity ${quantity} added to cart.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFlyingItem(null);
    }, 800);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };
  const images = [
    '/images/markett.png',
    '/images/market2.jpg',
    '/images/market3.jpg'
  ];
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  if (typeof window !== 'undefined') {
    const roleString = localStorage.getItem('roles');
    if (roleString) {
      try {
        const roles = JSON.parse(roleString); 
        console.log("Parsed roles:", roles);
        setIsConsumer(Array.isArray(roles) && roles.includes('ROLE_CONSUMER'));
      } catch (e) {
        console.error("Failed to parse roles from localStorage", e);
        setIsConsumer(false);
      }
    }
  }
}, []);

  return (
    <Flex>
      <Sidebar
        onSearchChange={setSearchTerm}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
        onResetFilters={handleResetFilters}
      />


      <Box bg="white" minHeight="100vh" p={5} flex="1" position="relative">

      <Image
      mt={10}
        src={images[currentImage]}
        alt={`Image ${currentImage + 1}`}
        width="85%"
        maxHeight="400px"
        borderRadius="md"
        objectFit="contain"
      />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} mt={0}>
          {filteredProducts.map((product) => (
            <Cards
  key={product.id}
  id={product.id}
  imageSrc={product.imageSrc}
  title={product.title}
  price={product.price}
  available={product.available}
  description={product.description} 
  quantity={product.quantity }
  unit={product.unit}
  variant="product"
  onAddToCart={handleAddToCart}
  rating={product.rating}
  ratingCount={product.ratingCount}

/>

          ))}
        </SimpleGrid>

        {flyingItem && (
          <motion.img
          src={flyingItem.imageSrc}
          initial={{
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            position: "fixed",
            left: "50%",
            top: "50%",
            width: "150px", 
            height: "150px",
            zIndex: 9999,
          }}
          animate={{
            x: coords.x - window.innerWidth / 2,
            y: coords.y - window.innerHeight / 2,
            scale: 0.05, 
            opacity: 0,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ pointerEvents: "none" }} 
        />
        
        )}

        {isConsumer&&<Box
          ref={cartRef}
          position="fixed"
          bottom="20px"
          right="20px"
          zIndex={10}
          bg="white"
          borderRadius="full"
          boxShadow="lg"
          p={3}
        >
          <MdShoppingCart size={30} color="green" 
          onClick={() => router.push("/cart")}
          />
        </Box>}
      </Box>
    </Flex>
  );
};

export default StorePage;
