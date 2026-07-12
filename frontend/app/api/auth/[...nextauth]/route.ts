import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      // If the env variable is missing, we use a mock string so it doesn't crash on boot
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_testing_only_12345",
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };