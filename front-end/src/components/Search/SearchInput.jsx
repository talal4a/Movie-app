import { useState } from "react";

export default function SearchInput({ value, onChange, onClear, loading }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <div
        className={`relative transition-all duration-500 ease-out ${
          isFocused ? 'transform scale-[1.02]' : ''
        }`}
      >
        <div
          className={`relative flex items-center bg-gray-900/90 backdrop-blur-xl rounded-xl border transition-all duration-500 ${
            isFocused
              ? 'border-red-500 shadow-2xl shadow-red-500/20'
              : 'border-gray-700 hover:border-gray-600'
          }`}
        >
          <div className="pl-6 pr-4">
            <svg
              className={`w-6 h-6 transition-all duration-300 ${
                isFocused ? 'text-red-500' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for movies"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 bg-transparent text-white placeholder-gray-400 py-5 pr-4 outline-none text-lg font-medium"
          />
          {value && (
            <button
              onClick={onClear}
              className="pr-6 pl-2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          {loading && (
            <div className="pr-6 pl-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
