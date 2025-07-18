import React from 'react';
import { Facebook, Twitter, Instagram, Github} from 'lucide-react';
const NetflixFooter = () => {
  return (
    <footer className="bg-black text-gray-300 py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex space-x-6 mb-8">
          <Facebook className="w-6 h-6 hover:text-white cursor-pointer transition-colors" />
          <Instagram className="w-6 h-6 hover:text-white cursor-pointer transition-colors" />
          <Twitter className="w-6 h-6 hover:text-white cursor-pointer transition-colors" />
          <Github className="w-6 h-6 hover:text-white cursor-pointer transition-colors" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <a
              href="#"
              className="block text-sm hover:underline hover:text-white transition-colors"
            >
              FAQ
            </a>
            <a
              href="#"
              className="block text-sm hover:underline hover:text-white transition-colors"
            >
              Investor Relations
            </a>
            <a
              href="#"
              className="block text-sm hover:underline hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="block text-sm hover:underline hover:text-white transition-colors"
            >
              Speed Test
            </a>
          </div>

          <div className="space-y-4">
            <a
              href="#"
              className="block text-sm hover:underline hover:text-white transition-colors"
            >
              Help Center
            </a>
            <a
              href="#"
              className="block text-sm hover:underline hover:text-white transition-colors"
            >
              Jobs
            </a>
          </div>

          <div className="space-y-4">
            <a
              href="#"
              className="block text-sm hover:underline hover:text-white transition-colors"
            >
              Account
            </a>
            <a
              href="#"
              className="block text-sm hover:underline hover:text-white transition-colors"
            >
              Ways to Watch
            </a>
            <a
              href="#"
              className="block text-sm hover:underline hover:text-white transition-colors"
            >
              Corporate Information
            </a>
          </div>

          <div className="space-y-4">
            <a
              href="#"
              className="block text-sm hover:underline hover:text-white transition-colors"
            >
              Media Center
            </a>
            <a
              href="#"
              className="block text-sm hover:underline hover:text-white transition-colors"
            >
              Terms of Use
            </a>
            <a
              href="#"
              className="block text-sm hover:underline hover:text-white transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>

        <div className="mb-8">
          <button className="border border-gray-500 text-gray-300 px-4 py-2 text-sm hover:border-white hover:text-white transition-colors">
            Service Code
          </button>
        </div>

        <div className="text-sm text-gray-500">
          <p>&copy;2025 CINEVERSE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default NetflixFooter;
