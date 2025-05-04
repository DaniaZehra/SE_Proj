'use client'
import dynamic from 'next/dynamic';

// Dynamically load the client component with suspense
const SearchResults = dynamic(() => import('@/components/search-component'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function SearchResultsPage() {
  return (
    <div className="p-4">
      <SearchResults />
    </div>
  );
}
