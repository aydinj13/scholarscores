import { supabase } from "@/supabaseClient";
import SchoolPageClient from "./SchoolPage";

export default async function Page({ params }: { params: { school_slug: string } }) {
  const { school_slug } = params;

  // Fetch school data
  const { data: schoolData, error: schoolError } = await supabase
    .from("schools")
    .select("*")
    .eq("slug", school_slug)
    .single();

  if (schoolError) {
    return <div>Error loading school data</div>;
  }

  // Fetch teams for this school
  const { data: teamsData, error: teamsError } = await supabase
    .from("teams")
    .select("*")
    .eq("school_id", schoolData.id);

  if (teamsError) {
    return <div>Error loading teams data</div>;
  }

  // Extract team IDs for filtering competitions
  const teamIds = teamsData?.map((team) => team.id);

  // Fetch competitions related to these teams
  const { data: competitionsData, error: competitionsError } = await supabase
    .from("competitions")
    .select("*, teams(*, school_id, schools(slug))")
    .in("team_id", teamIds);  // Use `.in()` to filter by multiple team IDs

  if (competitionsError) {
    return <div>Error loading competitions data</div>;
  }

  return (
    <SchoolPageClient
      schoolData={schoolData}
      teamsData={teamsData || []}
      competitionsData={competitionsData || []}
    />
  );
}
