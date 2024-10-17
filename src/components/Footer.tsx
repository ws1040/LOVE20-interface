// src/components/Header.tsx
import React from 'react';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="p-4 mt-4 bg-white text-center shadow">
    © {new Date().getFullYear()} LIFE20 DApp
    </footer>
  );
};

export default Footer;



