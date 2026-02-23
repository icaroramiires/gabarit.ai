import google.generativeai as genai


class AIService:
    def __init__(self):
        # In a real GCP environment, authentication is usually handled via ADC.
        # Here we assume the environment is configured.
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def explain_error(self, question: str, user_answer: str, correct_answer: str) -> str:
        prompt = f"""
        Você é um tutor pedagógico de alto rendimento para o gabarit.ai. 
        O aluno errou a seguinte questão:
        Questão: {question}
        Resposta do Aluno: {user_answer}
        Resposta Correta: {correct_answer}
        
        Explique de forma concisa e didática o erro pedagogico e o conceito por trás da questão. 
        Não dê apenas a resposta, foque no aprendizado.
        """
        response = self.model.generate_content(prompt)
        return response.text
