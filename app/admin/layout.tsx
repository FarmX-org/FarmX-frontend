import { ReactNode } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import AdminSidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Flex>
      <AdminSidebar />
      <Box flex="1" p={6} bg="gray.50" minH="100vh">
        {children}
      </Box>
    </Flex>
  );
}
