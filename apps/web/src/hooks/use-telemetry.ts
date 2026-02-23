import { apiFetch } from "@/lib/api"
import { useSession } from "next-auth/react"

export function useTelemetry() {
    const { data: session } = useSession()

    const trackEvent = async (eventName: string, payload: Record<string, any> = {}) => {
        // Ignora telemetria se não houver usuário logado
        if (!session?.user) return

        try {
            await apiFetch('/study/telemetry', {
                method: 'POST',
                body: JSON.stringify({
                    event_name: eventName,
                    data: {
                        ...payload,
                        user_id: (session.user as any).id || session.user.email,
                        timestamp: new Date().toISOString()
                    }
                })
            })
            console.log(`[Telemetry] Dispatched: ${eventName}`)
        } catch (error) {
            console.error(`[Telemetry Error] Falha ao enviar evento ${eventName}`, error)
        }
    }

    return { trackEvent }
}
