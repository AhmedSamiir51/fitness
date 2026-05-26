"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Dumbbell,
  CalendarDays,
  Weight,
  Image,
  Apple,
  Shield,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const userNavItems = [
  { href: "/dashboard", label: "تمرين اليوم", icon: Dumbbell },
  { href: "/plan", label: "خطة الأسبوع", icon: CalendarDays },
  { href: "/weight", label: "تتبع الوزن", icon: Weight },
  { href: "/inbody", label: "صور InBody", icon: Image },
  { href: "/nutrition", label: "نظامي الغذائي", icon: Apple },
  { href: "/profile", label: "البروفايل", icon: User },
];

const adminNavItems = [
  { href: "/admin", label: "لوحة الأدمن", icon: Shield },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";
  const allNavItems = [...userNavItems, ...(isAdmin ? adminNavItems : [])];

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden sm:block">نظام التمارين</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {allNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user && (
              <span className="text-sm text-muted-foreground">
                {session.user.name}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 ml-2" />
              خروج
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-4 mt-8">
                  {allNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                  <hr className="border-border my-2" />
                  {session?.user && (
                    <div className="px-3 text-sm text-muted-foreground">
                      {session.user.name}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="justify-start text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="h-5 w-5 ml-3" />
                    تسجيل الخروج
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
