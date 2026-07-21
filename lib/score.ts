// Score de récupération : zones, verdict et couleurs associées.
// Vert = prêt à charger, jaune = récup partielle, rouge = repos.

export type ZoneName = "green" | "yellow" | "red";

export type Zone = {
  name: ZoneName;
  /** Couleur pleine de la zone (anneau, barre de verdict). */
  color: string;
  /** Ombre portée colorée — blur 24px, opacité 35%. */
  glow: string;
};

export function zoneFor(score: number): Zone {
  if (score >= 67)
    return { name: "green", color: "#1E9E52", glow: "rgba(30,158,82,0.35)" };
  if (score >= 34)
    return { name: "yellow", color: "#F2B90D", glow: "rgba(242,185,13,0.35)" };
  return { name: "red", color: "#D6362B", glow: "rgba(214,54,43,0.35)" };
}

export type Verdict = {
  line: string;
  detail: string;
};

export function verdictFor(score: number): Verdict {
  if (score >= 90)
    return {
      line: "Récupération maximale.",
      detail: "Tout est aligné — c'est le jour pour charger lourd.",
    };
  if (score >= 67)
    return {
      line: "Bien récupéré. Tu peux charger.",
      detail: "La marge est là pour une séance lourde.",
    };
  if (score >= 34)
    return {
      line: "Récup partielle. Allège la charge.",
      detail: "Une séance technique vaut mieux qu'une séance lourde.",
    };
  return {
    line: "Dans le rouge. Repos.",
    detail: "Ton corps réclame une vraie nuit avant de recharger.",
  };
}
