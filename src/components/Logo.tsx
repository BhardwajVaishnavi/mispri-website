'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex-shrink-0">
      <div className="relative h-10 w-32">
        <Image 
          src="/logo.svg" 
          alt="MISPRI" 
          width={120} 
          height={40} 
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}
