export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/plan/:path*", "/weight/:path*", "/inbody/:path*", "/nutrition/:path*", "/profile/:path*"],
};
