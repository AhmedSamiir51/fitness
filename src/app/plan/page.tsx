"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Play, Save, X } from "lucide-react";
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
  orderIndex: number;
}

const dayNames = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

const emptyExercise = {
  name: "",
  sets: 3,
  reps: "",
  formNote: "",
  youtubeUrl: "",
  muscleImageUrl: "",
  orderIndex: 0,
};

export default function PlanPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [newExercise, setNewExercise] = useState({ ...emptyExercise, dayOfWeek: 0 });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await fetch("/api/exercises");
      if (res.ok) {
        const data = await res.json();
        setExercises(data);
      }
    } catch {
      toast.error("فشل في جلب التمارين");
    } finally {
      setLoading(false);
    }
  };

  const getExercisesForDay = (day: number) => {
    return exercises
      .filter((e) => e.dayOfWeek === day)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  };

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExercise),
      });
      if (res.ok) {
        toast.success("تم إضافة التمرين بنجاح");
        setIsAddDialogOpen(false);
        setNewExercise({ ...emptyExercise, dayOfWeek: activeDay });
        fetchExercises();
      } else {
        toast.error("فشل في إضافة التمرين");
      }
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const handleUpdate = async () => {
    if (!editingExercise) return;
    try {
      const res = await fetch(`/api/exercises/${editingExercise.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingExercise),
      });
      if (res.ok) {
        toast.success("تم تحديث التمرين بنجاح");
        setIsEditDialogOpen(false);
        setEditingExercise(null);
        fetchExercises();
      } else {
        toast.error("فشل في تحديث التمرين");
      }
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا التمرين؟")) return;
    try {
      const res = await fetch(`/api/exercises/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم حذف التمرين بنجاح");
        fetchExercises();
      } else {
        toast.error("فشل في حذف التمرين");
      }
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const openEditDialog = (exercise: Exercise) => {
    setEditingExercise({ ...exercise });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = (day: number) => {
    setNewExercise({ ...emptyExercise, dayOfWeek: day });
    setActiveDay(day);
    setIsAddDialogOpen(true);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">خطة الأسبوع</h1>
          <p className="text-muted-foreground mt-1">
            عدل تمارينك، أضف جديدة، أو احذف ما لا تحتاجه
          </p>
        </div>

        <Tabs defaultValue="0" className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-1 mb-6">
            {dayNames.map((name, i) => (
              <TabsTrigger key={i} value={i.toString()} className="flex-1 min-w-[80px]">
                {name}
              </TabsTrigger>
            ))}
          </TabsList>

          {dayNames.map((_, dayIndex) => (
            <TabsContent key={dayIndex} value={dayIndex.toString()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">تمارين يوم {dayNames[dayIndex]}</h2>
                <Dialog open={isAddDialogOpen && activeDay === dayIndex} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => openAddDialog(dayIndex)}>
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة تمرين
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>إضافة تمرين جديد — {dayNames[dayIndex]}</DialogTitle>
                    </DialogHeader>
                    <ExerciseForm
                      exercise={newExercise}
                      onChange={setNewExercise}
                      onSubmit={handleAdd}
                      submitLabel="إضافة"
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {getExercisesForDay(dayIndex).length === 0 ? (
                  <Card className="bg-muted/50">
                    <CardContent className="p-8 text-center text-muted-foreground">
                      لا توجد تمارين لهذا اليوم
                    </CardContent>
                  </Card>
                ) : (
                  getExercisesForDay(dayIndex).map((exercise) => (
                    <Card key={exercise.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{exercise.name}</h3>
                              <Badge variant="secondary">{exercise.sets} × {exercise.reps}</Badge>
                            </div>
                            {exercise.formNote && (
                              <p className="text-sm text-muted-foreground mt-2">{exercise.formNote}</p>
                            )}
                            {exercise.youtubeUrl && (
                              <a
                                href={exercise.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                              >
                                <Play className="h-3 w-3" />
                                فيديو
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(exercise)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(exercise.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل التمرين</DialogTitle>
            </DialogHeader>
            {editingExercise && (
              <ExerciseForm
                exercise={editingExercise}
                onChange={(updated: any) => setEditingExercise({ ...editingExercise, ...updated })}
                onSubmit={handleUpdate}
                submitLabel="حفظ التغييرات"
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

function ExerciseForm({
  exercise,
  onChange,
  onSubmit,
  submitLabel,
}: {
  exercise: any;
  onChange: (exercise: any) => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label>اسم التمرين *</Label>
        <Input
          value={exercise.name}
          onChange={(e) => onChange({ ...exercise, name: e.target.value })}
          placeholder="مثال: بنش بريس"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>المجموعات *</Label>
          <Input
            type="number"
            value={exercise.sets}
            onChange={(e) => onChange({ ...exercise, sets: parseInt(e.target.value) || 0 })}
            min={0}
          />
        </div>
        <div className="space-y-2">
          <Label>العدات *</Label>
          <Input
            value={exercise.reps}
            onChange={(e) => onChange({ ...exercise, reps: e.target.value })}
            placeholder="مثال: 10-12"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>ملاحظة الأداء الصحيح</Label>
        <Textarea
          value={exercise.formNote || ""}
          onChange={(e) => onChange({ ...exercise, formNote: e.target.value })}
          placeholder="وصف طريقة الأداء الصحيحة..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>رابط فيديو يوتيوب</Label>
        <Input
          value={exercise.youtubeUrl || ""}
          onChange={(e) => onChange({ ...exercise, youtubeUrl: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
          dir="ltr"
        />
      </div>
      <div className="space-y-2">
        <Label>رابط صورة العضلة</Label>
        <Input
          value={exercise.muscleImageUrl || ""}
          onChange={(e) => onChange({ ...exercise, muscleImageUrl: e.target.value })}
          placeholder="https://..."
          dir="ltr"
        />
      </div>
      <Button onClick={onSubmit} className="w-full">
        <Save className="h-4 w-4 ml-2" />
        {submitLabel}
      </Button>
    </div>
  );
}
