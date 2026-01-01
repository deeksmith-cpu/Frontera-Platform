import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticket = searchParams.get("__clerk_ticket");

  if (ticket) {
    // Redirect to sign-up with the ticket
    redirect(`/sign-up?__clerk_ticket=${ticket}`);
  } else {
    // No ticket, redirect to sign-in
    redirect("/sign-in");
  }
}
