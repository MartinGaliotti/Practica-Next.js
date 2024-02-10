'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebouncedCallback } from 'use-debounce';

const WAIT_BETWEEN_CHANGE = 300;

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = useDebouncedCallback((input: string) => {
    const params = new URLSearchParams(searchParams);
    if (input) {
      params.set('query', input);
    } else {
      params.delete('query');
    }
    params.set('currentPage', '1');
    replace(`${pathname}?${params.toString()}`);
  }, WAIT_BETWEEN_CHANGE);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(event) => handleChange(event.target.value)}
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
