import httpx
import json
from ...domain.interfaces import IAiTutorService

class OllamaTutorService(IAiTutorService):
    def __init__(self, base_url: str = "http://localhost:11434", model: str = "llama3"):
        self.base_url = base_url
        self.model = model

    async def generate_explanation(self, question_text: str, user_answer: str, correct_answer: str) -> str:
        prompt = f"""Você é um Tutor Pedagógico especialista para alunos de alto rendimento.
O aluno acabou de errar uma questão.
Sua missão é explicar *por que* o aluno errou, guiando-o para a resposta correta de forma socrática, sem apenas dar a resposta de mão beijada.

Questão: {question_text}
O que o aluno escolheu (INCORRETO): {user_answer}
A resposta correta era: {correct_answer}

Forneça uma explicação concisa, instigante e educadora.
"""

        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json=payload,
                    timeout=30.0
                )
                response.raise_for_status()
                result = response.json()
                return result.get("response", "Eu não consegui formular uma explicação agora. Tente novamente mais tarde.")
        except Exception as e:
            print(f"Erro ao contatar Ollama ({self.model}): {e}")
            return f"Houve um problema ao consultar a IA Local (Ollama) neste momento. O erro apresentado foi: {str(e)}"
