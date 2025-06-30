import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import HeaderClient from './header-client';

interface HeaderProps {
  categories?: any[];
  blogSettings?: {
    name: string;
    description: string;
    logo: string;
  };
}

export default function Header({ categories = [], blogSettings }: HeaderProps) {
  return (
    <HeaderClient categories={categories} blogSettings={blogSettings} />
  );
}
