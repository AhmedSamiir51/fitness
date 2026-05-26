"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeightEntry {
  id: number;
  weightKg: number;
  date: string;
}

export default function WeightPage() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/weight");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch {
      toast.error("فشل في جلب قياسات الوزن");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newWeight || !newDate) {
      toast.error("يرجى إدخال الوزن والتاريخ");
      return;
    }
    try {
      const res = await fetch("/api/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weightKg: parseFloat(newWeight), date: newDate }),
      });
      if (res.ok) {
        toast.success("تم إضافة القياس بنجاح");
        setNewWeight("");
        setNewDate(new Date().toISOString().split("T")[0]);
        fetchEntries();
      } else {
        toast.error("فشل في إضافة القياس");
      }
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا القياس؟")) return;
    try {
      const res = await fetch(`/api/weight/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم حذف القياس بنجاح");
        fetchEntries();
      } else {
        toast.error("فشل في حذف القياس");
      }
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const chartData = entries.map((e) => ({
    date: new Date(e.date).toLocaleDateString("ar-SA"),
    weight: e.weightKg,
  }));

  const latestWeight = entries.length > 0 ? entries[entries.length - 1].weightKg : null;
  const firstWeight = entries.length > 0 ? entries[0].weightKg : null;
  const weightDiff = latestWeight && firstWeight ? (latestWeight - firstWeight).toFixed(1) : null;

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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <TrendingDown className="h-7 w-7 text-primary" />
            تتبع الوزن
          </h1>
          <p className="text-muted-foreground mt-1">سجل قياسات وزنك وتابع تطورك</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">أحدث وزن</p>
              <p className="text-2xl font-bold">{latestWeight ? `${latestWeight} كجم` : "—"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">عدد القياسات</p>
              <p className="text-2xl font-bold">{entries.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">التغيير من أول قياس</p>
              <p className={`text-2xl font-bold ${weightDiff && parseFloat(weightDiff) < 0 ? "text-green-500" : weightDiff && parseFloat(weightDiff) > 0 ? "text-red-500" : ""}`}>
                {weightDiff ? `${weightDiff > "0" ? "+" : ""}${weightDiff} كجم` : "—"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>رسم بياني لتطور الوزن</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full min-w-0" dir="ltr">
                <ResponsiveContainer width="100%" height={300} minWidth={0}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} domain={["auto", "auto"]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value} كجم`, "الوزن"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: "#22c55e", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Entry Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">إضافة قياس جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <Label htmlFor="weight">الوزن (كجم) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="مثال: 85.5"
                />
              </div>
              <div className="flex-1 w-full">
                <Label htmlFor="date">التاريخ *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <Button onClick={handleAdd} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 ml-2" />
                إضافة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">سجل القياسات</CardTitle>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">لا توجد قياسات مسجلة</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الوزن (كجم)</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...entries].reverse().map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{new Date(entry.date).toLocaleDateString("ar-SA")}</TableCell>
                        <TableCell className="font-medium">{entry.weightKg}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(entry.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
