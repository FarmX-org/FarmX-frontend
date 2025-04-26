'use client';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Image,
  useDisclosure,
  Stack,
  VStack,
  Link,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FiLogIn } from 'react-icons/fi';

const Links = [
  { label: 'Home', href: '/' },
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

  return (
    <Box bg="green.500" px={4} boxShadow="sm" position="fixed" top="0" w="100%" zIndex="1000" >
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

        <HStack spacing={4}>
          <Button
            leftIcon={<FiLogIn />}
            colorScheme="green"
            variant="solid"
            display={{ base: 'none', md: 'inline-flex' }}
          >
            Login
          </Button>

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
              <Button
                leftIcon={<FiLogIn />}
                colorScheme="green"
                variant="solid"
                w="100%"
                mt={4}
              >
                Login
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
