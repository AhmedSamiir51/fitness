"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImagePlus, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface InbodyImage {
  id: number;
  imageUrl: string;
  date: string;
  createdAt: string;
}

export default function InbodyPage() {
  const [images, setImages] = useState<InbodyImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedImage, setSelectedImage] = useState<InbodyImage | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/inbody");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch {
      toast.error("فشل في جلب الصور");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newImageUrl || !newDate) {
      toast.error("يرجى إدخال رابط الصورة والتاريخ");
      return;
    }
    try {
      const res = await fetch("/api/inbody", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: newImageUrl, date: newDate }),
      });
      if (res.ok) {
        toast.success("تم إضافة الصورة بنجاح");
        setNewImageUrl("");
        setNewDate(new Date().toISOString().split("T")[0]);
        setIsAddOpen(false);
        fetchImages();
      } else {
        toast.error("فشل في إضافة الصورة");
      }
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;
    try {
      const res = await fetch(`/api/inbody/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم حذف الصورة بنجاح");
        fetchImages();
      } else {
        toast.error("فشل في حذف الصورة");
      }
    } catch {
      toast.error("حدث خطأ");
    }
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ImagePlus className="h-7 w-7 text-primary" />
              صور InBody
            </h1>
            <p className="text-muted-foreground mt-1">أرشيف صور تقارير InBody</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <ImagePlus className="h-4 w-4 ml-2" />
                إضافة صورة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة صورة InBody جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>رابط الصورة *</Label>
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    أدخل رابط الصورة مباشرة (يمكنك رفع الصورة لخدمة تخزين مثل Imgur أو Cloudinary)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>التاريخ *</Label>
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>
                <Button onClick={handleAdd} className="w-full">
                  إضافة
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {images.length === 0 ? (
          <Card className="bg-muted/50">
            <CardContent className="p-12 text-center">
              <ImagePlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد صور</h3>
              <p className="text-muted-foreground">
                أضف صور InBody الأولى لتبدأ ببناء الأرشيف
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden group">
                <div
                  className="aspect-[3/4] bg-muted cursor-pointer overflow-hidden"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.imageUrl}
                    alt={`InBody ${new Date(image.date).toLocaleDateString("ar-SA")}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='14'%3Eتعذر تحميل الصورة%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(image.date).toLocaleDateString("ar-SA")}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(image.id)}
                      className="text-destructive hover:text-destructive h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Full Image Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedImage && new Date(selectedImage.date).toLocaleDateString("ar-SA")}
              </DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <img
                src={selectedImage.imageUrl}
                alt="InBody Full"
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='14'%3Eتعذر تحميل الصورة%3C/text%3E%3C/svg%3E";
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
