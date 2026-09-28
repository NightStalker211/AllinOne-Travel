import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExploreShell } from "@/components/explore/ExploreShell";
import { CountryPanel } from "@/components/explore/CountryPanel";
import {
  countryIdentity,
  dataCountryCodes,
} from "@/lib/explore/country-data";

export function generateStaticParams() {
  return dataCountryCodes().map((cc) => ({ cc: cc.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cc: string }>;
}): Promise<Metadata> {
  const { cc } = await params;
  try {
    const id = countryIdentity(cc.toUpperCase());
    return {
      title: `${id.name} — Explore — AllinOne Travel`,
      description: `Terminals, carriers, sights, entry rules and local links for ${id.name}.`,
    };
  } catch {
    return { title: "Explore — AllinOne Travel" };
  }
}

export default async function ExploreCountryPage({
  params,
}: {
  params: Promise<{ cc: string }>;
}) {
  const { cc } = await params;
  const upper = cc.toUpperCase();
  if (!dataCountryCodes().includes(upper)) notFound();

  return (
    <ExploreShell selected={upper}>
      <CountryPanel cc={upper} />
    </ExploreShell>
  );
}
