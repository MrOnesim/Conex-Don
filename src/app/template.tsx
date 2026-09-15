import type { ReactNode } from "react";

/**
 * Transition de page : le layout (et donc le lecteur audio) persiste,
 * seul le contenu est réanimé à chaque navigation.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
