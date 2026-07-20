# Stakk

Empile tes séances. Monte ton score.

App mobile-first (Next.js 14, App Router, Tailwind) construite autour d'un
score quotidien, façon Whoop : un chiffre, un verdict, et la régularité
qui s'empile.

## Design system

Le design est une exigence de premier ordre — rendu premium, jamais un
rendu de template.

### Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `ink` | `#101114` | Fond de l'app |
| `raise` / `raise2` | `#17181D` / `#1E2026` | Surfaces élevées (cartes) |
| `paper` | `#F5F3EE` | Texte principal, blanc cassé chaud |
| `muted` / `faint` | `#8F8D86` / `#57554F` | Texte secondaire / tertiaire |
| `line` | `rgba(245,243,238,0.08)` | Bordures |
| `ember` | `#D6362B` | **Réservé aux moments forts** : score, records, alertes |

### Typographies

- **Anton** (`font-display`) — gros chiffres uniquement (score, records)
- **Space Grotesk** (`font-sans`) — interface
- **IBM Plex Mono** (`font-mono`) — données (dates, tonnages, labels)

### Signature visuelle : la pile de disques

`components/DiscStack.tsx` — 4 barres arrondies empilées, la plus courte
en rouge au sommet. Elle sert de :

- **logo** (header, icône d'app `app/icon.svg`)
- **jauge** (prop `value` 0..1 : les barres s'allument depuis la base)
- **élément central de la carte de partage** (`components/ShareCard.tsx`)

### Mouvements

- Anneau de score : remplissage fluide à l'ouverture, **600ms**,
  chiffre compté en synchro (`components/ScoreRing.tsx`)
- Micro-animations sobres : 300–500ms, easing spring léger
  (`cubic-bezier(0.34, 1.45, 0.64, 1)`) — classes `rise`, `pop-in`,
  `pressable`
- Haptics sur les interactions clés (`lib/haptics.ts`) :
  tap léger en navigation, impact au moment où le score se pose

## Écrans

- `/` — **Home hero** : le score en énorme dans l'anneau, le verdict
  en dessous, le reste discret (série, tonnage, dernier PR)
- `/seances` — volume de la semaine + historique avec jauge d'intensité
- `/records` — le PR frais mis en scène en rouge, les autres sobres
- `/partage` — carte de partage 4:5 prête pour les stories

## Développement

```bash
npm install
npm run dev
```

Les données sont mockées dans `lib/mock.ts` en attendant le backend.
