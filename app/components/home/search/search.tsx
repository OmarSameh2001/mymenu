'use client'

import { useState, useEffect } from "react";

export default function HomeSearch() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch) {
      console.log('Search API call for:', debouncedSearch);
      // call your API here
    }
  }, [debouncedSearch]);

  return (
    <div className="w-full max-w-md mt-6">
      <label htmlFor="search" className="block text-sm/6 font-medium text-white">
        Search
      </label>
      <div className="mt-2">
        <div className="flex items-center rounded-md bg-white/5 outline-1 -outline-offset-1 outline-gray-600 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-500">
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Search for your favorite restaurant"
            className="block min-w-0 grow bg-gray-800 py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6 min-w-fit"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
