import React from 'react';
import { Facebook, Twitter, Instagram, Github} from 'lucide-react';
const NetflixFooter = () => {
  return (
    <footer className="bg-black text-gray-300 py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex space-x-6 mb-8">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter className="w-6 h-6 hover:text-white cursor-pointer transition-colors" />
          </a>
          <a href="https://github.com/talal4a" target="_blank" rel="noopener noreferrer">
            <Github className="w-6 h-6 hover:text-white cursor-pointer transition-colors" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-white font-medium mb-2">Menu</h3>
            <span className="block text-sm text-gray-400">
              Browse Movies
            </span>
            <span className="block text-sm text-gray-400">
              New & Popular
            </span>
            <span className="block text-sm text-gray-400">
              My List
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-medium mb-2">Help</h3>
            <span className="block text-sm text-gray-400">
              Help Center
            </span>
            <span className="block text-sm text-gray-400">
              FAQ
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-medium mb-2">Legal</h3>
            <span className="block text-sm text-gray-400">
              Privacy Policy
            </span>
            <span className="block text-sm text-gray-400">
              Terms of Service
            </span>
            <span className="block text-sm text-gray-400">
              Contact Us
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-8">
          <p>&copy;2025 CINEVERSE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default NetflixFooter;
