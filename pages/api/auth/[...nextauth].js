import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as AuthApi from '../../../src/lib/authApi';

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "login",
            async authorize(credentials) {
                const payload = {
                    email: credentials.email,
                    password: credentials.password,
                };
                try {
                    return await AuthApi.login(payload);
                } catch (error) {
                    throw new Error(error);
                }
            },
        }),

    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt"
    },
    events: {
        async signOut({ token, session }) {
            try {
                return await AuthApi.logout(token.user.data.token);
            } catch (error) {
                throw new Error(error);
            }
        },
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
                return {
                    ...token,
                    accessToken: user.data.token,
                    refreshToken: user.data.refreshToken,
                };
            }
            return token;

        },

        async session({ session, token }) {
            session.user = token.user.data;
            return session;
        },
    },
    secret: process.env.JWT_SECRET
}

export default NextAuth(authOptions);