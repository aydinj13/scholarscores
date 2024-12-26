import { supabase } from "@/supabaseClient";
import SchoolPageClient from "./SchoolPage";

export default async function Page({ params }: { params: { school_slug: string } }) {
  const { school_slug } = params;
  
  const { data: schoolData, error: schoolError } = await supabase
    .from("schools")
    .select("*")
    .eq("slug", school_slug)
    .single();
  
  const { data: teamsData, error: teamsError } = await supabase
    .from("teams")
    .select("*");
  
  const { data: competitionsData, error: competitionsError } = await supabase
    .from("competitions")
    .select("*");

  if (schoolError || teamsError || competitionsError) {
    return <div>Error loading data</div>;
  }

  return (
    <SchoolPageClient
      schoolData={schoolData}
      teamsData={teamsData}
      competitionsData={competitionsData}
    />
  );
}