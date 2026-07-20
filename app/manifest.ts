import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stakk",
    short_name: "Stakk",
    description: "Empile tes séances. Monte ton score.",
    start_url: "/",
    display: "standalone",
    background_color: "#101114",
    theme_color: "#101114",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
