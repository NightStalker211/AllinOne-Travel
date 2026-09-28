import type { Metadata } from "next";
import { TripsScreen } from "@/components/trips/TripsScreen";

export const metadata: Metadata = {
  title: "Trips — AllinOne Travel",
  description:
    "Your itinerary, stored on this device. Totals only add the prices you entered yourself.",
};

export default function TripsPage() {
  return <TripsScreen />;
}
