"use client";

import { supabase } from "@/supabaseClient";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function InsertPage() {

  const [school, setSchool] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [sport, setSport] = useState<"basketball" | "soccer" | "volleyball" | "football">("basketball");
  const [age, setAge] = useState<"ms" | "hs">("ms");
  const [gender, setGender] = useState<"boys" | "girls">("boys");
  const [head_coach, setHeadCoach] = useState("");
  const [slug, setSlug] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !school ||
      !name ||
      !sport ||
      !age ||
      !gender ||
      !head_coach
    ) {
      setMessage("All fields are required.");
      return;
    }



    // Generate the slug
    const teamSlug = `${age}-${gender}-${sport}`;

    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase
      .from("teams")
      .insert([{
        name: name,
        sport: sport,
        age: age,
        gender: gender,
        head_coach: head_coach,
        slug: teamSlug,
      }]);

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage("An error occurred while inserting data.");
      return;
    }
    setName("")
    setSchool("")
    setMessage("Data inserted successfully!");
    setSport("basketball");
    setAge("ms");
    setGender("boys");
    setHeadCoach("");
    setSlug("");
  };

  return (
    <div className="container mx-auto py-10 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Insert Team Information</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <div>
          <label htmlFor="school" className="block text-sm font-medium mb-1">
            School Name:
          </label>
          <Input
            id="school"
            placeholder="Enter School"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Team Name:
          </label>
          <Input
            id="nane"
            placeholder="Enter Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
          <label htmlFor="sport" className="block text-sm font-medium mb-1">
            Sport:
          </label>
          <select
            id="sport"
            value={sport}
            onChange={(e) => setSport(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="basketball">Basketball</option>
            <option value="soccer">Soccer</option>
            <option value="volleyball">Volleyball</option>
            <option value="football">Football</option>
          </select>
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium mb-1">
            Age:
          </label>
          <select
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="ms">Middle School</option>
            <option value="hs">High School</option>
          </select>
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium mb-1">
            Gender:
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
          </select>
        </div>

        <div>
          <label htmlFor="head_coach" className="block text-sm font-medium mb-1">
            Head Coach:
          </label>
          <Input
            id="head_coach"
            placeholder="Enter Head Coach Name"
            value={head_coach}
            onChange={(e) => setHeadCoach(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>

      {message && (
        <p className={`mt-4 text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default InsertPage;
