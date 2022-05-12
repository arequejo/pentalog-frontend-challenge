import type { Release as ReleaseInterface } from '../types/discogs';

interface ReleaseProps {
  release: ReleaseInterface;
}

export default function Release({ release }: ReleaseProps) {
  return (
    <div
      key={release.id}
      className="aspect-square flex flex-col items-center justify-center"
      data-testid="release"
    >
      <img
        src={release.thumb}
        alt={release.title}
        className="shadow-xl transition-transform hover:scale-105 rounded"
      />

      <div className="mt-4 text-center">
        <span className="font-semibold">{release.title}</span> &middot;{' '}
        <span className="text-slate-500">{release.year}</span>
      </div>
    </div>
  );
}
