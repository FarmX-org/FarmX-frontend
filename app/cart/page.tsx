'use client';
import { Box,
   Button, 
   Flex,
    Heading,
     Image, 
     Input, 
     Table,
     Tbody,
      Td,
      Th,
      Thead,
       Tr,
      Text,
       useToast,
       } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import cartGif from "../../public/images/cart2.json";
import cart2Gif from "../../public/images/emptycart.json";
import { apiRequest } from "@/lib/api";


const CartPage = () => {
const [cart, setCart] = useState<{ items: any[]; totalPrice: number }>({ items: [], totalPrice: 0 });
  const toast = useToast();

  const fetchCartItems = async () => {
    try {
      const cartData  = await apiRequest("/cart");
      console.log("CART ITEM", cartData.items[0]);

      setCart(cartData );
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const increaseQuantity = async(ItemID:number) =>{
    const item = cart.items.find((item) => item.id === ItemID);
    if (!item) return;

    try {
      await apiRequest(`/cart/items/${ItemID}`, "PUT", { 
        quantity: item.quantity + 1
      });

      fetchCartItems();
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
  };

  const decreaseQuantity = async(ItemID:number) => {
    const item = cart.items.find((item) => item.id === ItemID);
    if (!item) return;

    try {
      await apiRequest(`/cart/items/${ItemID}`, "PUT", { 
        quantity: item.quantity - 1
      });
      if (item.quantity <= 1) return; 


      fetchCartItems();
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
  };


  const clearCart = async () => {
  if (!confirm("Are you sure you want to clear the cart?")) return;

    try {
      await apiRequest("/cart/clear", "DELETE");
      fetchCartItems();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);


  return (
    <Box p={{ base: 4, md: 8 }}>
      <Flex
  justify="center"
  align="center"
  direction="column"
  mt={{ base: 1, md: 4 , lg: 20}}
  mb={{ base: 2, md: 6 }}
>

  <Box w={{ base: "150px", md: "200px" }}>
    <Lottie
    animationData={cart.items.length === 0 ? cart2Gif : cartGif}
    loop={true}
      style={{ width: "100%", height: "auto" }}
    />
  </Box>

  <Heading mt={{ base: 1, md: 4 }} fontSize={{ base: "2xl", md: "4xl" }}>
    Shopping Cart
  </Heading>
</Flex>


      {cart.items.length === 0 ? (
        <Text fontSize="xl" textAlign="center">Your cart is empty! Please add some items.</Text>
      ) : (
        <>
          <Box display={{ base: "none", md: "block" }}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Product</Th>
                  <Th>Price</Th>
                  <Th>Quantity</Th>
                  <Th>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cart.items.map((item) => (
                  <Tr key={item.id}>
                    <Td>
                      <Flex align="center" gap={4}>
                        <Image src={item.productImage} alt={item.productName} boxSize="50px" />
                        <Text fontWeight="bold">{item.productName}</Text>
                      </Flex>
                    </Td>
                    <Td>${item.productPrice.toFixed(2)}</Td>
                    <Td>
                      <Flex align="center" gap={2}>
                        <Button size="sm" onClick={() => decreaseQuantity(item.id)}>-</Button>
                        <Input
                          value={item.quantity}
                          readOnly
                          width="50px"
                          textAlign="center"
                          variant="outline"
                        />
                        <Button size="sm" onClick={() => increaseQuantity(item.id)}>+</Button>
                      </Flex>
                    </Td>
                    <Td>${(item.productPrice * item.quantity).toFixed(2)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Box display={{ base: "block", md: "none" }}>
            <Flex direction="column" gap={4}>
              {cart.items.map((item) => (
                <Box key={item.id} borderWidth="1px" borderRadius="lg" p={4} boxShadow="md">
                  <Flex align="center" gap={4}>
                    <Image src={item.image} alt={item.name} boxSize="60px" />
                    <Text fontWeight="bold" fontSize="lg">{item.name}</Text>
                  </Flex>

                  <Text mt={2}>Price: ${item.productPrice.toFixed(2)}</Text>

                  <Flex align="center" gap={2} mt={2}>
                    <Button size="sm" onClick={() => decreaseQuantity(item.id)}>-</Button>
                    <Input
                      value={item.quantity}
                      readOnly
                      width="50px"
                      textAlign="center"
                      variant="outline"
                    />
                    <Button size="sm" onClick={() => increaseQuantity(item.id)}>+</Button>
                  </Flex>

                  <Text mt={2} fontWeight="bold">
                    Total: ${(item.productPrice * item.quantity).toFixed(2)}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>

          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            mt={8}
            gap={4}
          >
            <Button colorScheme="red" variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>

            <Box textAlign={{ base: "left", md: "right" }}>
              <Text fontSize="lg">Subtotal: ${cart.totalPrice.toFixed(2)}</Text>
              <Text fontSize="xl" fontWeight="bold">Total: ${cart.totalPrice.toFixed(2)}</Text>

              <Button colorScheme="green" size="lg" mt={4} width={{ base: "100%", md: "auto" }}>
                Proceed to Checkout
              </Button>
            </Box>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default CartPage;
