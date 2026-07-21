import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

// i18n sans routage : la langue vit dans un cookie, bascule à chaud
// depuis Réglages. Anglais par défaut.
export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export default getRequestConfig(async () => {
  const cookie = cookies().get("locale")?.value;
  const locale: Locale = cookie === "fr" ? "fr" : "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
