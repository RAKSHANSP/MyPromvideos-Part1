import { Request, Response } from 'express';
import { prisma } from '../index';
import { fetchChannelData } from '../services/youtube.service';
import { analyzeData } from '../services/analysis.service';

export const generateReport = async (req: Request, res: Response): Promise<any> => {
  const { companyName, competitors } = req.body;

  if (!companyName) {
    return res.status(400).json({ error: 'companyName is required' });
  }

  const allCompanies = [companyName, ...(competitors || [])].slice(0, 5); // Main + up to 4

  try {
    // 1. Fetch from YouTube in parallel
    const channelsData = await Promise.all(
      allCompanies.map(name => fetchChannelData(name).then(data => ({ name, data })))
    );

    // 2. Create the report in DB
    const report = await prisma.report.create({
      data: {
        companyName
      }
    });

    // 3. Analyze and save competitor & channel data
    for (const { name, data } of channelsData) {
      if (!data) continue;

      const analysis = analyzeData(data);

      await prisma.competitor.create({
        data: {
          name,
          reportId: report.id,
          channelData: {
            create: {
              channelId: data.channelId,
              title: data.title,
              subscribers: data.subscribers,
              totalViews: data.totalViews,
              videoCount: data.videoCount,
              uploadFrequency: analysis.uploadFrequency,
              engagementRate: analysis.engagementRate,
              score: analysis.score,
              videos: {
                create: data.videos.map(v => ({
                  videoId: v.videoId,
                  title: v.title,
                  publishedAt: v.publishedAt,
                  tags: v.tags ? v.tags.join(',') : '',
                  duration: v.duration,
                  views: v.views,
                  likes: v.likes,
                  comments: v.comments,
                  thumbnail: v.thumbnails?.high?.url || v.thumbnails?.default?.url || ''
                }))
              }
            }
          }
        }
      });
    }

    return res.json({ reportId: report.id });
  } catch (error) {
    console.error("Error generating report:", error);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
};

export const getReport = async (req: Request, res: Response): Promise<any> => {
  const id = req.params.id as string;

  try {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        competitors: {
          include: {
            channelData: {
              include: {
                videos: {
                  orderBy: { publishedAt: 'desc' },
                  take: 5
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

    res.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};
