import type { Metadata } from "next";
import { ExploreShell } from "@/components/explore/ExploreShell";
import { ExplorePanelPrompt } from "@/components/explore/CountryPanel";

export const metadata: Metadata = {
  title: "Explore — AllinOne Travel",
  description:
    "One hub per country: terminals, carriers, sights, entry rules and local links — on a bundled offline world map.",
};

export default function ExploreIndexPage() {
  return (
    <ExploreShell>
      <ExplorePanelPrompt />
    </ExploreShell>
  );
}
