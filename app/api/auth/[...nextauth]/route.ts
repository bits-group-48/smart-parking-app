import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "@/lib/db-config";
import User from "@/schema/userModel";
import Admin from "@/schema/adminModel";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                try {
                    // Connect to database
                    await connect();

                    // Find user by email (admins also authenticate through User table)
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("Invalid email or password");
                    }

                    // Compare password
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        throw new Error("Invalid email or password");
                    }

                    // Check if user is admin
                    const admin = await Admin.findOne({ email: credentials.email });
                    const role = admin ? "admin" : "user";

                    // Return user object (this will be available in session)
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        userId: user.userId || user.email,
                        role: role,
                    };
                } catch (error: any) {
                    throw new Error(error.message || "Authentication failed");
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.userId = (user as any).userId;
                token.email = user.email;
                token.name = user.name;
                token.role = (user as any).role || "user";
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    userId: token.userId as string,
                    email: token.email as string,
                    name: token.name as string,
                    role: token.role as string,
                };
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

