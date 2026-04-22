import { getTeamMembers, mockTeam } from "@/services/team";
import { EquipoClient } from "./equipo-client";

export const dynamic = "force-dynamic";

export default async function AdminEquipoPage() {
  let members = await getTeamMembers().catch(() => mockTeam);

  return <EquipoClient members={members} />;
}
