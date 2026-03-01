import { AnswerRepository } from '../../../assessment/domain/repositories/answer-repository';
import { FlashcardRepository } from '../../../flashcards/domain/repositories/flashcard-repository';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import PDFDocument = require('pdfkit');

export class GeneratePerformanceReportUseCase {
    constructor(
        private readonly answerRepo: AnswerRepository,
        private readonly flashcardRepo: FlashcardRepository
    ) { }

    async execute(userId: string): Promise<Buffer> {
        const since = new Date();
        since.setDate(since.getDate() - 30); // Monthly report

        const [weeklyPerformance, history, flashcardStats] = await Promise.all([
            this.answerRepo.getWeeklyPerformanceBySubject(userId, since),
            this.answerRepo.getDailyPerformanceHistory(userId, 30),
            this.flashcardRepo.getPerformanceStats(new UniqueEntityID(userId))
        ]);

        const totalQuestions = history.reduce((acc: number, curr: any) => acc + curr.totalAnswered, 0);
        const correctQuestions = history.reduce((acc: number, curr: any) => acc + curr.correctAnswers, 0);
        const globalAccuracy = totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0;

        return new Promise((resolve) => {
            const doc = new PDFDocument({ margin: 50 });
            const chunks: Buffer[] = [];

            doc.on('data', (chunk: Buffer) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // Header
            doc.fontSize(24).text('GabaritAI - Relatório de Desempenho', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).text(`Emitido em: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'right' });
            doc.moveDown(2);

            // Summary Section
            doc.fontSize(16).text('Resumo Global (Últimos 30 dias)', { underline: true });
            doc.moveDown();
            doc.fontSize(12).text(`Total de Questões Respondidas: ${totalQuestions}`);
            doc.text(`Taxa de Acerto Global: ${globalAccuracy.toFixed(1)}%`);
            doc.text(`Total de Flashcards Revisados: ${flashcardStats.totalReviews}`);
            doc.moveDown(2);

            // Performance by Subject
            doc.fontSize(16).text('Desempenho por Disciplina', { underline: true });
            doc.moveDown();

            weeklyPerformance.forEach((subject: any) => {
                doc.fontSize(12).text(`${subject.subjectName}:`, { continued: true });
                doc.text(` ${subject.correctAnswers}/${subject.totalAnswered} acertos (${(subject.accuracyRate * 100).toFixed(1)}%)`);
            });

            // Footer
            doc.moveDown(4);
            doc.fontSize(10).fillColor('grey').text('Este relatório é exclusivo para usuários GabaritAI PRO.', { align: 'center' });

            doc.end();
        });
    }
}
