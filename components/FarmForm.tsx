"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  Spinner,
  Text,
  VStack,
  Flex,
  useBreakpointValue,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import dynamic from "next/dynamic";
import { useMapEvent } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

const FarmFormPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const isEditMode = !!id;

  const [farmName, setFarmName] = useState("");
  const [farmArea, setFarmArea] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationCoords, setLocationCoords] = useState<[number, number] | null>(null);
  const [soilType, setSoilType] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const router = useRouter();

  const MapClickHandler = ({ onClick }: { onClick: (e: any) => void }) => {
    useMapEvent("click", onClick);
    return null;
  };

  useEffect(() => {
     if (isEditMode) {
    setLoading(true);
    apiRequest(`/farms/${id}`)
      .then((data) => {
        setFarmName(data.name || "");
        setFarmArea(data.areaSize !== undefined ? data.areaSize.toString() : "");
        setSoilType(data.soilType || "");

        if (data.latitude && data.longitude) {
          setLocationCoords([data.latitude, data.longitude]);
          setLocationName(`${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`);
        }

      })
        .catch((error) => {
          toast({
            title: "Failed to load farm data",
            description: error?.message ?? String(error),
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleMapClick = async (e: any) => {
    const { lat, lng } = e.latlng;
    setLocationCoords([lat, lng]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const name = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setLocationName(name);
    } catch (err) {
      toast({
        title: "Failed to fetch location name",
        status: "warning",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      let base64Image: string | null = null;

      if (imageFile) {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      const payload = {
        name: farmName,
        areaSize: parseFloat(farmArea),
        soil_type: soilType,
        locationName: locationName,
        licenseDocumentUrl: base64Image,
        latitude: locationCoords?.[0],
        longitude: locationCoords?.[1],
      };

      if (isEditMode) {
        await apiRequest(`/farms/${id}`, "PUT", payload);
        toast({
          title: "Farm updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await apiRequest("/farms", "POST", payload);
        toast({
          title: "Farm added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      router.push("/farms");
    } catch (error: any) {
      toast({
        title: "Failed to save farm",
        description: error?.message ?? String(error),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box minH="100vh" px={[2, 4, 8]} py={8} bg="gray.50" mt={20}>
      <Heading mb={6} color="green.700" textAlign="center">
        {isEditMode ? "Edit Farm" : "Add New Farm"}
      </Heading>

      {loading && isEditMode ? (
        <Flex justify="center">
          <Spinner color="green.500" />
        </Flex>
      ) : (
        <Flex
          direction={isMobile ? "column" : "row"}
          gap={6}
          align="start"
          justify="center"
          flexWrap="wrap"
        >
          <Box flex="1" minW={["100%", "100%", "60%"]} height={["300px", "400px", "500px"]} rounded="lg" overflow="hidden" boxShadow="md">
            <MapContainer
              center={locationCoords || [32.0, 35.9]}
              zoom={10}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locationCoords && <Marker position={locationCoords} />}
              <MapClickHandler onClick={handleMapClick} />
            </MapContainer>
          </Box>

          <Box flex="1" minW={["100%", "100%", "35%"]} bg="white" p={6} rounded="md" boxShadow="md">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Farm Name</FormLabel>
                  <Input value={farmName} onChange={(e) => setFarmName(e.target.value)} required />
                </FormControl>

                <FormControl>
                  <FormLabel>Area (dunum)</FormLabel>
                  <Input
                    type="number"
                    value={farmArea}
                    onChange={(e) => setFarmArea(e.target.value)}
                    required
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Soil Type</FormLabel>
                  <Select
                    placeholder="Select soil type"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                  >
                    <option value="clay">Clay</option>
                    <option value="sandy">Sandy</option>
                    <option value="silt">Silt</option>
                    <option value="peat">Peat</option>
                    <option value="chalk">Chalk</option>
                    <option value="loam">Loam</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Farm Image</FormLabel>
                  <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                </FormControl>

                <FormControl>
                  <FormLabel>Location (Auto-filled from map)</FormLabel>
                  <Input
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Click on map to fill this"
                  />
                  {locationName && (
                    <Text mt={1} color="gray.500" fontSize="sm">
                      📍 {locationName}
                    </Text>
                  )}
                </FormControl>

                <Button colorScheme="green" type="submit" width="full" isLoading={loading}>
                  {isEditMode ? "Update Farm" : "Add Farm"}
                </Button>
              </VStack>
            </form>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default FarmFormPage;
