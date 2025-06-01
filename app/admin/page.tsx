// app/admin/page.tsx
'use client';

import { Text, Stat, StatLabel, StatNumber, HStack } from '@chakra-ui/react';

const AdminDashboardPage = () => {
  const stats = [
    { label: "Users", value: 120 },
    { label: "Farms", value: 45 },
    { label: "Crops", value: 200 },
    { label: "Products", value: 75 },
  ];

  return (
    <>
      <Text fontSize="3xl" mb={6} fontWeight="bold">Dashboard Overview</Text>
      <HStack spacing={6} wrap="wrap">
        {stats.map((s, idx) => (
          <Stat key={idx} p={4} bg="white" borderRadius="xl" minW="150px" boxShadow="md">
            <StatLabel>{s.label}</StatLabel>
            <StatNumber>{s.value}</StatNumber>
          </Stat>
        ))}
      </HStack>
    </>
  );
};

export default AdminDashboardPage;
