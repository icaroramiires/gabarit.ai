"use client"

import * as React from "react"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAIExplain, useRecordReview } from "@/hooks/use-study"
import { Loader2, Sparkles, ArrowRight, CheckCircle, XCircle, Clock, CheckCircle2, Flame, Trophy } from "lucide-react"

export function QuestionInterface() {


    const [selectedOption, setSelectedOption] = React.useState<number | null>(null)
    const [isAnswered, setIsAnswered] = React.useState(false)
    const [aiExplanation, setAIExplanation] = React.useState<string | null>(null)

    const aiExplainMutation = useAIExplain()
    const recordReviewMutation = useRecordReview()

    const question = {
        id: 4502,
        subject: "Direito Administrativo",
        topic: "Atos Administrativos",
        statement: "No que se refere ao desfazimento de atos administrativos, a anulação produz efeitos ex tunc, enquanto a revogação produz efeitos ex nunc.",
        options: [
            "Verdadeiro",
            "Falso"
        ],
        correctAnswer: "Verdadeiro"
    }

    const handleAnswer = () => {
        setIsAnswered(true)
        const quality = selectedOption === 0 ? 5 : 1 // Simple quality mapping for demo
        recordReviewMutation.mutate({ sessionId: question.id, quality })
    }

    const handleAIExplain = () => {
        aiExplainMutation.mutate({
            question: question.statement,
            userAnswer: question.options[selectedOption!],
            correctAnswer: question.correctAnswer
        }, {
            onSuccess: (data) => {
                setAIExplanation(data.explanation)
            }
        })
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{question.subject}</Badge>
                        <Badge variant="secondary">{question.topic}</Badge>
                    </div>
                    <h2 className="text-lg font-semibold mt-1">Questão #{question.id}</h2>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium mb-1">Carga Horária sugerida: 45 min</div>
                    <Progress value={65} className="w-[150px]" />
                </div>
            </div>

            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="text-xl font-normal leading-relaxed leading-8">
                        {question.statement}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                    {question.options.map((option, index) => (
                        <Button
                            key={index}
                            variant={selectedOption === index ? "default" : "outline"}
                            className={`h-auto p-4 justify-start text-left text-wrap ${isAnswered && index === 0 ? "border-green-500 bg-green-50 dark:bg-green-900/10" : ""
                                } ${isAnswered && index === 1 && selectedOption === 1 ? "border-red-500 bg-red-50 dark:bg-red-900/10" : ""
                                }`}
                            onClick={() => !isAnswered && setSelectedOption(index)}
                            disabled={isAnswered}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${selectedOption === index ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground"}`}>
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <span className="flex-1">{option}</span>
                                {isAnswered && index === 0 && <CheckCircle className="h-5 w-5 text-green-500" />}
                                {isAnswered && index === 1 && selectedOption === 1 && <XCircle className="h-5 w-5 text-red-500" />}
                            </div>
                        </Button>
                    ))}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4 mt-2">
                    <div className="flex gap-2 w-full justify-between items-center">
                        <div className="flex gap-2">
                            {!isAnswered ? (
                                <Button
                                    onClick={handleAnswer}
                                    disabled={selectedOption === null}
                                >
                                    Responder <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button onClick={() => { setIsAnswered(false); setSelectedOption(null); setAIExplanation(null); }}>
                                    Próxima Questão <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                            {isAnswered && selectedOption !== 0 && (
                                <Button
                                    variant="outline"
                                    className="gap-2 text-primary font-bold"
                                    onClick={handleAIExplain}
                                    disabled={aiExplainMutation.isPending}
                                >
                                    {aiExplainMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Sparkles className="h-4 w-4" />}
                                    Tutor IA
                                </Button>
                            )}
                        </div>
                        {isAnswered && (
                            <div className="flex gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><CheckCircle className="size-4 text-green-500" /> 82%</span>
                                <span className="flex items-center gap-1"><XCircle className="size-4 text-red-500" /> 18%</span>
                            </div>
                        )}
                    </div>
                </CardFooter>
            </Card>

            {aiExplanation && (
                <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader>
                        <CardTitle className="text-md flex items-center gap-2">
                            <Sparkles className="size-4 text-primary" />
                            Explicação do Tutor IA
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {aiExplanation}
                        </p>
                    </CardContent>
                </Card>
            )}

            {!aiExplanation && isAnswered && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/50">
                        <CardHeader className="py-3">
                            <CardTitle className="text-sm">Estatísticas da Comunidade</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <div className="flex justify-between mb-1">
                                <span>Taxa de Acerto</span>
                                <span className="font-bold">78%</span>
                            </div>
                            <Progress value={78} className="h-2" />
                        </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                        <CardHeader className="py-3">
                            <CardTitle className="text-sm">Seu Histórico</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <div className="flex justify-between">
                                <span>Último encontro</span>
                                <span className="font-bold">Há 4 dias</span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span>Tentativas</span>
                                <span className="font-bold text-green-500">2 Acertos / 0 Erros</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

