"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ChakraProvider } from "@chakra-ui/react";
import Notifications from "@/components/Notifications";
import Footer from "@/components/Footer";
import "leaflet/dist/leaflet.css";
import { useState , useEffect} from "react";
import ChatListener from "@/components/ChatListener"; 

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
   useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); 
  }, []);


  const hideNotifications = pathname === "/login" || pathname === "/signup"|| !isLoggedIn || pathname === "/admin" ;

  return (
    <html lang="en">
      <body className={inter.variable}>
        <ChakraProvider>
          <Navbar />
            <ChatListener /> 
          {!hideNotifications ? (
            <Notifications>{children}</Notifications>
          ) : (
            children
          )}
          <Footer />
        </ChakraProvider>
      </body>
    </html>
  );
}
