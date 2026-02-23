"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default function SignInPage() {
    const [email, setEmail] = useState("test@example.com")
    const [password, setPassword] = useState("424242")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await signIn("credentials", {
            email,
            password,
            callbackUrl: "/dashboard"
        })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/30">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Entrar no Gabarit.ai</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">E-mail</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Senha</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Entrar</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
