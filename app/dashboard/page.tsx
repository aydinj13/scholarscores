
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/supabaseClient";

async function fetchSchoolData() {
  const { data: schools, error: schoolError } = await supabase.from('schools').select('*');
  if (schoolError) throw new Error(schoolError.message);

  const { data: teams, error: teamError } = await supabase.from('teams').select('id, school_id');
  if (teamError) throw new Error(teamError.message);

  const { data: students, error: studentError } = await supabase.from('students').select('id, school_id');
  if (studentError) throw new Error(studentError.message);

  // Combine Data
  const schoolsWithStats = schools.map((school) => {
    const schoolTeams = teams.filter((team) => team.school_id === school.id).length;
    const schoolStudents = students.filter((student) => student.school_id === school.id).length;

    return {
      ...school,
      teamsCount: schoolTeams,
      studentsCount: schoolStudents,
    };
  });

  return schoolsWithStats;
}

export default async function Dashboard() {
  let schoolData;

  try {
    schoolData = await fetchSchoolData();
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-xl text-red-600">Error loading data</p>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!schoolData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-600">Loading schools...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">Track and manage your school statistics</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Add New School
              </Button>
            </div>
          </div>

          {/* Schools Grid */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Schools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {schoolData.map((school) => (
                <Card key={school.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="space-y-2">
                      <CardTitle className="text-xl text-gray-900">{school.name}</CardTitle>
                      <CardDescription className="flex items-center text-gray-600">
                        <Building className="w-4 h-4 mr-2" />
                        {school.description || "No description available"}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Teams</p>
                        <p className="font-semibold text-gray-900">{school.teamsCount}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Students</p>
                        <p className="font-semibold text-gray-900">{school.studentsCount}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/${school.slug}`} className="flex items-center justify-center">
                        View Details
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
