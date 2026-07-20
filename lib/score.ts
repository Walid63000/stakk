// Score du jour et verdict associé.
// Le verdict est court, direct, sans emphase gratuite.

export type Verdict = {
  line: string;
  detail: string;
};

export function verdictFor(score: number): Verdict {
  if (score >= 90)
    return {
      line: "Jour de forme maximale.",
      detail: "Tout est aligné. C'est le moment de charger.",
    };
  if (score >= 75)
    return {
      line: "Solide. Tu tiens le rythme.",
      detail: "Ta régularité paie — la charge peut monter.",
    };
  if (score >= 50)
    return {
      line: "Correct, sans plus.",
      detail: "Une séance propre aujourd'hui te remet dans le vert.",
    };
  if (score >= 25)
    return {
      line: "Le rythme se casse.",
      detail: "Reviens à une séance courte, mais reviens.",
    };
  return {
    line: "À l'arrêt.",
    detail: "La pile est vide. Une seule séance relance tout.",
  };
}
