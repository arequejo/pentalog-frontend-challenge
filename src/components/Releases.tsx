import type { Release as ReleaseInterface } from '../types/discogs';
import React from 'react';
import Release from './Release';

interface ReleasesProps {
  releases: ReleaseInterface[];
}

export default function Releases({
  releases,
  children,
}: React.PropsWithChildren<ReleasesProps>) {
  return (
    <div className="mt-8 space-y-8">
      <div>
        <h2 className="text-2xl">Releases</h2>
        <p className="text-slate-500 italic">Ordered by most recent</p>
      </div>

      <div className="grid grid-cols-5 gap-4" data-testid="releases">
        {releases.map((release) => (
          <Release key={release.id} release={release} />
        ))}
      </div>

      {children}
    </div>
  );
}
