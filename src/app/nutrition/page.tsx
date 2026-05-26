"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Apple, Clock, Droplets, Utensils, AlertTriangle } from "lucide-react";

const meals = [
  {
    name: "الإفطار",
    time: "٩ ص",
    icon: Clock,
    items: ["رغيف عيش بلدي", "بيض / جبنة قليلة الدسم", "خضار"],
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    name: "الغداء",
    time: "٣ ع",
    icon: Utensils,
    items: ["بروتين مشوي بحجم الكف", "كوب رز أو مكرونة", "سلطة كبيرة"],
    note: "أكبر وجبة في اليوم",
    color: "bg-green-500/10 text-green-500",
  },
  {
    name: "العشاء",
    time: "٩ م",
    icon: Apple,
    items: ["رغيف عيش بلدي", "بيض / جبنة", "خضار"],
    note: "أخف وجبة في اليوم",
    color: "bg-blue-500/10 text-blue-500",
  },
];

const guidelines = [
  "قلل الملح قدر الإمكان",
  "تجنب السكر المضاف",
  "لا تتناول السناكس والحلويات",
  "فضل المشوي والمسلوق على المقلي",
  "اشرب ٢.٥–٣ لتر ماء يومياً",
  "تجنب المشروبات الغازية",
];

export default function NutritionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Apple className="h-7 w-7 text-primary" />
            نظامي الغذائي
          </h1>
          <p className="text-muted-foreground mt-1">
            مبادئ التغذية الأساسية لدعم أهدافك
          </p>
        </div>

        {/* Meal Schedule */}
        <div className="space-y-4 mb-8">
          {meals.map((meal, index) => (
            <Card key={meal.name}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${meal.color} flex items-center justify-center shrink-0`}>
                    <meal.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold">{meal.name}</h3>
                      <Badge variant="outline">{meal.time}</Badge>
                      {meal.note && (
                        <Badge variant="secondary" className="text-xs">
                          {meal.note}
                        </Badge>
                      )}
                    </div>
                    <ul className="mt-3 space-y-1">
                      {meal.items.map((item, i) => (
                        <li key={i} className="text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-primary" />
              إرشادات عامة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {guidelines.map((guideline, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <Droplets className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm">{guideline}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Water Reminder */}
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Droplets className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">تذكير: اشرب ماء!</h3>
                <p className="text-muted-foreground">
                  هدفك ٢.٥–٣ لتر يومياً. حافظ على ترطيب جسمك لأداء أفضل في التمارين.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
