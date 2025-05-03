"use client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Image,
  useToast,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import Lottie from "lottie-react";
import signupGif from "../../public/images/signup.json";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const toast = useToast();
  const router = useRouter();  

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            name,
            phone,
            city,
            street,
          }),
        }
      );

      if (!response.ok) throw new Error("Signup failed");

      toast({
        title: "Success!",
        description: "User registered successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/login"); 
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to register user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      direction={{ base: "column", md: "row" }}
      bgGradient="linear(to-r, #fdfbf4, #eaf6e0)"
    >
       <Box position="absolute" top="80px" left="10px" w="120px" h="120px" zIndex="10">
        <Lottie
         animationData={signupGif}
          loop={true}
           />
      </Box>
      <Flex flex="1" align="center" justify="center" p={8}>
        <Box
          bg="white"
          p={8}
          rounded="xl"
          shadow="md"
          w="full"
          maxW="md"
          border="1px solid #e2e8f0"
        >
          <Heading mb={6} textAlign="center" color="green.700">
            Sign Up
          </Heading>
          <form onSubmit={handleSignUp}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0791234567"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>City</FormLabel>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Amman"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Street</FormLabel>
                <Input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Rainbow Street"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="green"
                w="full"
                mt={2}
                rounded="full"
              >
                Sign Up
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>

      <Flex
        flex="1"
        align="center"
        justify="center"
        bg="#eaf6e0"
        p={8}
        display={{ base: "none", md: "flex" }}
      >
        <Image
          src="/images/signup.png" 
          alt="Farm Door"
          borderRadius="xl"
          shadow="lg"
          maxH="60%"
          objectFit="cover"
        />
      </Flex>
    </Flex>
  );
};

export default SignUp;
