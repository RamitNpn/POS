import { Clock, Home, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] border-t border-[#2a2a2a] text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-white text-xl font-bold">DineFlow</h2>
          <p className="text-sm mt-3 leading-relaxed text-gray-400">
            Premium restaurant management and dining experience platform.
            Designed for modern restaurants with fast, smart and elegant operations.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#hero" className="hover:text-yellow-400">Home</a></li>
            <li><a href="#menu" className="hover:text-yellow-400">Menu</a></li>
            <li><a href="#about" className="hover:text-yellow-400">About</a></li>
            <li><a href="#reviews" className="hover:text-yellow-400">Reviews</a></li>
            <li><a href="#reservation" className="hover:text-yellow-400">Reservation</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li> <Home className="inline-block h-4 text-blue-400 mr-2" /> New Baneshwor, Kathmandu</li>
            <li> <Phone className="inline-block h-4 text-green-400 mr-2" /> +977-98XXXXXXXX</li>
            <li> <Mail className="inline-block h-4 text-red-400 mr-2" /> support@dineflow.com</li>
            <li> <Clock className="inline-block h-4 text-white mr-2" /> 10:00 AM - 10:00 PM</li>
          </ul>
        </div>

        {/* Social / Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-3">Stay Connected</h3>
          <p className="text-sm mb-3">
            Subscribe for offers and updates.
          </p>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm outline-none"
            />
            <button className="bg-yellow-400 text-black px-4 rounded font-semibold">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2a2a2a] py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} DineFlow. All rights reserved. | CornorTech Pvt. Ltd.
      </div>
    </footer>
  );
}