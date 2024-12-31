"use client";

import { supabase } from "@/supabaseClient";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function EditTeamPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [name, setName] = useState("");
  const [sport, setSport] = useState<"basketball" | "soccer" | "volleyball" | "football">("basketball");
  const [age, setAge] = useState<"ms" | "hs">("ms");
  const [gender, setGender] = useState<"boys" | "girls">("boys");
  const [coach_id, setHeadCoach] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase.from("teams").select("*");
      if (error) {
        console.error(error);
      } else {
        setTeams(data);
      }
    };

    fetchTeams();
  }, []);

  const handleSelectTeam = async (teamId: string) => {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();
    
    if (error) {
      console.error(error);
      return;
    }

    setSelectedTeam(data);
    setName(data.name);
    setSport(data.sport);
    setAge(data.age);
    setGender(data.gender);
    setHeadCoach(data.coach_id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !sport || !age || !gender || !coach_id) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase
      .from("teams")
      .update([
        {
          name,
          sport,
          age,
          gender,
          coach_id,
        },
      ])
      .eq("id", selectedTeam.id);

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage("An error occurred while updating data.");
      return;
    }

    setMessage("Data updated successfully!");
  };

  return (
    <div className="container mx-auto py-10 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Select and Edit Team</h1>

      <div>
        <label htmlFor="team" className="block text-sm font-medium mb-1">
          Select Team:
        </label>
        <Select onValueChange={handleSelectTeam}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name} - {team.sport} ({team.age} - {team.gender})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTeam && (
        <>
          <h2 className="text-xl font-semibold mt-6">Edit Team Information</h2>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Team Name:
              </label>
              <Input
                id="name"
                placeholder="Enter Team Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sport" className="block text-sm font-medium mb-1">
                Sport:
              </label>
              <Select value={sport} onValueChange={(value) => setSport(value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="soccer">Soccer</SelectItem>
                  <SelectItem value="volleyball">Volleyball</SelectItem>
                  <SelectItem value="football">Football</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium mb-1">
                Age:
              </label>
              <Select value={age} onValueChange={(value) => setAge(value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ms">Middle School</SelectItem>
                  <SelectItem value="hs">High School</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1">
                Gender:
              </label>
              <Select value={gender} onValueChange={(value) => setGender(value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boys">Boys</SelectItem>
                  <SelectItem value="girls">Girls</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="coach_id" className="block text-sm font-medium mb-1">
                Head Coach:
              </label>
              <Input
                id="coach_id"
                placeholder="Enter Head Coach Name"
                value={coach_id}
                onChange={(e) => setHeadCoach(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </>
      )}

      {message && (
        <p className={`mt-4 text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default EditTeamPage;
