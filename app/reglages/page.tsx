import { getTranslations } from "next-intl/server";
import { SettingsForm } from "@/components/SettingsForm";

export default async function ReglagesPage() {
  const t = await getTranslations("settings");

  return (
    <div>
      <header className="pt-3">
        <h1 className="text-[28px] font-semibold tracking-tight text-paper">
          {t("title")}
        </h1>
      </header>
      <SettingsForm />
    </div>
  );
}
