import React, { useState } from "react";
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Image,
  InputGroup,
  InputLeftElement,
  Stack,
  Icon,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaUser, FaLock } from "react-icons/fa";
import cloudGif from "../../public/images/cloud.json";
import Lottie from "lottie-react";
import NextLink from "next/link";

interface LoginProps {
  setToken: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) throw new Error("Invalid username or password");

      const data = await response.json();
      const token = data.accessToken;
      const roles = data.roles;

      localStorage.setItem("token", token);
      localStorage.setItem("roles", JSON.stringify(roles));
      setToken(token);
      setError("");
      window.location.href = "/hello";
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      direction={{ base: "column", md: "row" }}
      bg="gray.50"
      px={4}
      py={8}
      gap={6}
    >
      <Box
        bg="white"
        p={10}
        borderRadius="xl"
        boxShadow="lg"
        width={{ base: "100%", sm: "400px" }}
      >
        <Heading size="lg" mb={6} color="green.600" textAlign="center">
          Welcome Back
        </Heading>

        <form onSubmit={handleLogin}>
          <Stack spacing={5}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaUser} color="gray.400" />
                </InputLeftElement>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaLock} color="gray.400" />
                </InputLeftElement>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="green"
              size="lg"
              fontWeight="bold"
              _hover={{ bg: "green.400" }}
            >
              Login
            </Button>

            {error && (
              <Text color="red.500" fontSize="sm" textAlign="center">
                {error}
              </Text>
            )}

            <Text textAlign="center" fontSize="sm">
              Don't have an account?{" "}
              <Link as={NextLink} href="/signup" color="green.500" fontWeight="bold">
                Sign up
              </Link>
            </Text>
          </Stack>
        </form>
      </Box>

      {!isMobile && (
        <Box
          position="relative"
          width="550px"
          height="800px"
          minW="400px"
        >
          <Image
            src="./images/logg.png"
            alt="Login Side"
            width="100%"
            height="100%"
            objectFit="contain"
          />
          <Box
            position="absolute"
            top="-100px"
            left={0}
            width="100%"
            height="100%"
            pointerEvents="none"
            zIndex={1}
          >
            <Lottie
              animationData={cloudGif}
              loop
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        </Box>
      )}
    </Flex>
  );
};

export default Login;
