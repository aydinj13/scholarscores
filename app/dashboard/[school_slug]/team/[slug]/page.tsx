// Server Component
import { supabase } from "@/supabaseClient";
import TeamDetailsClient from "./TeamDetailsClient";


export default async function Team({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch team and associated students
  const { data: teamData, error: teamError } = await supabase
  .from("teams")
  .select("*, students (id, first_name, last_name, slug, position)") // Fetch team and associated students
  .eq("slug", slug)
  .single(); // Assuming slug is unique for teams


  if (teamError) {
    console.error("Error fetching team data:", teamError.message);
    return <div>Error loading team data.</div>;
  }

  if (!teamData) {
    return <div>No data found.</div>;
  }

  const roster = teamData.students || [];

  // Fetch schedule for the team
  const { data: schedule, error: scheduleError } = await supabase
    .from("competitions")
    .select("id, competition_date: date, away_team, home_team, location, is_win")
    .eq("team_id", teamData.id); // Assuming team_id matches the team's ID

  if (scheduleError) {
    console.error("Error fetching schedule:", scheduleError.message);
    return <div>Error loading schedule data.</div>;
  }

  return <TeamDetailsClient teamData={teamData} roster={roster} schedule={schedule} />;
}
