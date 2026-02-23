"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export function useNextSessions() {
    return useQuery({
        queryKey: ["next-sessions"],
        queryFn: () => apiFetch("/study/next-sessions"),
    });
}

export function useRecordReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ sessionId, quality }: { sessionId: number; quality: number }) =>
            apiFetch("/study/review", {
                method: "POST",
                body: JSON.stringify({ session_id: sessionId, quality }),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["next-sessions"] });
        },
    });
}

export function useAIExplain() {
    return useMutation({
        mutationFn: (data: { question: string; userAnswer: string; correctAnswer: string }) =>
            apiFetch("/study/ai/explain", {
                method: "POST",
                body: JSON.stringify({
                    question_text: data.question,
                    user_answer: data.userAnswer,
                    correct_answer: data.correctAnswer
                }),
            }),
    });
}

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: () => apiFetch("/study/dashboard/stats"),
    });
}
