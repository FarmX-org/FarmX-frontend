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
  useToast
} from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FiLogIn, FiLogOut, FiMessageSquare,FiPlusSquare} from 'react-icons/fi';
import { FaBrain } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTokenExpiration } from './utils/jwt';
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import ChatListener from "@/components/ChatListener";
import { keyframes } from "@emotion/react";
const shake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
  75% { transform: rotate(-10deg); }
  100% { transform: rotate(0deg); }
`;

const shakeAnimation = `${shake} 0.6s infinite`;



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
  const toast = useToast();
const [hasNewMessages, setHasNewMessages] = useState(false);


  const [user, setUser] = useState<{ name: string; avatarUrl: string; roles: string[] } | null>(null);
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    router.push('/');
  };

useEffect(() => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const rolesData = localStorage.getItem('roles');

  if (token) {
    const expiry = getTokenExpiration(token);

    if (expiry && Date.now() > expiry) {
      console.warn('Token expired');
      handleLogout(); 
      return;
    }

    if (userData && rolesData) {
      setUser({
        ...JSON.parse(userData),
        roles: JSON.parse(rolesData),
      });
    }

    if (expiry) {
      const timeout = expiry - Date.now();
      const logoutTimer = setTimeout(() => {
        console.warn('Token expired automatically (timeout)');
        handleLogout();
        toast({
  title: 'Session expired',
  description: 'You have been logged out automatically.',
  status: 'info',
  duration: 4000,
  isClosable: true,
});

      }, timeout);

      return () => clearTimeout(logoutTimer); 
    }
  }
}, []);


  
const isFarmer = user?.roles?.includes('ROLE_FARMER');
const isAdmin = user?.roles?.includes('ROLE_ADMIN');
const isConsumer = user?.roles?.includes('ROLE_CONSUMER');
const isHandler = user?.roles?.includes('ROLE_HANDLER');



  const commonLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const farmerLinks = [
     { label: 'Crops', href: '/crops' },
    { label: 'Store', href: '/store' },
    { label: 'Activity', href: '/activites' },
    { label: 'Farms', href: '/farms' },
  ];

  const adminLinks = [
    { label: 'Dashboard', href: '/admin' },
    
  ];
  const consumerLinks = [
    { label: 'Store', href: '/store' },
    { label: 'Orders', href: '/consumerOrders' },

  ];
  const handlerLinks = [
    { label: 'Orders', href: '/handler' },
  ];

  const displayedLinks = [
    ...commonLinks,
    ...(isFarmer ? farmerLinks : []),
    ...(isAdmin ? adminLinks : []),
    ...(isConsumer ? consumerLinks : []),
    ...(isHandler ? handlerLinks : []),
  ];

 useEffect(() => {
  const userData = localStorage.getItem("user");
  if (!userData) return;

  let currentUser;
  try {
    currentUser = JSON.parse(userData);
    if (!currentUser?.username) return;
  } catch (e) {
    console.error("Failed to parse user data", e);
    return;
  }

  const chatsRef = collection(db, "chats");

  const unsubscribe = onSnapshot(
    query(chatsRef, where("participants", "array-contains", currentUser.username)),
    (snapshot) => {
      let foundNewMessage = false;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const messages = data.messages || [];

        if (Array.isArray(messages) && messages.length > 0) {
          const lastMessage = messages[messages.length - 1];

          if (
            lastMessage.sender !== currentUser.username &&
            (!lastMessage.seenBy || !lastMessage.seenBy.includes(currentUser.username))
          ) {
            foundNewMessage = true;
          }
        }
      });

      setHasNewMessages(foundNewMessage);
    }
  );

  return () => unsubscribe();
}, []);


  return (
    <Box bg="green.500" px={4} boxShadow="sm" position="fixed" top="0" w="100%" zIndex="1000">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>
          <Image src="/images/Logo_bold.png" alt="Logo" height="100px" />
        </Box>

        <HStack as="nav" spacing={4} color="white" display={{ base: 'none', md: 'flex' }}>
          {displayedLinks.map((link) => (
            <NavLink key={link.label} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </HStack>

        <HStack spacing={4} color="white">
          {user && isFarmer && (
            <Tooltip label="Ai Suggestion" hasArrow>
              <Link href="/dashboard" px={2}>
                <FaBrain size={20} />
              </Link>
            </Tooltip>
          )}
          {user && (
            <>
  <Tooltip label="Messages" hasArrow>
  <Link href="/chatSel" px={2} position="relative">
    {hasNewMessages ? (
      <Box animation={shakeAnimation}>
        <FiMessageSquare size={22} color="white" />
      </Box>
    ) : (
      <FiMessageSquare size={22} />
    )}
  </Link>
</Tooltip>
<Link href="/postPage" px={2}>
  <Tooltip label="Post" hasArrow>
    <FiPlusSquare size={22} />
  </Tooltip>
</Link>
</>

)}



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
                <MenuItem onClick={() => router.push('/profile')} color={'green'}>Profile</MenuItem>
                <MenuItem icon={<FiLogOut />} onClick={handleLogout} color={'green'}>
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
              {displayedLinks.map((link) => (
                <NavLink key={link.label} href={link.href}>
                  {link.label}
                </NavLink>
              ))}

              {user ? (
                <>
                  <Button  variant="outline" w="100%" onClick={() => router.push('/profile')}>
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
            <ChatListener onNewMessage={() => setHasNewMessages(true)} />

    </Box>
  );
}
