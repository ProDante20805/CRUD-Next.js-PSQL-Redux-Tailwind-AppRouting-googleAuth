import { NextApiHandler } from "next";
import User from "@/models/User";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { email } = user;
        try {
          const isUserExists = await User.findOne({ where: { email } });

          if (!isUserExists) {
            const password = "pb145114";
            const res = await axios.post("http://localhost:3000/api/auth/signup", { email, password });
          } else {
            return true; // User exists, sign-in is successful
          }
          return true;
        } catch (error) {
          console.error("Error during sign-in:", error);
          return false; // Fail the sign-in process if there's an error
        }
      }

      return false; // Fail the sign-in process by default
    },
  },
};

const handler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
