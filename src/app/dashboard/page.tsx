"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dumbbell, Play, Info, Calendar, Weight, Target } from "lucide-react";
import { toast } from "sonner";

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  formNote: string | null;
  youtubeUrl: string | null;
  muscleImageUrl: string | null;
  dayOfWeek: number;
}

const dayNames = [
  "السبت",
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];

const dayGroups: Record<number, string> = {
  0: "صدر وتراي",
  1: "ظهر وباي",
  2: "راحة أو كارديو",
  3: "أرجل وكتف",
  4: "بطن وكارديو",
  5: "راحة",
  6: "راحة",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);

  // Arabic week: 0=Saturday (getDay() 6), 1=Sunday (getDay() 0), etc.
  const getArabicDay = () => {
    const jsDay = new Date().getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    // Convert to Arabic week: Saturday=0, Sunday=1, ..., Friday=6
    const arabicDay = jsDay === 0 ? 1 : jsDay === 6 ? 0 : jsDay + 1;
    return arabicDay;
  };

  const today = getArabicDay();
  const todayName = dayNames[today];
  const todayGroup = dayGroups[today];

  useEffect(() => {
    fetchTodayExercises();
    fetchLatestWeight();
  }, []);

  const fetchTodayExercises = async () => {
    try {
      const res = await fetch(`/api/exercises?dayOfWeek=${today}`);
      if (res.ok) {
        const data = await res.json();
        setExercises(data);
      }
    } catch {
      toast.error("فشل في جلب تمارين اليوم");
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestWeight = async () => {
    try {
      const res = await fetch("/api/weight");
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setLatestWeight(data[data.length - 1].weightKg);
        }
      }
    } catch {
      // silently fail
    }
  };

  const toggleExercise = (exerciseId: number) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const getYoutubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-muted-foreground">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  const isRestDay = exercises.length === 0 || (exercises.length === 1 && exercises[0].sets === 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="h-7 w-7 text-primary" />
            تمرين اليوم
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {todayName} — {todayGroup}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تمارين اليوم</p>
                <p className="text-2xl font-bold">{exercises.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Weight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الوزن الحالي</p>
                <p className="text-2xl font-bold">{latestWeight ? `${latestWeight} كجم` : "—"}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الهدف</p>
                <p className="text-2xl font-bold">٧٥–٧٨ كجم</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rest Day */}
        {isRestDay ? (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <Dumbbell className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">يوم راحة</h2>
              <p className="text-muted-foreground">
                اليوم يوم راحة! خذ قسطاً من الراحة لتعافي عضلاتك. يمكنك عمل كارديو خفيف إذا أردت.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Exercises List */
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <Card key={exercise.id} className={completedExercises.has(exercise.id) ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="pt-1">
                      <Checkbox
                        checked={completedExercises.has(exercise.id)}
                        onCheckedChange={() => toggleExercise(exercise.id)}
                        className="h-5 w-5"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{exercise.name}</h3>
                        <Badge variant="secondary">{exercise.sets} × {exercise.reps}</Badge>
                      </div>

                      {exercise.formNote && (
                        <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                          <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                          <p>{exercise.formNote}</p>
                        </div>
                      )}

                      {exercise.youtubeUrl && (
                        <div className="mt-3">
                          <a
                            href={exercise.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <Play className="h-4 w-4" />
                            مشاهدة فيديو التمرين
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
