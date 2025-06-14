'use client';
import dynamic from 'next/dynamic';

const FarmForm = dynamic(() => import('@/components/FarmForm'), { ssr: false });

export default function FarmFormPageWrapper() {
  return <FarmForm />;
}
