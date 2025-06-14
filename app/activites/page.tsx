'use client';
import React, { useState, useEffect } from "react";
import {
  Box, Button, Flex, Input, Select, Textarea, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useToast
} from "@chakra-ui/react";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import activityGif from "../../public/images/activity.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});


interface Activity {
  id: number;
  type: string;
  crop: string;
  date: string;
  notes: string;
}

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      type: "Irrigation",
      crop: "Tomato",
      date: new Date().toISOString(),
      notes: "Irrigated field A.",
    },
    {
      id: 2,
      type: "Fertilization",
      crop: "Wheat",
      date: new Date().toISOString(),
      notes: "Added nitrogen fertilizer.",
    },
  ]);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({});
  const [editActivity, setEditActivity] = useState<Activity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const toast = useToast();

  const handleSave = () => {
    if (newActivity.type && newActivity.crop && newActivity.date) {
      const newAct: Activity = {
        id: activities.length + 1,
        type: newActivity.type,
        crop: newActivity.crop,
        date: newActivity.date,
        notes: newActivity.notes || "",
      };
      setActivities(prev => [...prev, newAct].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setNewActivity({});
      onClose();
      toast({
        title: "Activity Added!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Please fill all fields!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditSave = () => {
    if (editActivity) {
      setActivities(prev =>
        prev.map(act => act.id === editActivity.id ? editActivity : act)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
      setEditActivity(null);
      onEditClose();
      toast({
        title: "Activity Updated!",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = (id: number) => {
    setActivities(prev => prev.filter(act => act.id !== id));
    toast({
      title: "Activity Deleted!",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const filteredActivities = activities.filter(activity =>
    activity.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);


  return (
    <Flex direction="column" bg="#f9fafb" minHeight="100vh" p={8}>
       <Box w={{ base: "150px", md: "200px" }} >
    <Lottie
    animationData={activityGif}
    loop={true}
      style={{ width: "100%", height: "auto", marginTop: "40px" }}
    />
  </Box>
      <Flex mb={6} gap={4} align="center" mt={10}>
        <Input
          placeholder="Search by Crop Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          bg="white"
          maxW="300px"
          shadow="md"
        />
        <Button
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          colorScheme="green"
          size="lg"
          leftIcon={<MdAdd />}
          onClick={onOpen}
        >
          Add Activity
        </Button>
      </Flex>
     

      <Flex wrap="wrap" gap={6}>
        {filteredActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ flex: "1 1 300px" }}
          >
            <Box
              bg="white"
              p={5}
              borderRadius="xl"
              shadow="md"
              _hover={{ shadow: "xl", transform: "scale(1.02)", transition: "all 0.3s" }}
              transition="all 0.3s"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Box fontWeight="bold" fontSize="xl">
                  {activity.type}
                </Box>
                <Flex gap={2}>
                  <Button size="sm" colorScheme="green" onClick={() => { setEditActivity(activity); onEditOpen(); }}>
                    <MdEdit />
                  </Button>
                  <Button size="sm" colorScheme="gray" onClick={() => handleDelete(activity.id)}>
                    <MdDelete />
                  </Button>
                </Flex>
              </Flex>
              <Box color="gray.600" fontSize="md" mb={1}>
                Crop: {activity.crop}
              </Box>
              <Box color="gray.500" fontSize="sm" mb={2}>
              {isClient ? new Date(activity.date).toLocaleString() : ""}
              </Box>
              <Box color="gray.700" fontSize="sm">
                {activity.notes}
              </Box>
            </Box>
          </motion.div>
        ))}
      </Flex>
     
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius="lg" p={2}>
          <ModalHeader>Add New Activity</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Select Activity Type"
              mb="3"
              value={newActivity.type || ""}
              onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
            >
              <option value="Irrigation">Irrigation</option>
              <option value="Fertilization">Fertilization</option>
              <option value="Harvesting">Harvesting</option>
              <option value="Pesticide Spraying">Pesticide Spraying</option>
            </Select>

            <Input
              placeholder="Crop Name"
              mb="3"
              value={newActivity.crop || ""}
              onChange={(e) => setNewActivity({ ...newActivity, crop: e.target.value })}
            />

            <Input
              type="datetime-local"
              mb="3"
              value={newActivity.date || ""}
              onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
            />

            <Textarea
              placeholder="Notes"
              value={newActivity.notes || ""}
              onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent borderRadius="lg" p={2}>
          <ModalHeader>Edit Activity</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editActivity && (
              <>
                <Select
                  placeholder="Select Activity Type"
                  mb="3"
                  value={editActivity.type}
                  onChange={(e) => setEditActivity({ ...editActivity, type: e.target.value })}
                >
                  <option value="Irrigation">Irrigation</option>
                  <option value="Fertilization">Fertilization</option>
                  <option value="Harvesting">Harvesting</option>
                  <option value="Pesticide Spraying">Pesticide Spraying</option>
                </Select>

                <Input
                  placeholder="Crop Name"
                  mb="3"
                  value={editActivity.crop}
                  onChange={(e) => setEditActivity({ ...editActivity, crop: e.target.value })}
                />

                <Input
                  type="datetime-local"
                  mb="3"
                  value={editActivity.date.slice(0, 16)}
                  onChange={(e) => setEditActivity({ ...editActivity, date: e.target.value })}
                />

                <Textarea
                  placeholder="Notes"
                  value={editActivity.notes}
                  onChange={(e) => setEditActivity({ ...editActivity, notes: e.target.value })}
                />
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleEditSave}>
              Save Changes
            </Button>
            <Button onClick={onEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Flex>
  );
};

export default ActivitiesPage;
