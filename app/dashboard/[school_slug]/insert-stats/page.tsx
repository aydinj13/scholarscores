"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { supabase } from '@/supabaseClient';

const StatsInputPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState(null);

  // Individual Stats State
  const [individualStats, setIndividualStats] = useState({
    student_id: "",
    minutes: 0,
    points: 0,
    rebounds: 0,
    assists: 0
  });

  // Team Stats State
  const [teamStats, setTeamStats] = useState({
    field_goals_attempted: 0,
    field_goals_made: 0,
    three_pointers_attempted: 0,
    three_pointers_made: 0
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch active competitions
        const { data: competitionsData } = await supabase
          .from('competitions')
          .select('*')
        
        setCompetitions(competitionsData || []);
        
        // Fetch students
        const { data: studentsData } = await supabase
          .from('students')
          .select('*')
          .order('last_name');
        
        setStudents(studentsData || []);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setMessage({ type: 'error', text: 'Failed to load initial data' });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleIndividualStatSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompetition) {
      setMessage({ type: 'error', text: 'Please select a competition' });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('individual_stats')
        .insert([
          {
            ...individualStats,
            competition_id: selectedCompetition
          }
        ]);

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Individual stats saved successfully' });
      // Reset form
      setIndividualStats({
        student_id: "",
        minutes: 0,
        points: 0,
        rebounds: 0,
        assists: 0
      });
    } catch (error) {
      console.error('Error saving individual stats:', error);
      setMessage({ type: 'error', text: 'Failed to save individual stats' });
    } finally {
      setSaving(false);
    }
  };

  const handleTeamStatSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompetition) {
      setMessage({ type: 'error', text: 'Please select a competition' });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('team_stats')
        .insert([
          {
            ...teamStats,
            competition_id: selectedCompetition
          }
        ]);

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Team stats saved successfully' });
      // Reset form
      setTeamStats({
        field_goals_attempted: 0,
        field_goals_made: 0,
        three_pointers_attempted: 0,
        three_pointers_made: 0
      });
    } catch (error) {
      console.error('Error saving team stats:', error);
      setMessage({ type: 'error', text: 'Failed to save team stats' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Competition Statistics Input</CardTitle>
          <CardDescription>Enter individual and team statistics for the selected competition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Select Competition</Label>
              <Select 
                onValueChange={setSelectedCompetition} 
                value={selectedCompetition}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a competition..." />
                </SelectTrigger>
                <SelectContent>
                  {competitions.map((competition) => (
                    <SelectItem key={competition.id} value={competition.id}>
                      {`${competition.home_team} vs ${competition.away_team} - ${new Date(competition.date).toLocaleDateString()}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="individual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="individual">Individual Stats</TabsTrigger>
                <TabsTrigger value="team">Team Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="individual">
                <form onSubmit={handleIndividualStatSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Player</Label>
                    <Select 
                      onValueChange={(value) => setIndividualStats(prev => ({...prev, student_id: value}))}
                      value={individualStats.student_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a player..." />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {`${student.last_name}, ${student.first_name}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Minutes Played</Label>
                      <Input 
                        type="number" 
                        value={individualStats.minutes}
                        onChange={(e) => setIndividualStats(prev => ({...prev, minutes: parseInt(e.target.value)}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Points</Label>
                      <Input 
                        type="number"
                        value={individualStats.points}
                        onChange={(e) => setIndividualStats(prev => ({...prev, points: parseInt(e.target.value)}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rebounds</Label>
                      <Input 
                        type="number"
                        value={individualStats.rebounds}
                        onChange={(e) => setIndividualStats(prev => ({...prev, rebounds: parseInt(e.target.value)}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Assists</Label>
                      <Input 
                        type="number"
                        value={individualStats.assists}
                        onChange={(e) => setIndividualStats(prev => ({...prev, assists: parseInt(e.target.value)}))}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Individual Stats'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="team">
                <form onSubmit={handleTeamStatSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Field Goals Attempted</Label>
                      <Input 
                        type="number"
                        value={teamStats.field_goals_attempted}
                        onChange={(e) => setTeamStats(prev => ({...prev, field_goals_attempted: parseInt(e.target.value)}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Field Goals Made</Label>
                      <Input 
                        type="number"
                        value={teamStats.field_goals_made}
                        onChange={(e) => setTeamStats(prev => ({...prev, field_goals_made: parseInt(e.target.value)}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Three Pointers Attempted</Label>
                      <Input 
                        type="number"
                        value={teamStats.three_pointers_attempted}
                        onChange={(e) => setTeamStats(prev => ({...prev, three_pointers_attempted: parseInt(e.target.value)}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Three Pointers Made</Label>
                      <Input 
                        type="number"
                        value={teamStats.three_pointers_made}
                        onChange={(e) => setTeamStats(prev => ({...prev, three_pointers_made: parseInt(e.target.value)}))}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Team Stats'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsInputPage;