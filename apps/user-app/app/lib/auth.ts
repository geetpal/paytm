import CredentialsProvider from "next-auth/providers/credentials"
import * as db from "@repo/db/client"
import bcrypt from "bcrypt"


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: "Phone number", type: "text", placeholder: "xxx-xxx-xxxx" },
                password: { label: "Password", type: "password", placeholder: "*********" }
            },
            async authorize(credentials: any) {
                const hashedPassword = await bcrypt.hash(credentials.password, 10);
                const existingUser = await db.User.findFirst({
                    where: { number: credentials.phone }
                })
                if (existingUser) {
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password)
                    if (passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            phone: existingUser.number
                        }
                    }
                    return null
                }

                try {
                    //Create user
                    const user = await db.User.create({
                        data: {
                            number: credentials.phone,
                            password: hashedPassword
                        }
                    });
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        phone: user.number
                    }
                } catch (e) {
                    console.error(e)
                }

                return null
            }
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async session({ token, session }: any) {
            session.user.id = token.sub
            return session
        }
    }
}