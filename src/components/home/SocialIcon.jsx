import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const socialLinks = [
  {
    href: "https://www.linkedin.com/in/chirag-arya-53350b23b",
    icon: <Linkedin size={40} />,
  },
  {
    href: "https://x.com/chiragarya36267?t=IMxIB-RX0N_Z8XjFmDvAlg&s=08",
    icon: <Twitter size={40} />,
  },
  {
    href: "https://www.instagram.com/chirag_arya_123?utm_source=qr&igsh=MTdraHZyM2VzMG1yOQ==",
    icon: <Instagram size={40} />,
  },
  {
    href: "https://www.facebook.com/profile.php?id=100091287887073&mibextid=rS40aB7S9Ucbxw6v",
    icon: <Facebook size={40} />,
  },
];

const SocialIcon = () => {
  return (
    <>
      {/* 🌐 CLEAN MODERN SOCIAL ICON BAR — Using MAP */}
      <div className="flex justify-center gap-8">
        {socialLinks.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            target="_blank"
            className="
        h-20 w-20 flex items-center justify-center 
        rounded-2xl border border-white/20 
        bg-white/10 backdrop-blur-xl text-gray-700
        hover:bg-gray-900 hover:text-white
        transition-all duration-300
      "
          >
            <div className="h-12 w-12 flex items-center justify-center">
              {item.icon}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default SocialIcon;
