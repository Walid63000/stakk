// Score de récupération : zones et couleurs associées.
// Les textes (mot d'état, verdicts) vivent dans messages/*.json.

export type ZoneName = "green" | "yellow" | "red";

export type Zone = {
  name: ZoneName;
  /** Couleur pleine de la zone (anneau, barre de verdict). */
  color: string;
  /** Fin du dégradé de l'anneau, dans le sens de progression. */
  color2: string;
  /** Ombre portée colorée — blur 30px, opacité 25%. */
  glow: string;
};

export function zoneFor(score: number): Zone {
  if (score >= 67)
    return {
      name: "green",
      color: "#1E9E52",
      color2: "#27C264",
      glow: "rgba(30,158,82,0.25)",
    };
  if (score >= 34)
    return {
      name: "yellow",
      color: "#F2B90D",
      color2: "#FFD23F",
      glow: "rgba(242,185,13,0.25)",
    };
  return {
    name: "red",
    color: "#D6362B",
    color2: "#F0564A",
    glow: "rgba(214,54,43,0.25)",
  };
}
