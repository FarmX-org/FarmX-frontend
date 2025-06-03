'use client';

import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  useToast,
  FormControl,
  FormLabel,
  Heading,
  Flex,
  Stack,
  CardBody,
  Tag,
  Card,
  
} from "@chakra-ui/react";
import { apiRequest } from "@/lib/api";
import FarmModal from "@/components/admin/FarmModal";
import { motion } from "framer-motion";
const MotionCard = motion(Card);



interface Farm {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  areaSize: number;
  soilType: string;
  rating: number;
  ratingCount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  licenseDocumentUrl: string;
  rejectionReason?: string;
}

const statusTabs = ["PENDING", "APPROVED", "REJECTED"] as const;

export default function AdminFarmManagementPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  const rejectionModal = useDisclosure();
  const farmModal = useDisclosure();
  const toast = useToast();
  const [locationNames, setLocationNames] = useState<Record<number, string>>({});

useEffect(() => {
  const fetchLocationNames = async () => {
    const updated: Record<number, string> = {};

    await Promise.all(
      farms.map(async (farm) => {
        const { latitude, longitude, id } = farm;
        if (latitude && longitude) {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            updated[id] = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          } catch {
            updated[id] = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          }
        }
      })
    );

    setLocationNames(updated);
  };

  if (farms.length > 0) fetchLocationNames();
}, [farms]);


  const fetchFarms = async () => {
    try {
      const data = await apiRequest("/farms", "GET");
      setFarms(data);
    } catch (error: any) {
      toast({ title: "Failed to load farms", status: "error" });
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const changeStatus = async (id: number, status: string, reason: string | null = null) => {
    try {
      const query = new URLSearchParams({ status });
      if (reason) query.append("reason", reason);

      await apiRequest(`/farms/${id}/status?${query.toString()}`, "PUT");

      toast({ title: `Farm ${status.toLowerCase()}`, status: "success" });
      fetchFarms();
      rejectionModal.onClose();
      setRejectionReason("");
    } catch (error: any) {
      toast({ title: error.message || "Action failed", status: "error" });
    }
  };

  const handleReject = (id: number) => {
    setSelectedFarmId(id);
    rejectionModal.onOpen();
  };

  const handleEdit = (farmId: number) => {
    setSelectedFarmId(farmId);
    farmModal.onOpen();
  };

  const handleAdd = () => {
    setSelectedFarmId(null);
    farmModal.onOpen();
  };

  const handleDelete = async (id: number) => {
    try {
      await apiRequest(`/farms/${id}`, "DELETE");
      toast({ title: "Farm deleted", status: "success" });
      fetchFarms();
    } catch (error: any) {
      toast({ title: error.message || "Delete failed", status: "error" });
    }
  };

  return (
    <Box p={6} mt={20}>
     {/* <Button colorScheme="green" mb={4} onClick={handleAdd}>Add Farm</Button> */} 
 <Heading size="lg" color="green.600" mb={4}>
      Farm Management
    </Heading>
      <Tabs index={activeTab} onChange={setActiveTab}>
        <TabList>
          {statusTabs.map((status) => (
            <Tab key={status}>{status}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {statusTabs.map((status) => {
            const filtered = farms.filter((farm) => farm.status === status);
            return (
            <TabPanel key={status}>
  {filtered.length === 0 ? (
    <Flex direction="column" align="center" justify="center" mt={10}>
      <Text fontSize="lg" color="gray.500" mb={4}>
        No farms available for this status.
      </Text>
      <Text fontSize="2xl">🌾</Text>
    </Flex>
  ) : (
    <Flex wrap="wrap" gap={6} mt={4}>
      {filtered.map((farm, i) => (
        <MotionCard
                    key={farm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    bg="whiteAlpha.800"
                    backdropFilter="blur(10px)"
                    boxShadow="lg"
                    borderRadius="2xl"
                    maxW={"sm"}
                    _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
                  >
                    <CardBody>
                      <Stack spacing={3}>
                        <Heading fontSize="xl" color="green.700">{farm.name}</Heading>
                        {farm.licenseDocumentUrl && (
  <Box borderRadius="lg" overflow="hidden" height="180px">
    <img
      src={farm.licenseDocumentUrl}
      alt={`${farm.name} License`}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </Box>
)}
                    
                        <Text><strong>Soil:</strong> {farm.soilType}</Text>
                        <Text whiteSpace="normal" wordBreak="break-word"><strong>Location:</strong> {locationNames[farm.id] || "Loading..."}</Text>
                        <Text><strong>Area:</strong> {farm.areaSize} dunums</Text>
                        <Text><strong>Rating:</strong> {farm.rating.toFixed(2)} ({farm.ratingCount})</Text>

                        
                        {farm.status === "REJECTED" && farm.rejectionReason && (
                          <Tag colorScheme="red">Reason: {farm.rejectionReason}</Tag>
                        )}
                        <Flex gap={2} flexWrap="wrap">
                          {farm.status === "PENDING" && (
                            <>
                              <Button size="sm" colorScheme="green" onClick={() => changeStatus(farm.id, "APPROVED")}>Approve</Button>
                              <Button size="sm" colorScheme="green" onClick={() => { setSelectedFarmId(farm.id); rejectionModal.onOpen(); }}>Reject</Button>
                            </>
                          )}
                          <Button size="sm" colorScheme="green" variant="outline" onClick={() => { setSelectedFarmId(farm.id); farmModal.onOpen(); }}>Edit</Button>
                          <Button size="sm" colorScheme="green" variant="outline" onClick={async () => {
                            await apiRequest(`/farms/${farm.id}`, "DELETE");
                            toast({ title: "Farm deleted", status: "success" });
                            fetchFarms();
                          }}>Delete</Button>
                        </Flex>
                      </Stack>
                    </CardBody>
                  </MotionCard>
      ))}
    </Flex>
  )}
</TabPanel>

            );
          })}
        </TabPanels>
      </Tabs>

      <Modal isOpen={rejectionModal.isOpen} onClose={rejectionModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Farm</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Reason for rejection</FormLabel>
              <Textarea
                placeholder="Enter reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={rejectionModal.onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() =>
                selectedFarmId && changeStatus(selectedFarmId, "REJECTED", rejectionReason)
              }
            >
              Confirm Reject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <FarmModal
        isOpen={farmModal.isOpen}
        onClose={farmModal.onClose}
        farmId={selectedFarmId}
        onSuccess={fetchFarms}
      />
    </Box>
  );
}
