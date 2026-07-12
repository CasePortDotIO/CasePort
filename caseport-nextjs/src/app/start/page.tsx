import { redirect } from "next/navigation";

// /start → the CheckMyCase qualifier (per spec).
export default function Start() {
  redirect("/checkmycase");
}
