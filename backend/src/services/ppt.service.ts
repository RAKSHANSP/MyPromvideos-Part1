import pptxgen from 'pptxgenjs';

export const generatePPTBuffer = async (reportData: any): Promise<Buffer> => {
  const pres = new pptxgen();
  
  pres.layout = 'LAYOUT_16x9';

  // Master Slide Definition
  pres.defineSlideMaster({
    title: 'MASTER_SLIDE',
    background: { color: 'F8FAFC' },
    objects: [
      { rect: { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: '2563EB' } } },
      { text: { text: 'Video Competitor Intelligence & Analytics Report', options: { x: 0.5, y: 0.15, w: 7, h: 0.3, color: 'FFFFFF', fontSize: 16, bold: true, fontFace: 'Arial' } } }
    ],
    slideNumber: { x: '95%', y: '95%', color: '64748B', fontSize: 10 }
  });

  const competitors = reportData.competitors.filter((c: any) => c.channelData);
  if (competitors.length === 0) throw new Error("No data available to generate report");

  // Helper variables for analysis
  let bestEngaged = competitors[0];
  let mostViews = competitors[0];
  let mostSubscribers = competitors[0];
  let mostActive = competitors[0];
  let allVideos: any[] = [];
  
  competitors.forEach((c: any) => {
    if (c.channelData.engagementRate > bestEngaged.channelData.engagementRate) bestEngaged = c;
    if (c.channelData.totalViews > mostViews.channelData.totalViews) mostViews = c;
    if (c.channelData.subscribers > mostSubscribers.channelData.subscribers) mostSubscribers = c;
    if (c.channelData.uploadFrequency > mostActive.channelData.uploadFrequency) mostActive = c;
    
    c.channelData.videos.forEach((v: any) => {
      allVideos.push({ ...v, company: c.name });
    });
  });

  allVideos.sort((a, b) => b.views - a.views);

  // ---------------------------------------------
  // SLIDE 1: Cover Slide
  // ---------------------------------------------
  const slide1 = pres.addSlide();
  slide1.background = { color: '1E293B' };
  slide1.addText('Competitor Intelligence Report', { x: 1, y: 2, w: 8, h: 1.5, fontSize: 44, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Arial' });
  slide1.addText(`Market Analysis for: ${reportData.companyName}`, { x: 1, y: 3.5, w: 8, h: 0.5, fontSize: 24, color: '93C5FD', align: 'center' });
  slide1.addText(`Generated: ${new Date().toLocaleDateString()}`, { x: 1, y: 4.5, w: 8, h: 0.5, fontSize: 14, color: '94A3B8', align: 'center' });

  // ---------------------------------------------
  // SLIDE 2: Executive Summary
  // ---------------------------------------------
  const slide2 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
  slide2.addText('Executive Summary', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 28, bold: true, color: '1E293B' });
  slide2.addText([
    { text: `Total Channels Analyzed: ${competitors.length}\n\n`, options: { bullet: true } },
    { text: `Market Leader by Reach: ${mostViews.name} (${Number(mostViews.channelData.totalViews).toLocaleString()} views).\n\n`, options: { bullet: true } },
    { text: `Market Leader by Engagement: ${bestEngaged.name} (${bestEngaged.channelData.engagementRate.toFixed(2)}%).\n\n`, options: { bullet: true } },
    { text: `Most Active Content Creator: ${mostActive.name} (${mostActive.channelData.uploadFrequency.toFixed(2)} videos/week).\n`, options: { bullet: true } }
  ], { x: 0.5, y: 1.8, w: 9, h: 3, fontSize: 18, color: '334155', lineSpacing: 32 });

  // ---------------------------------------------
  // SLIDE 3: Audience Reach (Subscribers)
  // ---------------------------------------------
  const slide3 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
  slide3.addText('Audience Reach & Subscribers', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 28, bold: true, color: '1E293B' });
  const subChartData = [{
    name: 'Subscribers',
    labels: competitors.map((c: any) => c.name),
    values: competitors.map((c: any) => c.channelData.subscribers)
  }];
  slide3.addChart(pres.ChartType.bar, subChartData, { x: 0.5, y: 1.5, w: 9, h: 3.5, showLegend: false, showTitle: false, barDir: 'col', dataLabelColor: '000000', showValue: true });

  // ---------------------------------------------
  // SLIDE 4: Total Viewership Comparison
  // ---------------------------------------------
  const slide4 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
  slide4.addText('Total Viewership Comparison', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 28, bold: true, color: '1E293B' });
  const viewsChartData = [{
    name: 'Total Views',
    labels: competitors.map((c: any) => c.name),
    values: competitors.map((c: any) => Number(c.channelData.totalViews))
  }];
  slide4.addChart(pres.ChartType.bar, viewsChartData, { x: 0.5, y: 1.5, w: 9, h: 3.5, showLegend: false, barDir: 'col', showValue: true });

  // ---------------------------------------------
  // SLIDE 5: Engagement Rate Deep Dive
  // ---------------------------------------------
  const slide5 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
  slide5.addText('Engagement Rate Deep Dive', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 28, bold: true, color: '1E293B' });
  const engChartData = [{
    name: 'Engagement Rate (%)',
    labels: competitors.map((c: any) => c.name),
    values: competitors.map((c: any) => c.channelData.engagementRate)
  }];
  slide5.addChart(pres.ChartType.line, engChartData, { x: 0.5, y: 1.5, w: 9, h: 3.5, showLegend: true, showValue: true, lineSize: 3, lineDataSymbol: 'circle' });

  // ---------------------------------------------
  // SLIDE 6: Content Velocity (Upload Frequency)
  // ---------------------------------------------
  const slide6 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
  slide6.addText('Content Velocity (Upload Frequency)', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 28, bold: true, color: '1E293B' });
  const freqChartData = [{
    name: 'Videos Per Week',
    labels: competitors.map((c: any) => c.name),
    values: competitors.map((c: any) => c.channelData.uploadFrequency)
  }];
  slide6.addChart(pres.ChartType.bar, freqChartData, { x: 0.5, y: 1.5, w: 9, h: 3.5, showLegend: false, barDir: 'bar', showValue: true });

  // ---------------------------------------------
  // SLIDE 7: The Data Matrix (Summary Table)
  // ---------------------------------------------
  const slide7 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
  slide7.addText('The Data Matrix', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 28, bold: true, color: '1E293B' });
  const tableData: any[][] = [
    [{ text: 'Company', options: { bold: true, fill: '2563EB', color: 'FFFFFF', align: 'center' } }, 
     { text: 'Subscribers', options: { bold: true, fill: '2563EB', color: 'FFFFFF', align: 'center' } }, 
     { text: 'Views', options: { bold: true, fill: '2563EB', color: 'FFFFFF', align: 'center' } }, 
     { text: 'Videos', options: { bold: true, fill: '2563EB', color: 'FFFFFF', align: 'center' } }, 
     { text: 'Score', options: { bold: true, fill: '2563EB', color: 'FFFFFF', align: 'center' } }]
  ];
  competitors.forEach((c: any) => {
    tableData.push([
      { text: c.name, options: { align: 'center', valign: 'middle' } },
      { text: c.channelData.subscribers.toLocaleString(), options: { align: 'center', valign: 'middle' } },
      { text: Number(c.channelData.totalViews).toLocaleString(), options: { align: 'center', valign: 'middle' } },
      { text: c.channelData.videoCount.toString(), options: { align: 'center', valign: 'middle' } },
      { text: c.channelData.score.toFixed(1), options: { align: 'center', valign: 'middle' } }
    ]);
  });
  slide7.addTable(tableData, { x: 0.5, y: 1.5, w: 9, fill: 'FFFFFF', border: { type: 'solid', color: 'E2E8F0', pt: 1 }, colW: [2.5, 1.5, 2, 1.5, 1.5], fontSize: 14 });

  // ---------------------------------------------
  // SLIDE 8: Top 5 Performing Videos
  // ---------------------------------------------
  const slide8 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
  slide8.addText('Top 5 Performing Videos (Across all channels)', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 24, bold: true, color: '1E293B' });
  const topVideos = allVideos.slice(0, 5);
  const videoTableData: any[][] = [
    [{ text: 'Title', options: { bold: true, fill: 'F1F5F9', align: 'center' } }, 
     { text: 'Channel', options: { bold: true, fill: 'F1F5F9', align: 'center' } }, 
     { text: 'Views', options: { bold: true, fill: 'F1F5F9', align: 'center' } }]
  ];
  topVideos.forEach(v => {
    videoTableData.push([
      { text: v.title.substring(0, 60) + (v.title.length > 60 ? '...' : ''), options: { align: 'left', valign: 'middle' } },
      { text: v.company, options: { align: 'center', valign: 'middle' } },
      { text: v.views.toLocaleString(), options: { align: 'center', valign: 'middle' } }
    ]);
  });
  if (topVideos.length > 0) {
    slide8.addTable(videoTableData, { x: 0.5, y: 1.5, w: 9, fill: 'FFFFFF', border: { type: 'solid', color: 'CBD5E1', pt: 1 }, colW: [5, 2, 2], fontSize: 12 });
  } else {
    slide8.addText('No video data found.', { x: 0.5, y: 1.5, w: 9, h: 1, fontSize: 16 });
  }

  // ---------------------------------------------
  // SLIDE 9: SEO & Keyword Insights
  // ---------------------------------------------
  const slide9 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
  slide9.addText('SEO & Keyword Insights', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 28, bold: true, color: '1E293B' });
  
  let allTags: string[] = [];
  allVideos.forEach(v => {
    if (v.tags) {
      const tagsArray = typeof v.tags === 'string' ? v.tags.split(',') : v.tags;
      tagsArray.forEach((t: string) => allTags.push(t.toLowerCase().trim()));
    }
  });
  const tagCounts: any = {};
  allTags.forEach(t => { if (t) tagCounts[t] = (tagCounts[t] || 0) + 1; });
  const topTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 15);
  
  slide9.addText('Most frequently used tags across top videos:', { x: 0.5, y: 1.5, w: 8, h: 0.3, fontSize: 16, color: '475569' });
  slide9.addText(topTags.join(' • '), { x: 0.5, y: 2, w: 9, h: 2, fontSize: 20, color: '2563EB', bold: true, align: 'center' });

  // ---------------------------------------------
  // SLIDE 10: Strategic Recommendations
  // ---------------------------------------------
  const slide10 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
  slide10.addText('Strategic Recommendations', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 28, bold: true, color: '1E293B' });
  slide10.addText([
    { text: `Focus on Audience Growth: To catch up with ${mostSubscribers.name}, invest in high-retention formats and aggressive calls-to-action.\n\n`, options: { bullet: true } },
    { text: `Optimize for Engagement: ${bestEngaged.name} leads in engagement (${bestEngaged.channelData.engagementRate.toFixed(2)}%). Analyze their community interactions and comment responses.\n\n`, options: { bullet: true } },
    { text: `Content Velocity: Consider matching the upload cadence of ${mostActive.name} (${mostActive.channelData.uploadFrequency.toFixed(1)} videos/week) to maintain algorithmic relevance.\n\n`, options: { bullet: true } },
    { text: `Adopt Winning SEO: Utilize the identified top tags in your upcoming video metadata and titles to capture shared search traffic.\n`, options: { bullet: true } }
  ], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 18, color: '334155', lineSpacing: 28 });

  return pres.write({ outputType: 'nodebuffer' }) as Promise<Buffer>;
};
