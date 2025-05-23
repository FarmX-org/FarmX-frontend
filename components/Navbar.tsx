'use client';

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Image,
  useDisclosure,
  VStack,
  Link,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tooltip,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { FaBrain } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Links = [
  { label: 'Home', href: '/' },
  { label: 'Crops', href: '/cropShowcase' },
  { label: 'Store', href: '/store' },
  { label: 'Activity', href: '/activites' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    px={4}
    py={2}
    rounded="md"
    _hover={{ textDecoration: 'none', bg: 'green.50' }}
    href={href}
    fontWeight="medium"
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const [user, setUser] = useState<{ name: string; avatarUrl: string } | null>(null);

  useEffect(() => {
    // تحققي من حالة الدخول من localStorage أو API
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <Box bg="green.500" px={4} boxShadow="sm" position="fixed" top="0" w="100%" zIndex="1000">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>
          <Image src="/images/Logo_bold.png" alt="Logo" height="100px" />
        </Box>

        <HStack as="nav" spacing={4} color="white" display={{ base: 'none', md: 'flex' }}>
          {Links.map((link) => (
            <NavLink key={link.label} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </HStack>

        <HStack spacing={4} color="white">
          <Tooltip label="Ai Suggestion" hasArrow>
            <Link href="/dashboard" px={2}>
              <FaBrain size={20} />
            </Link>
          </Tooltip>

          {user ? (
            <Menu>
              <MenuButton>
                <HStack spacing={2}>
                  <Avatar size="sm" name={user.name} src={user.avatarUrl} />
                  <Text fontWeight="medium" color="white" display={{ base: 'none', md: 'block' }}>
                    {user.name}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
                <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              leftIcon={<FiLogIn />}
              colorScheme="green"
              variant="solid"
              display={{ base: 'none', md: 'inline-flex' }}
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
          )}

          <IconButton
            size="md"
            icon={<GiHamburgerMenu />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={onOpen}
            variant="ghost"
          />
        </HStack>
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody mt={10}>
            <VStack spacing={4} align="start">
              {Links.map((link) => (
                <NavLink key={link.label} href={link.href}>
                  {link.label}
                </NavLink>
              ))}

              {user ? (
                <>
                  <Button color={'green.500'} variant="outline" w="100%" onClick={() => router.push('/profile')}>
                    Profile
                  </Button>
                  <Button  leftIcon={<FiLogOut />} colorScheme="red" variant="solid" w="100%" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  leftIcon={<FiLogIn />}
                  colorScheme="green"
                  variant="solid"
                  w="100%"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
