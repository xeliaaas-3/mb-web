import type { Metadata } from "next";
import { BagView } from "./BagView";

export const metadata: Metadata = {
  title: "Tu bolsa",
  robots: { index: false },
};

export default function BagPage() {
  return <BagView />;
}
