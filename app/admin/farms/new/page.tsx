'use client';
import dynamic from "next/dynamic";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";

type FarmModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FarmModal = dynamic<FarmModalProps>(() => import("@/components/FarmForm"), {
  ssr: false,
});

export default function FarmFormPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen(); 
  }, []);

  return (
    <FarmModal isOpen={isOpen} onClose={onClose} />
  );
}
