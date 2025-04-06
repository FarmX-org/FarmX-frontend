'use client'
import React from 'react'
import {Box, Flex, Spacer, Link, Button, Image} from '@chakra-ui/react'

function Navbar() {
  return (
    <Box px={4} py={3} color="white" bgColor={"rgb(9, 111, 9)"} position="fixed" width="100%" zIndex="10" opacity={0.6}>
      <Flex align="center">
        <Box fontWeight="bold" fontSize="xl" height="60px" mt={-12} >
          <Image src="./images/Logo_bold.png" alt="Logo" width={150} maxH={"100px"} />
        </Box>
        <Spacer />
        <Flex gap={4}>
          <Link href="/" _hover={{ textDecoration: "none", color: "gray.200" }}>
            Home
          </Link>
          <Link href="/about" _hover={{ textDecoration: "none", color: "gray.200" }}>
            About
          </Link>
          <Link href="/contact" _hover={{ textDecoration: "none", color: "gray.200" }}>
            Contact
          </Link>
        </Flex>
        <Spacer />
        <Button colorScheme="teal" variant="solid">
          Login
        </Button>
      </Flex>
    </Box>

  )
}

export default Navbar