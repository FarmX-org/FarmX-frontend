'use client';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter, Button,
  FormControl, FormLabel, Input, VStack, Text, Box,
  useToast, Spinner, Flex
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import dynamic from "next/dynamic";
import { useMapEvent } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ مهم نصدّرها عشان تستخدم بـ dynamic
export interface FarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmId?: number | null;
  onSuccess?: () => void;
}

const FarmModal = ({ isOpen, onClose, farmId, onSuccess }: FarmModalProps) => {
  const isEditMode = !!farmId;
  const [farmName, setFarmName] = useState("");
  const [farmArea, setFarmArea] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationCoords, setLocationCoords] = useState<[number, number] | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const MapClickHandler = ({ onClick }: { onClick: (e: any) => void }) => {
    useMapEvent("click", onClick);
    return null;
  };

  const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
  const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
  const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  useEffect(() => {
    if (isEditMode && farmId) {
      setLoading(true);
      apiRequest(`/farms/${farmId}`)
        .then((data) => {
          setFarmName(data.name || "");
          setFarmArea(data.areaSize?.toString() || "");
          setLocationName(data.locationName || "");
          if (data.latitude && data.longitude) {
            setLocationCoords([data.latitude, data.longitude]);
          }
          setImagePreview(data.licenseDocumentUrl || null);
        })
        .catch(() =>
          toast({ title: "Failed to load farm", status: "error", duration: 3000 })
        )
        .finally(() => setLoading(false));
    }
  }, [farmId]);

  const handleMapClick = async (e: any) => {
    const { lat, lng } = e.latlng;
    setLocationCoords([lat, lng]);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      setLocationName(data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } catch {
      toast({ title: "Failed to get location name", status: "warning" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let base64Image = imagePreview;

      if (imageFile) {
        base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      const payload = {
        name: farmName,
        areaSize: parseFloat(farmArea),
        locationName,
        licenseDocumentUrl: base64Image,
        latitude: locationCoords?.[0],
        longitude: locationCoords?.[1],
      };

      if (isEditMode && farmId) {
        await apiRequest(`/farms/${farmId}`, "PUT", payload);
        toast({ title: "Farm updated", status: "success" });
      } else {
        await apiRequest("/farms", "POST", payload);
        toast({ title: "Farm created", status: "success" });
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      toast({ title: "Failed to save farm", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditMode ? "Edit Farm" : "Add Farm"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner />
          ) : (
            <form onSubmit={handleSubmit}>
              <Flex direction={["column", "column", "row"]} gap={4}>
                <Box flex="1" height="300px">
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

                <VStack flex="1" spacing={4}>
                  <FormControl>
                    <FormLabel>Farm Name</FormLabel>
                    <Input value={farmName} onChange={(e) => setFarmName(e.target.value)} required />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Area (dunum)</FormLabel>
                    <Input type="number" value={farmArea} onChange={(e) => setFarmArea(e.target.value)} required />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Farm Image</FormLabel>
                    <Input type="file" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                    {imagePreview && (
                      <Box>
                        <Text fontSize="sm" mt={2}>Preview:</Text>
                        <img src={imagePreview} alt="Preview" style={{ borderRadius: "8px", width: "100%" }} />
                      </Box>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Location Name</FormLabel>
                    <Input value={locationName} onChange={(e) => setLocationName(e.target.value)} />
                    {locationName && (
                      <Text fontSize="sm" mt={1} color="gray.500">📍 {locationName}</Text>
                    )}
                  </FormControl>
                </VStack>
              </Flex>

              <ModalFooter px={0} mt={4}>
                <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
                <Button colorScheme="green" type="submit" isLoading={loading}>
                  {isEditMode ? "Update" : "Add"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FarmModal;
