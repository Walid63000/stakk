// Score de récupération : zones, verdict et couleurs associées.
// Vert = prêt à charger, jaune = récup partielle, rouge = repos.

export type ZoneName = "green" | "yellow" | "red";

export type Zone = {
  name: ZoneName;
  /** Couleur pleine de la zone (anneau, barre de verdict). */
  color: string;
  /** Fin du dégradé de l'anneau, dans le sens de progression. */
  color2: string;
  /** Ombre portée colorée — blur 30px, opacité 25%. */
  glow: string;
  /** Mot d'état dans l'anneau, sous le chiffre. */
  word: string;
};

export function zoneFor(score: number): Zone {
  if (score >= 67)
    return {
      name: "green",
      color: "#1E9E52",
      color2: "#27C264",
      glow: "rgba(30,158,82,0.25)",
      word: "READY.",
    };
  if (score >= 34)
    return {
      name: "yellow",
      color: "#F2B90D",
      color2: "#FFD23F",
      glow: "rgba(242,185,13,0.25)",
      word: "STEADY.",
    };
  return {
    name: "red",
    color: "#D6362B",
    color2: "#F0564A",
    glow: "rgba(214,54,43,0.25)",
    word: "REST.",
  };
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
