import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axiosInstance from '../../../src/config/api';

const CredentialInstance = CredentialsProvider({
  async authorize(credentials) {
    try {
      const { email, password } = credentials;
      const res = await axiosInstance.post('users/login', {
        email,
        password,
      });
      const user = res.data.data.result;
      return user;
    } catch (error) {
      throw error.response.data;
    }
  },
});

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [CredentialInstance],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
