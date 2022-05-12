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
    <>
      <div>
        <h2 className="text-2xl">Releases</h2>
        <p className="text-slate-500 italic">Ordered by most recent</p>
      </div>

      <div
        className="grid grid-cols-[repeat(auto-fit,_minmax(min-content,_150px))] gap-8 justify-center"
        data-testid="releases"
      >
        {releases.map((release) => (
          <Release key={release.id} release={release} />
        ))}
      </div>

      {children}
    </>
  );
}
