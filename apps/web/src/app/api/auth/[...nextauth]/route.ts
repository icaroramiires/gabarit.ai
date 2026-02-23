import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import jwtLib from "jsonwebtoken"

const SECRET = process.env.NEXTAUTH_SECRET || "xTRUfbAHqYpnODz3epGEaF68Mvj7qWN/Y1qckouWlYs="

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // This is a mockup. In a real app, you would verify against a DB.
                if (credentials?.email === "test@example.com" && credentials?.password === "424242") {
                    return { id: "1", name: "Estudante Premium", email: "test@example.com" }
                }
                return null
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id
            }
            if (account) {
                // For credentials provider, we create a signed JWT that the backend can verify
                // using the shared NEXTAUTH_SECRET.
                const backendToken = jwtLib.sign({ sub: token.id || token.sub }, SECRET, { algorithm: 'HS256', expiresIn: '1d' })
                token.accessToken = backendToken
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = (token as any).id;
                (session.user as any).accessToken = (token as any).accessToken;
            }
            return session
        }
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: "xTRUfbAHqYpnODz3epGEaF68Mvj7qWN/Y1qckouWlYs=",
})



export { handler as GET, handler as POST }
