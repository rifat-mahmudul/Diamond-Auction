import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/app/actions/auth";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" }, // 🔁 updated from email
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        const result = await loginUser({
          username: credentials.username,
          password: credentials.password,
        });

        if (!result.success) {
          throw new Error(result.message || "Invalid credentials");
        }

        // Return the user object that will be stored in the JWT
        return {
          id: result.data._id,
          name: result.data.username,
          email: result.data.email || "", // Ensure email is included
          role: result.data.role,
          token: result.token,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
});

export { handler as GET, handler as POST };
