import React from 'react';

export default function AccountLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white pt-8 sm:pt-20 overflow-x-hidden">
      <div className="px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 pt-8 w-full">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-2">
              Account Settings
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Manage your profile and security settings
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
