# Workflow de Engenharia Gabarit.ai

## 1. Loop TDD Estrito
1.  **Red**: Escreva um teste falho em `apps/api/tests` ou `apps/web/tests`.
2.  **Green**: Implemente o código mínimo para passar no teste.
3.  **Refactor**: Melhore o código mantendo o teste passando.

## 2. Validação de Interface (Browser Agent)
Antes de cada commit, execute:
```bash
npx playwright test
```
O Agent validará fluxos críticos (Login, Dashboard, Resolução de Questão).

## 3. Padrão de Commit (Conventional Commits)
Sempre use o prefixo correto:
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `test:` Adição/Correção de testes
- `refactor:` Mudança no código que não altera comportamento

Exemplo: `feat(api): implement spaced repetition sm2 algorithm`

## 4. Setup do Playwright
```bash
cd apps/web
npx playwright install
```
