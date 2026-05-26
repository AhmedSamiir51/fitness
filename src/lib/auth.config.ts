import type { NextAuthConfig } from "next-auth";

export default {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role === "ADMIN";

      const protectedPaths = ["/dashboard", "/plan", "/weight", "/inbody", "/nutrition", "/profile"];
      const isProtected = protectedPaths.some((p) => nextUrl.pathname.startsWith(p));
      const isAdminPath = nextUrl.pathname.startsWith("/admin");

      if (isAdminPath && !isAdmin) {
        return false;
      }

      if ((isProtected || isAdminPath) && !isLoggedIn) {
        return false;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
