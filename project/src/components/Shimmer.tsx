export function PosterShimmer() {
  return (
    <div className="relative w-[150px] h-[225px] md:w-[180px] md:h-[270px] rounded-lg shimmer-bg flex-shrink-0" />
  );
}

export function RowShimmer({ count = 8 }: { count?: number }) {
  return (
    <div className="flex gap-3 px-4 md:px-12 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <PosterShimmer key={i} />
      ))}
    </div>
  );
}

export function HeroShimmer() {
  return (
    <div className="relative h-[70vh] min-h-[500px] w-full shimmer-bg" />
  );
}

export function BackdropShimmer() {
  return (
    <div className="w-full aspect-video rounded-xl shimmer-bg" />
  );
}
