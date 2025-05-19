'use client';
import {
  Box,
  Avatar,
  Text,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  useColorModeValue,
  Icon,
  Button,
} from "@chakra-ui/react";
import { MdOutlineEmail, MdLocationOn, MdEdit } from "react-icons/md";

const user = {
  name: "Mahmoud Khaled",
  email: "mahmoud@farmapp.ps",
  location: "Jenin, Palestine",
  avatarUrl: "../images/farmerr.png",
  coverUrl: "../images/44.jpg",
};

const UserProfile = () => {
  const bg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box w="100%" minH="100vh" bg={bg}>
      <Box
        h="250px"
        bgImage={`url(${user.coverUrl})`}
        bgSize="cover"
        bgPosition="center"
        position="relative"
      >
        <Avatar
          size="2xl"
          src={user.avatarUrl}
          name={user.name}
          position="absolute"
          bottom={-12}
          left="50%"
          transform="translateX(-50%)"
          border="6px solid white"
        />
      </Box>

      <Box mt={20} px={{ base: 4, md: 16 }} pb={10}>
        <Stack spacing={1} textAlign="center" mb={6}>
          <Text fontSize="3xl" fontWeight="bold">
            {user.name}
          </Text>
          <Flex justify="center" align="center" gap={2}>
            <Icon as={MdOutlineEmail} color="gray.500" />
            <Text color="gray.600">{user.email}</Text>
          </Flex>
          <Flex justify="center" align="center" gap={2}>
            <Icon as={MdLocationOn} color="gray.500" />
            <Text color="gray.600">{user.location}</Text>
          </Flex>
        </Stack>

        <Tabs variant="enclosed-colored" colorScheme="green" isFitted>
          <TabList>
            <Tab>My Info</Tab>
            <Tab>My Farm</Tab>
            <Tab>My Orders</Tab>
          </TabList>

          <TabPanels mt={4}>
            <TabPanel>
              <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="lg" fontWeight="semibold">
                  Personal Information
                </Text>
                <Button
                  leftIcon={<MdEdit />}
                  colorScheme="green"
                  variant="outline"
                  size="sm"
                >
                  Edit Profile
                </Button>
              </Flex>
              <Text>Name: {user.name}</Text>
              <Text>Email: {user.email}</Text>
              <Text>Location: {user.location}</Text>
            </TabPanel>

            <TabPanel>
              <Text>Details about your farm, crops, and products...</Text>
            </TabPanel>

            <TabPanel>
              <Text>Orders you have placed or received as a farmer.</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default UserProfile;
