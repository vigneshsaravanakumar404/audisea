import Link from "next/link";
import logo from "../../public/logo.png";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center p-6 pt-10 bg-[#FBF8F6] border-b-2 border-[#d6d6d6] shadow-sm fixed top-0 left-0 right-0 z-10">
      <Link href="/">
        <div className="flex items-center w-7 cursor-pointer ml-2">
          <img src={logo.src} className="ml-auto mr-auto" alt="Logo" />
        </div>
      </Link>

      <div className="flex gap-8 mr-[10px]">
        <Link href="/about">
          <div className="text-3xl text-[#494a4a] font-['Josefin_Sans'] transition-all duration-300 hover:text-[#96aa97] hover:-translate-y-1 cursor-pointer">
            About
          </div>
        </Link>
        <Link href="/contact">
          <div className="text-3xl text-[#494a4a] font-['Josefin_Sans'] transition-all duration-300 hover:text-[#96aa97] hover:-translate-y-1 cursor-pointer">
            Contact
          </div>
        </Link>
      </div>
    </nav>
  );
}
