'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Flex, SimpleGrid, Table, Thead, Tbody, Tr, Th, Td, Input, useToast, Card, CardHeader, CardBody, Heading, Text,
} from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MdDownload } from 'react-icons/md';

interface ProductionReport {
  id: number;
  crop: string;
  quantity: number;
  date: string;
}

const ProductionReportsPage = () => {
  const [reports, setReports] = useState<ProductionReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<ProductionReport[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const toast = useToast();

  useEffect(() => {
    const mockData: ProductionReport[] = [
      { id: 1, crop: "Tomatoes", quantity: 200, date: "2025-04-01" },
      { id: 2, crop: "Potatoes", quantity: 350, date: "2025-04-02" },
      { id: 3, crop: "Cucumbers", quantity: 150, date: "2025-04-03" },
      { id: 4, crop: "Peppers", quantity: 180, date: "2025-04-04" },
      { id: 5, crop: "Lettuce", quantity: 90, date: "2025-04-05" },
      { id: 6, crop: "Tomatoes", quantity: 220, date: "2025-04-06" },
      { id: 7, crop: "Potatoes", quantity: 370, date: "2025-04-07" },
    ];

    setReports(mockData);
    setFilteredReports(mockData);
  }, []);

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      toast({
        title: "Select both dates",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const filtered = reports.filter(r => {
      const reportDate = new Date(r.date);
      return reportDate >= from && reportDate <= to;
    });

    setFilteredReports(filtered);
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Exporting report... (this should trigger file generation)",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const totalQuantity = filteredReports.reduce((acc, report) => acc + report.quantity, 0);
  const totalCrops = new Set(filteredReports.map(r => r.crop)).size;

  return (
    <Flex>

      <Box bgColor={"#FFFFFF"} minHeight="100vh" p={6} flex="1">

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10} mt={20}>
          <Card bg="green.100">
            <CardHeader><Heading size="md">Total Crops</Heading></CardHeader>
            <CardBody><Text fontSize="2xl">{totalCrops}</Text></CardBody>
          </Card>

          <Card bg="gray.300">
            <CardHeader><Heading size="md">Total Quantity</Heading></CardHeader>
            <CardBody><Text fontSize="2xl">{totalQuantity} kg</Text></CardBody>
          </Card>

          <Card bg="green.100">
            <CardHeader><Heading size="md">Reports Count</Heading></CardHeader>
            <CardBody><Text fontSize="2xl">{filteredReports.length}</Text></CardBody>
          </Card>
        </SimpleGrid>

        <Flex gap={4} mb={6} flexWrap="wrap">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="From Date"
          />
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="To Date"
          />
          <Button colorScheme="green" onClick={handleFilter}>
            Filter
          </Button>

          <Button leftIcon={<MdDownload />} bgColor={"gray.300"} onClick={handleDownload}>
            Download Report
          </Button>
        </Flex>

        <Box w="100%" h="300px" mb={10}>
          <ResponsiveContainer>
            <BarChart data={filteredReports}>
              <XAxis dataKey="crop" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#38A169" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead >
              <Tr bgColor={"green.400"}>
                <Th color={"white"}>Crop</Th>
                <Th color={"white"}>Quantity (kg)</Th>
                <Th color={"white"}>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredReports.map((report) => (
                <Tr key={report.id}
                _hover={{ bg: 'green.100' }}
                >
                  <Td>{report.crop}</Td>
                  <Td>{report.quantity}</Td>
                  <Td>{new Date(report.date).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

      </Box>
    </Flex>
  );
};

export default ProductionReportsPage;
