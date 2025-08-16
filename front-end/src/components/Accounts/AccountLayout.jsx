import React from 'react';
export default function AccountLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="fixed top-20 left-0 right-0 bg-black z-40 py-2 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => window.history.back()}
            className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
        </div>
      </div>
      <div className="px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-4 pt-8">
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
