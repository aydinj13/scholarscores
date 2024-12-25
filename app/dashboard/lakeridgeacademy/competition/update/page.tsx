"use client";

import { supabase } from "@/supabaseClient";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; 
import { Select } from "@/components/ui/select"; // Assuming you have a Select component
import { Card } from "@/components/ui/card"; // Assuming you use a Card component to wrap the competition list
import { Badge } from "@/components/ui/badge";

function EditCompetitionPage() {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState<any>(null);

  const [home_team, setHomeTeam] = useState("");
  const [away_team, setAwayTeam] = useState("");
  const [home_score, setHomeScore] = useState("");
  const [away_score, setAwayScore] = useState("");
  const [location, setLocation] = useState("");
  const [host_school, setHostSchool] = useState("");
  const [date, setDate] = useState(""); 
  const [live, setLive] = useState(false); 
  const [quarter, setQuarter] = useState(""); 
  const [time, setTime] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCompetitions = async () => {
      const { data, error } = await supabase.from("competitions").select("*");

      if (error) {
        console.error(error);
        setMessage("Error loading competitions.");
        return;
      }
      setCompetitions(data);
    };

    fetchCompetitions();
  }, []);

  const handleSelectCompetition = async (competitionId: string) => {
    const { data, error } = await supabase
      .from("competitions")
      .select("*")
      .eq("id", competitionId)
      .single(); // Get a single competition by its ID

    if (error) {
      console.error(error);
      setMessage("Error loading competition data.");
      return;
    }

    setSelectedCompetition(data);

    // Pre-fill form with selected competition's data
    setHomeTeam(data.home_team);
    setAwayTeam(data.away_team);
    setHomeScore(data.home_score.toString());
    setAwayScore(data.away_score.toString());
    setLocation(data.location);
    setHostSchool(data.host_school);
    setDate(data.date);
    setLive(data.live);
    setQuarter(data.quarter || "");
    setTime(data.time || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !home_team ||
      !away_team ||
      !home_score ||
      !away_score ||
      !location ||
      !host_school ||
      !date
    ) {
      setMessage("All fields are required.");
      return;
    }

    if (live && (!quarter || !time)) {
      setMessage("Quarter and time are required when competition is live.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase
      .from("competitions")
      .update({
        home_team,
        away_team,
        home_score: parseInt(home_score),
        away_score: parseInt(away_score),
        location,
        host_school,
        date,
        live,
        quarter: live ? parseInt(quarter) : null,
        time: live ? time : null,
      })
      .eq("id", selectedCompetition.id);

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage("An error occurred while updating data.");
      return;
    }

    setMessage("Data updated successfully!");
  };

  // Filter competitions based on search term
  const filteredCompetitions = competitions.filter((competition: any) => 
    competition.home_team.toLowerCase().includes(searchTerm.toLowerCase()) || 
    competition.away_team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Edit Competition Information</h1>

      {/* Search Bar to filter competitions */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by Home or Away Team"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List filtered competitions */}
      <div className="space-y-4">
        {filteredCompetitions.map((competition: any) => (
          <Card key={competition.id} className="p-4">
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              {competition.home_team} vs {competition.away_team}
              {competition.live && (
                <Badge variant="destructive" className="ml-2">
                  Q{competition.quarter}
                </Badge>
              )}
            </span>
            <Button onClick={() => handleSelectCompetition(competition.id)} size="sm">
              Edit
            </Button>
          </div>
        </Card>
        
        ))}
      </div>

      {/* Show competition details if selected */}
      {selectedCompetition && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label htmlFor="home_team" className="block text-sm font-medium mb-1">
              Home Team:
            </label>
            <Input
              id="home_team"
              placeholder="Enter Home Team"
              value={home_team}
              onChange={(e) => setHomeTeam(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="away_team" className="block text-sm font-medium mb-1">
              Away Team:
            </label>
            <Input
              id="away_team"
              placeholder="Enter Away Team"
              value={away_team}
              onChange={(e) => setAwayTeam(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="home_score" className="block text-sm font-medium mb-1">
              Home Score:
            </label>
            <Input
              type="number"
              id="home_score"
              placeholder="Enter Points"
              value={home_score}
              onChange={(e) => setHomeScore(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="away_score" className="block text-sm font-medium mb-1">
              Away Score:
            </label>
            <Input
              type="number"
              id="away_score"
              placeholder="Enter Points"
              value={away_score}
              onChange={(e) => setAwayScore(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location (Address):
            </label>
            <Textarea
              id="location"
              placeholder="Enter Address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="host_school" className="block text-sm font-medium mb-1">
              Host School:
            </label>
            <Input
              id="host_school"
              placeholder="Enter School"
              value={host_school}
              onChange={(e) => setHostSchool(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date and Time:
            </label>
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              <Input
                type="datetime-local"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="live" className="text-sm font-medium">
              Is Live:
            </label>
            <Switch id="live" checked={live} onCheckedChange={(checked) => setLive(checked)} />
          </div>

          {live && (
            <div className="space-y-4">
              <div>
                <label htmlFor="quarter" className="block text-sm font-medium mb-1">
                  Quarter:
                </label>
                <Input
                  type="number"
                  id="quarter"
                  placeholder="Enter Quarter"
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium mb-1">
                  Time (e.g., 2:30):
                </label>
                <Input
                  type="text"
                  id="time"
                  placeholder="Enter Time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      )}

      {message && (
        <p className={`mt-4 text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default EditCompetitionPage;
