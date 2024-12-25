"use client";

import { supabase } from "@/supabaseClient";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function InsertPage() {
  const [studentId, setStudentId] = useState<string>("");
  const [points, setPoints] = useState<string>("");
  const [assists, setAssists] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!points || !assists) {
      setMessage("Both fields are required.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase
      .from("individual_stats")
      .insert([{ points: parseInt(points), assists: parseInt(assists), student_id: studentId }]);

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage("An error occurred while inserting data.");
      return;
    }

    if (data) {
      setMessage("Data inserted successfully!");
      setPoints("");
      setAssists("");
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Insert Individual Stats</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
          <label htmlFor="studentId" className="block text-sm font-medium mb-1">
            Student ID:
          </label>
          <Textarea
            id="studentId"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="points" className="block text-sm font-medium mb-1">
            Points:
          </label>
          <Input
            type="number"
            id="points"
            placeholder="Enter points"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="assists" className="block text-sm font-medium mb-1">
            Assists:
          </label>
          <Input
            type="number"
            id="assists"
            placeholder="Enter assists"
            value={assists}
            onChange={(e) => setAssists(e.target.value)}
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
