import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getUserProfile from "@/libs/getUserProfile";
import TopMenuPanel from "./TopMenuPanel";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);

  // Ensure session.user.token is a string before accessing it
  if (!session || !session.user || typeof session.user.token !== "string") return null;

  const profile = session ? await getUserProfile(session.user.token) : null;

  return (
    <div>
      <TopMenuPanel role={profile?.data.role} sessionUser={session} />
    </div>
  );
}
