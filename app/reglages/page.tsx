// Écran Réglages — liste sobre, sera étoffé écran par écran.

const GROUPS: { title: string; rows: string[] }[] = [
  { title: "Toi", rows: ["Profil", "Objectifs", "Zones de récup"] },
  { title: "App", rows: ["Notifications", "Unités", "Santé & capteurs"] },
  { title: "Compte", rows: ["Abonnement", "Confidentialité", "Déconnexion"] },
];

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  );
}

export default function ReglagesPage() {
  return (
    <div className="stagger">
      <header className="rise pt-3">
        <h1 className="text-[28px] font-semibold tracking-tight text-paper">
          Réglages
        </h1>
      </header>

      {GROUPS.map((group) => (
        <section key={group.title} className="rise mt-7">
          <h2 className="px-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            {group.title}
          </h2>
          <div className="mt-2.5 overflow-hidden rounded-card border border-line bg-raise">
            {group.rows.map((row, i) => (
              <button
                key={row}
                className={`flex w-full items-center justify-between px-5 py-4 text-left text-[15px] font-medium text-paper ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                {row}
                <span className="text-faint">
                  <Chevron />
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}

      <p className="rise mt-7 text-center font-mono text-[11px] text-faint">
        Stakk 0.1.0
      </p>
    </div>
  );
}
