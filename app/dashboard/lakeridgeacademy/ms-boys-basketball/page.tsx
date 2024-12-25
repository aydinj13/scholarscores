"use client";

import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { IndividualStats, columns } from "./columns";
import { DataTable } from "@/components/data-table";

async function getData(points: string): Promise<IndividualStats[]> {
  const { data, error } = await supabase
    .from("individual_stats")
    .select("*, students (first_name)")
    .eq("points", points);

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data.map((stat) => ({
    id: stat.id,
    student_id: stat.student_id,
    competition_id: stat.competition_id,
    first_name: stat.students?.first_name || "Unknown",
    minutes: stat.minutes,
    points: stat.points,
    assists: stat.assists,
  }));
}

export default function Page() {
  const [points, setPoints] = useState<string>("");
  const [data, setData] = useState<IndividualStats[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetch = async () => {
    if (!points) return;
    setLoading(true);
    const fetchedData = await getData(points);
    setData(fetchedData);
    setLoading(false);
  };
  

  return (
    <div>
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Enter Points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        <button
          onClick={handleFetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Data"}
        </button>
      </div>

      {data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <p className="text-gray-500">No data available. Enter an ID to fetch results.</p>
      )}
    </div>
    </div>
  );
}
