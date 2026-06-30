import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full px-6 py-3 flex justify-between items-center border-b border-[#2a2a2a] bg-[#121212]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="text-xl font-bold text-yellow-400">ATITHI</div>

      <nav className="hidden md:flex gap-8 text-sm text-gray-300">
        <a href="#features" className="hover:text-white">
          Features
        </a>
        <a href="#roles" className="hover:text-white">
          Roles
        </a>
        <a href="#stats" className="hover:text-white">
          Analytics
        </a>
        <a href="#cta" className="hover:text-white">
          Get Started
        </a>
      </nav>

      <Link href="/login">
        <button className="bg-yellow-400 text-black px-4 py-1.5 rounded-[8px] cursor-pointer">
          Login
        </button>
      </Link>
    </header>
  );
}
