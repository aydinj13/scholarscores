import { supabase } from "@/supabaseClient";

export default async function Team({ params }: { params: { slug: string } }) {
  const { slug } = params; // Correctly extract slug
  const { data, error } = await supabase
    .from("teams")
    .select("*, schools (slug)")
    .eq("slug", slug);

  if (error) {
    console.error("Error fetching team data:", error.message);
    return <div>Error loading team data.</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data found.</div>;
  }

  return (
    <div>
      {data.map((team) => (
        <div key={team.id} className="p-4 border rounded-md shadow-sm">
          <p>Team Slug: {team.slug}</p>
          <p>Team Name: {team.name}</p>
          <p>
            Team Age: {team.age === "ms" ? "Middle School" : "High School"}
          </p>
          <p>Team Gender: {team.gender === "boys" ? "Boys" : "Girls"}</p>
          <p>Team Sport: {team.sport}</p>
          <p>Team Head Coach: {team.head_coach}</p>
        </div>
      ))}
    </div>
  );
}
