"use client";

import { supabase } from "@/supabaseClient";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Assuming you have a Switch component installed

function InsertPage() {
  const [home_team, setHomeTeam] = useState("");
  const [away_team, setAwayTeam] = useState("");
  const [home_score, setHomeScore] = useState("");
  const [away_score, setAwayScore] = useState("");
  const [location, setLocation] = useState("");
  const [host_school, setHostSchool] = useState("");
  const [date, setDate] = useState(""); // For competition date and time
  const [live, setLive] = useState(false); // Is the competition live?
  const [quarter, setQuarter] = useState(""); // Current quarter (if live)
  const [time, setTime] = useState(""); // Remaining time (if live)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
      .insert([{
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
      }]);

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage("An error occurred while inserting data.");
      return;
    }

    setMessage("Data inserted successfully!");
    setHomeTeam("");
    setAwayTeam("");
    setHomeScore("");
    setAwayScore("");
    setLocation("");
    setHostSchool("");
    setDate("");
    setLive(false);
    setQuarter("");
    setTime("");
  };

  return (
    <div className="container mx-auto py-10 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Insert Competition Information</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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

      {message && (
        <p className={`mt-4 text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default InsertPage;
