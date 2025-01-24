'use client';

import { useEffect } from "react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
  data: {
    originalUrl: string;
  } | null;
};

export default function SlugClient({ data }: Props) {

const exists = data ? 'FOUND' : 'NOT_FOUND';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data?.originalUrl) {
        window.location.href = data.originalUrl
      }
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [data?.originalUrl]);

  if (exists === 'NOT_FOUND') {
    return <div>URL not found</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div>Redirecting to:</div>
      <div className="text-blue-500">{data?.originalUrl}</div>
      <div className="text-sm text-gray-500">You will be redirected in 3 seconds...</div>
    </div>
  );
}