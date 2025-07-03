'use client';

import { useEffect, useState } from 'react';

interface MapEmbedProps {
  address: string;
  height?: string;
  width?: string;
  zoom?: number;
  className?: string;
}

export default function MapEmbed({
  address,
  height = '400px',
  width = '100%',
  zoom = 15,
  className = '',
}: MapEmbedProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [mapUrl, setMapUrl] = useState('');
  
  useEffect(() => {
    setIsMounted(true);
    
    // Criar URL do Google Maps
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      setMapUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}&zoom=${zoom}`);
    }
  }, [address, zoom]);
  
  if (!isMounted || !address) return null;
  
  return (
    <div className={`map-container rounded-lg overflow-hidden shadow-md ${className}`} style={{ height, width }}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={mapUrl}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Mapa de localização"
      ></iframe>
    </div>
  );
}
