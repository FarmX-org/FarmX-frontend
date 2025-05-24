'use client';
import {
  Box,
  Heading,
  Text,
  Avatar,
  VStack,
  HStack,
  Button,
  Divider,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';

export default function UserProfile() {
  const user = {
    name: 'Samaa',
    email: 'samaa@example.com',
    phone: '+970 599 123 456',
    location: 'Nablus, Palestine',
    role: 'Farmer',
    avatar: '',
  };

  return (
    <Box
      maxW="4xl"
      mx="auto"
      mt={20}
      p={6}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="md"
      borderRadius="xl"
    >
      <VStack spacing={6} align="start">
        <HStack spacing={6} w="100%" justify="space-between">
          <HStack spacing={4}>
            <Avatar size="xl"  src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${user.name}&background=ffffff&color=000000`
                    } name={user.name} />
            <Box>
              <Heading size="lg">{user.name}</Heading>
              <Text color="gray.500">{user.role}</Text>
            </Box>
          </HStack>
          <Button colorScheme="green" variant="outline">
            Edit Profile
          </Button>
        </HStack>

        <Divider />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
          <Box>
            <Text fontWeight="bold">Email:</Text>
            <Text>{user.email}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Phone:</Text>
            <Text>{user.phone}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Location:</Text>
            <Text>{user.location}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Role:</Text>
            <Text>{user.role}</Text>
          </Box>
        </SimpleGrid>

        
        <Divider />
         <Box w="100%">
          <Heading size="md" mb={2}>Recent Activity</Heading>
          <Text>No recent activity.</Text>
        </Box> 
      </VStack>
    </Box>
  );
}
