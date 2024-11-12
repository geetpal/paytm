import CredentialsProvider from "next-auth/providers/credentials"
import db from "@repo/db/client"
import bcrypt from "bcrypt"


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: "Phone number", type: "text", placeholder: "xxx-xxx-xxxx" },
                password: { label: "Password", type: "password", placeholder: "*********" }
            },
            //Note: Authorized is the function that gets called anytime we click on Submit Button which in this case is "Sign in with Credentials"
            async authorize(credentials: any) {
                // Here we can do ZOD validations, OTP validations
                const hashedPassword = await bcrypt.hash(credentials.password, 10); //Converts the password into a hash 
                const existingUser = await db.user.findFirst({
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
                    const user = await db.user.create({
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