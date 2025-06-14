'use client';
import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Text,
  HStack,
  Link,
  Flex
} from "@chakra-ui/react";
import { MdEmail, MdPerson, MdMessage } from "react-icons/md";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import contactGif from "../../public/images/contact.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const toast = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    toast({
      title: "Message Sent!",
      description: "We have received your message and will get back to you soon.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setFormData({ name: "", email: "", message: "" });
  };

  return (
   
      <Box
        w={{ base: "100%", md: "50%" }}
        maxW="500px"
        p={3}
        my={20}
        mx="auto"
        boxShadow="lg"
        borderRadius="lg"
        bg="white"
      >
        <Heading mb={2} textAlign="center">
            <Flex align="center" gap={10}>
             Contact Us 
              <Box w={{ base: "60%", md: "40%" }} mx={"30px"}>
        <Lottie animationData={contactGif} loop={true} style={{ width: "70%", height: "auto" }} />
      </Box>

            </Flex>

        </Heading>

      
          <form onSubmit={handleSubmit}>
            <FormControl mb={2} isRequired>
              <FormLabel>
                <HStack><MdPerson /> <Text>Name</Text></HStack>
              </FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>
                <HStack><MdEmail /> <Text>Email</Text></HStack>
              </FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>
                <HStack><MdMessage /> <Text>Message</Text></HStack>
              </FormLabel>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
            </FormControl>

            <Button bg="green.500" color="white" _hover={{ bg: "green.600" }} type="submit" width="full">
              Send Message
            </Button>
          </form>

        <Box mt={6} textAlign="center">
          <Text fontSize="sm">  Or reach us at: <Box as="span" color="green.500" fontWeight="bold">info@farmx.com</Box>
</Text>
          <HStack justify="center" mt={2} spacing={4}>
            <Link href="https://instagram.com" isExternal aria-label="Instagram">
              <FaInstagram size="24px" />
            </Link>
            <Link href="https://facebook.com" isExternal aria-label="Facebook">
              <FaFacebook size="24px" />
            </Link>
          </HStack>
        </Box>
      </Box>

      
  );
};

export default ContactPage;
