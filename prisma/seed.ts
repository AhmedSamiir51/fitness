// Load env vars FIRST
import { config } from "dotenv";
config({ path: ".env", override: true });

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@fitness.app";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123456";

// Arabic week: 0=Saturday, 1=Sunday, 2=Monday, 3=Tuesday, 4=Wednesday, 5=Thursday, 6=Friday
const defaultExercises = [
  // Day 0 - Saturday: صدر وتراي
  { dayOfWeek: 0, name: "بنش بريس (بار/دمبل)", sets: 4, reps: "١٠–١٢", formNote: "النزول ببطء حتى منتصف الصدر، المرفقان بزاوية ٤٥°، ابدأ بالبار فقط.", youtubeUrl: "https://www.youtube.com/watch?v=gRVjAtPip0Y", muscleImageUrl: null, orderIndex: 0 },
  { dayOfWeek: 0, name: "بنش مائل علوي دمبل", sets: 3, reps: "١٢", formNote: "الكرسي بزاوية ٣٠–٤٥°، ادفع لأعلى دون تصادم الدمبل، تحكم في النزول.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 1 },
  { dayOfWeek: 0, name: "تفتيح صدر دمبل/كابل", sets: 3, reps: "١٢–١٥", formNote: "انحناء بسيط بالمرفق ثابت، افتح الذراعين كقوس واعصر الصدر.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 2 },
  { dayOfWeek: 0, name: "تراي كابل بوش داون", sets: 3, reps: "١٢", formNote: "المرفقان ملتصقان بالجنب وثابتان، الحركة من الكوع فقط.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 3 },
  { dayOfWeek: 0, name: "تراي خلف الرأس دمبل", sets: 3, reps: "١٢", formNote: "المرفقان قريبان من الرأس، انزل خلف الرأس ببطء.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 4 },

  // Day 1 - Sunday: ظهر وباي
  { dayOfWeek: 1, name: "سحب أرضي (كابل رو)", sets: 4, reps: "١٠–١٢", formNote: "الظهر مفرود، اسحب نحو البطن واعصر لوحي الكتف، بدون تأرجح.", youtubeUrl: "https://www.youtube.com/results?search_query=lat+pulldown+proper+form", muscleImageUrl: null, orderIndex: 0 },
  { dayOfWeek: 1, name: "سحب عالي (لات بول داون)", sets: 4, reps: "١٠–١٢", formNote: "اسحب البار لأعلى الصدر، الصدر مرفوع قليلاً، نزول بطيء.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 1 },
  { dayOfWeek: 1, name: "تجديف دمبل بيد واحدة", sets: 3, reps: "١٢ لكل يد", formNote: "ركبة ويد على الكرسي، الظهر مستوٍ، اسحب نحو الورك.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 2 },
  { dayOfWeek: 1, name: "باي بار", sets: 3, reps: "١٠–١٢", formNote: "المرفقان ثابتان بالجنب، ارفع دون تحريك الكتف.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 3 },
  { dayOfWeek: 1, name: "باي مطرقة دمبل (هامر)", sets: 3, reps: "١٢", formNote: "قبضة محايدة، ارفع دون تأرجح.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 4 },

  // Day 2 - Monday: راحة أو كارديو خفيف
  { dayOfWeek: 2, name: "مشي سريع أو دراجة", sets: 1, reps: "٤٠ دقيقة", formNote: "مشي سريع ٤٠ دقيقة أو دراجة، أو راحة كاملة.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 0 },

  // Day 3 - Tuesday: أرجل وكتف
  { dayOfWeek: 3, name: "سكوات (بار/دمبل)", sets: 4, reps: "١٠–١٢", formNote: "القدمان بعرض الكتف، انزل وكأنك تجلس على كرسي، الركبة باتجاه أصابع القدم، الظهر مفرود، ابدأ بوزن الجسم.", youtubeUrl: "https://www.youtube.com/watch?v=gf3Vd4LVymk", muscleImageUrl: null, orderIndex: 0 },
  { dayOfWeek: 3, name: "ليج بريس (جهاز)", sets: 3, reps: "١٢", formNote: "القدمان مستويتان، لا تفرد الركبة فرداً كاملاً عنيفاً.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 1 },
  { dayOfWeek: 3, name: "ليج كيرل + إكستنشن", sets: 3, reps: "١٢ لكل واحد", formNote: "حركة بطيئة متحكمة، اعصر العضلة في النهاية.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 2 },
  { dayOfWeek: 3, name: "كتف ضغط دمبل (شولدر بريس)", sets: 4, reps: "١٠–١٢", formNote: "ادفع لأعلى دون قوس مبالغ في الظهر.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 3 },
  { dayOfWeek: 3, name: "رفرفة جانبي دمبل", sets: 3, reps: "١٥", formNote: "وزن خفيف، ارفع للجانب حتى مستوى الكتف فقط.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 4 },

  // Day 4 - Wednesday: بطن وكارديو
  { dayOfWeek: 4, name: "تمارين بطن متنوعة", sets: 4, reps: "١٥–٢٠", formNote: "بلانك، كرنش، رفع أرجل، بدون شد الرقبة.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 0 },
  { dayOfWeek: 4, name: "كارديو (مشي مائل/دراجة)", sets: 1, reps: "٢٥–٣٠ دقيقة", formNote: "نبض متوسط، المشي المائل ممتاز لحرق الدهون.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 1 },

  // Day 5 - Thursday: راحة
  { dayOfWeek: 5, name: "يوم راحة", sets: 0, reps: "-", formNote: "يوم راحة كاملة للتعافي.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 0 },

  // Day 6 - Friday: راحة
  { dayOfWeek: 6, name: "يوم راحة", sets: 0, reps: "-", formNote: "يوم راحة كاملة للتعافي.", youtubeUrl: null, muscleImageUrl: null, orderIndex: 0 },
];

async function main() {
  console.log("بدء تهيئة البيانات...");

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  let admin;
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    admin = await prisma.user.create({
      data: {
        name: "الأدمن",
        email: ADMIN_EMAIL,
        passwordHash,
        role: Role.ADMIN,
        isActive: true,
      },
    });
    console.log(`تم إنشاء حساب الأدمن: ${admin.email}`);
  } else {
    admin = existingAdmin;
    console.log(`حساب الأدمن موجود مسبقاً: ${admin.email}`);
  }

  // Seed exercises for admin
  const existingExercises = await prisma.exercise.findMany({
    where: { userId: admin.id },
  });

  if (existingExercises.length === 0) {
    for (const ex of defaultExercises) {
      await prisma.exercise.create({
        data: {
          ...ex,
          userId: admin.id,
        },
      });
    }
    console.log(`تم إضافة ${defaultExercises.length} تمرين للأدمن`);
  } else {
    console.log(`التمارين موجودة مسبقاً للأدمن (${existingExercises.length} تمرين)`);
  }

  // Add initial weight entry
  const existingWeight = await prisma.weightEntry.findFirst({
    where: { userId: admin.id },
  });

  if (!existingWeight) {
    await prisma.weightEntry.create({
      data: {
        userId: admin.id,
        weightKg: 94,
        date: new Date(),
      },
    });
    console.log("تم إضافة أول قياس وزن (٩٤ كجم)");
  }

  console.log("اكتملت التهيئة بنجاح!");
}

main()
  .catch((e) => {
    console.error("خطأ في التهيئة:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
