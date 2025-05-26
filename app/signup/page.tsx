"use client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    phone: "",
    city: "",
    street: "",
    email: "",
    role: "Farmer",
  });

  const toast = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = "Signup failed";

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }

      throw new Error(errorMessage);
    }

    toast({
      title: "Account created!",
      description: "You can now log in.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    router.push("/login");

  } catch (error: any) {
    toast({
      title: "Sign up failed",
      description: error.message || "Something went wrong.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};


  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={4}>
      <Box bg="white" p={8} rounded="xl" shadow="md" w="full" maxW="md">
        <Heading mb={6} textAlign="center" color="green.600">
          Sign Up
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input name="username" value={form.username} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" value={form.password} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input name="name" value={form.name} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Phone</FormLabel>
              <Input name="phone" value={form.phone} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>City</FormLabel>
              <Input name="city" value={form.city} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Street</FormLabel>
              <Input name="street" value={form.street} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={form.email} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
  <FormLabel>Role</FormLabel>
  <Select name="role" value={form.role} onChange={handleChange}>
    <option value="Farmer">Farmer</option>
    <option value="Consumer">Consumer</option>
  </Select>
</FormControl>

            <Button type="submit" colorScheme="green" w="full" rounded="full">
              Sign Up
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default SignUp;
