"use client";

import { supabase } from "@/supabaseClient";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

function InsertPage() {
  const [school, setSchool] = useState("");
  const [name, setName] = useState("");
  const [sport, setSport] = useState("basketball");
  const [age, setAge] = useState("ms");
  const [gender, setGender] = useState("boys");
  const [head_coach, setHeadCoach] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const sports = [
    { value: "basketball", label: "Basketball" },
    { value: "soccer", label: "Soccer" },
    { value: "volleyball", label: "Volleyball" },
    { value: "football", label: "Football" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!school || !name || !sport || !age || !gender || !head_coach) {
      setMessage("All fields are required.");
      return;
    }

    const teamSlug = `${age}-${gender}-${sport}`;
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.from("teams").insert([
      {
        name,
        school,
        sport,
        age,
        gender,
        head_coach,
        slug: teamSlug,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage("An error occurred while inserting data.");
      return;
    }

    setMessage("Team added successfully!");
    setName("");
    setSchool("");
    setSport("basketball");
    setAge("ms");
    setGender("boys");
    setHeadCoach("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Add New Team</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="school">School Name</Label>
                <Input
                  id="school"
                  placeholder="Enter school name"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  placeholder="Enter team name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sport">Sport</Label>
                <Select value={sport} onValueChange={setSport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport.value} value={sport.value}>
                        {sport.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age Group</Label>
                <Select value={age} onValueChange={setAge}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ms">Middle School</SelectItem>
                    <SelectItem value="hs">High School</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boys">Boys</SelectItem>
                    <SelectItem value="girls">Girls</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="head_coach">Head Coach</Label>
                <Input
                  id="head_coach"
                  placeholder="Enter head coach name"
                  value={head_coach}
                  onChange={(e) => setHeadCoach(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Team...
                  </>
                ) : (
                  "Add Team"
                )}
              </Button>
            </div>
          </form>

          {message && (
            <Alert className={`mt-6 ${message.includes("successfully") ? "bg-green-50" : "bg-red-50"}`}>
              <AlertDescription>
                {message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default InsertPage;