import { redirect } from "@sveltejs/kit";

export function load() {
  // route guard
  redirect(307, "/welcome");
}
