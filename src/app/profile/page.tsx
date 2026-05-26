"use client";

import { useSession } from "next-auth/react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Calendar, Ruler, Weight, Target, Info } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  const user = session?.user;

  if (!user) {
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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">البروفايل</h1>
          <p className="text-muted-foreground mt-1">معلومات حسابك الشخصية</p>
        </div>

        {/* User Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground" dir="ltr">
                    {user.email}
                  </span>
                </div>
                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                  className="mt-2"
                >
                  <Shield className="h-3 w-3 ml-1" />
                  {user.role === "ADMIN" ? "مدير النظام" : "مستخدم"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              المعلومات الشخصية (مرجع)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">العمر</p>
                  <p className="font-medium">٢٩ سنة</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Ruler className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">الطول</p>
                  <p className="font-medium">١٧١.٥ سم</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Weight className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">الوزن الحالي</p>
                  <p className="font-medium">٩٤ كجم</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Target className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">الهدف</p>
                  <p className="font-medium">٧٥–٧٨ كجم</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>معرّف الحساب:</span>
              <span dir="ltr">{user.id}</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
