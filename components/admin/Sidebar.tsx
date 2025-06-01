'use client';

import {
  Box,
  VStack,
  Link,
  Text,
  Icon,
  Flex,
} from '@chakra-ui/react';
import {
  FiHome,
  FiUsers,
  FiMap,
  FiShoppingBag,
  FiDatabase,
  FiBarChart2,
} from 'react-icons/fi';
import NextLink from 'next/link';

const navLinks = [
  { label: 'Dashboard', icon: FiHome, href: '/admin' },
  { label: 'Users', icon: FiUsers, href: '/admin/users' },
  { label: 'Farms', icon: FiMap, href: '/admin/farms' },
  { label: 'Crops', icon: FiDatabase, href: '/admin/crops' },
  { label: 'Planted Crops', icon: FiDatabase, href: '/admin/planted-crops' },
  { label: 'Orders', icon: FiShoppingBag, href: '/admin/orders' },
  { label: 'Products', icon: FiShoppingBag, href: '/admin/products' },
  { label: 'Reports', icon: FiBarChart2, href: '/admin/reports' },
];

const AdminSidebar = () => {
  return (
    <Box
      bg="white"
      color="black"
      w="240px"
      h="150vh"
      p={6}
      position="sticky"
      top={0}
      boxShadow="md"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={10}>
        Admin Panel
      </Text>

      <VStack align="stretch" spacing={4}>
        {navLinks.map((link) => (
          <Link
            as={NextLink}
            key={link.href}
            href={link.href}
            _hover={{ bg: 'green.100' }}
            px={3}
            py={2}
            borderRadius="md"
            fontWeight="medium"
            display="flex"
            alignItems="center"
            gap={3}
          >
            <Icon as={link.icon} boxSize={5} />
            {link.label}
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default AdminSidebar;
