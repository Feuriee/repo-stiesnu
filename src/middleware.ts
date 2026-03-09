import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // Protect dashboard routes
      if (req.nextUrl.pathname.startsWith("/dashboard")) {
        return token?.role === "ADMIN" || token?.role === "DOSEN";
      }
      
      // Specifically protect user management to ADMIN only
      if (req.nextUrl.pathname.startsWith("/dashboard/users")) {
        return token?.role === "ADMIN";
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
