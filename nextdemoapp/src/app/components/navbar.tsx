"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const pathName = usePathname();
  return (
    <nav>
      <Link href="/" className={pathName === "/" ? "font-bold mr-4" : "text-white mr-4"}>
        Home
      </Link>
      <Link href="/about" className={pathName === "/about" ? "font-bold mr-4" : "text-white mr-4"}>
        About
      </Link>
      <Link href="/products/1" className={pathName.startsWith("/products/1") ? "font-bold mr-4" : "text-white mr-4"}>
        Product
      </Link>
    </nav>
  );
};
