import type { Metadata } from "next";
import "@/styles/checkmycase.css";
import { CheckMyCase } from "@/components/checkmycase/CheckMyCase";

export const metadata: Metadata = {
  title: "Check My Case — Free Case Review | CasePort",
  description:
    "See if you have a case in 60 seconds. A few quick questions — no cost, no obligation, completely confidential.",
  alternates: { canonical: "/checkmycase" },
};

export default function CheckMyCasePage() {
  return <CheckMyCase />;
}
