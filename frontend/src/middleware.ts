import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// As rotas que exigem login para serem acessadas
const protectedRoutes = ['/dashboard', '/assessment'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('gabaritai_token')?.value;
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // Usuário deslogado tentando acessar área restrita -> Manda pro Login
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Usuário já logado tentando ver tela de Login/Cadastro -> Pula direto pro Dashboard
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Aplica o Middleware para rotas dinâmicas, mas ignora API publicas e estáticos (_next/static)
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
