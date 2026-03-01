import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { GetPerformanceStatsUseCase } from '../application/usecases/get-performance-stats.usecase';
import { GeneratePerformanceReportUseCase } from '../application/usecases/generate-performance-report.usecase';

@Controller('performance')
@UseGuards(AuthGuard('jwt'))
export class PerformanceController {
    constructor(
        private readonly getStatsUseCase: GetPerformanceStatsUseCase,
        private readonly generateReportUseCase: GeneratePerformanceReportUseCase
    ) { }

    @Get('stats')
    async getStats(@Req() req: any) {
        const userId = req.user.sub;
        return this.getStatsUseCase.execute(userId);
    }

    @Get('report/pdf')
    async downloadReport(@Req() req: any, @Res() res: Response) {
        const userId = req.user.sub;
        const pdfBuffer = await this.generateReportUseCase.execute(userId);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=relatorio-desempenho-gabaritai.pdf',
            'Content-Length': pdfBuffer.length,
        });

        res.end(pdfBuffer);
    }
}
