import { Request, Response } from 'express';
import { prisma } from '../index';
import { generatePPTBuffer } from '../services/ppt.service';

export const generatePPT = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        competitors: {
          include: {
            channelData: {
              include: {
                videos: {
                  orderBy: { views: 'desc' },
                  take: 10
                }
              }
            }
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const pptBuffer = await generatePPTBuffer(report);
    
    res.setHeader('Content-disposition', `attachment; filename=competitor_analysis_${report.companyName.replace(/\s+/g, '_')}.pptx`);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    
    return res.send(pptBuffer);
  } catch (error) {
    console.error("Error generating PPT:", error);
    return res.status(500).json({ error: 'Failed to generate PowerPoint' });
  }
};
