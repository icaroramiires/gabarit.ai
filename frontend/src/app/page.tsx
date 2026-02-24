import { redirect } from 'next/navigation';

export default function Home() {
  // Redirecionando a página inicial raiz direto para o fluxo de onboarding/login no MVP.
  // Em futuras iterações auth, checaremos o cookie para mandar para /dashboard ou /login.
  redirect('/login');
}
