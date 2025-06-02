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
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { keyframes } from "@emotion/react";

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

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

  const [step, setStep] = useState(1);
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
      <Flex
        w="full"
        maxW="1000px"
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="center"
        gap={10}
        mt={20}
      >
        <Box bg="white" p={8} rounded="xl" shadow="md" w="full" maxW="md">
          <Heading mb={6} textAlign="center" color="green.600">
            Sign Up
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              {step === 1 && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input name="username" value={form.username} onChange={handleChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" name="password" value={form.password} onChange={handleChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Role</FormLabel>
                    <Select name="role" value={form.role} onChange={handleChange}>
                      <option value="Farmer">Farmer</option>
                      <option value="Consumer">Consumer</option>
                    </Select>
                  </FormControl>

                  <Button colorScheme="green" w="full" onClick={() => setStep(2)}>
                    Next
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
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

                  <Flex w="full" gap={4}>
                    <Button onClick={() => setStep(1)} variant="outline" w="full">
                      Back
                    </Button>
                    <Button type="submit" colorScheme="green" w="full">
                      Sign Up
                    </Button>
                  </Flex>
                </>
              )}
            </VStack>
          </form>
        </Box>

        <Box
          display={{ base: "none", md: "block" }}
          flex="1"
          maxW="400px"
        >
          <Image
            src="/images/cuteTree.png"
            alt="Signup illustration"
            objectFit="contain"
            w="100%"
            h="auto"
            animation={`${bounce} 2s ease-in-out infinite`}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default SignUp;
