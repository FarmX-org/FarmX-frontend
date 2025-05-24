'use client';
import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Link,
  IconButton,
} from '@chakra-ui/react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: React.ReactElement;
  label: string;
  href: string;
}) => {
  return (
    <IconButton
      as="a"
      href={href}
      aria-label={label}
      icon={children}
      variant="ghost"
      color="white"
      _hover={{ bg: 'whiteAlpha.300' }}
      size="lg"
      isRound
    />
  );
};

export default function Footer() {
  return (
    <Box
      bgGradient="linear(to-r, green.600, green.500)"
      color="white"
      mt={16}
      pt={10}
      pb={6}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        spacing={6}
        textAlign="center"
      >
        <chakra.h1 fontSize="2xl" fontWeight="bold">
          Samaa's Farm 
        </chakra.h1>

        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} justify="center">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </Stack>

        <Stack direction="row" spacing={6} justify="center">
          <SocialButton label="Facebook" href="#">
            <FaFacebook />
          </SocialButton>
          <SocialButton label="Instagram" href="#">
            <FaInstagram />
          </SocialButton>
          <SocialButton label="LinkedIn" href="#">
            <FaLinkedin />
          </SocialButton>
        </Stack>

        <Text fontSize="sm" mt={4}>
          © {new Date().getFullYear()} Samaa's Farm. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}
