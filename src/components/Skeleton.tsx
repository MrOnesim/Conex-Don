/**
 * Bloc de chargement — mêmes angles vifs que le reste du site,
 * avec un balayage lumineux discret (voir `.skeleton` dans globals.css).
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}
