// Transition entre écrans : fade + translation 12px, 300ms.
// Un template se remonte à chaque navigation, l'animation rejoue donc
// à chaque changement d'écran.

export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
