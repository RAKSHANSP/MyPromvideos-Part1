import pptxgen from 'pptxgenjs';

export const generatePPTBuffer = async (reportData: any): Promise<Buffer> => {
  const pres = new pptxgen();

  pres.layout = 'LAYOUT_16x9';

  // MASTER SLIDE
  pres.defineSlideMaster({
    title: 'MASTER_SLIDE',
    background: { color: 'F8FAFC' },
    objects: [
      {
        rect: {
          x: 0,
          y: 0,
          w: '100%',
          h: 0.6,
          fill: { color: '2563EB' }
        }
      },
      {
        text: {
          text: 'Video Competitor Intelligence & Analytics Report',
          options: {
            x: 0.5,
            y: 0.15,
            w: 7,
            h: 0.3,
            color: 'FFFFFF',
            fontSize: 16,
            bold: true,
            fontFace: 'Arial'
          }
        }
      }
    ],
    slideNumber: {
      x: '95%',
      y: '95%',
      color: '64748B',
      fontSize: 10
    }
  });

  const competitors = reportData.competitors.filter(
    (c: any) => c.channelData
  );

  if (competitors.length === 0) {
    throw new Error('No data available to generate report');
  }

  // ANALYSIS VARIABLES
  let bestEngaged = competitors[0];
  let mostViews = competitors[0];
  let mostSubscribers = competitors[0];
  let mostActive = competitors[0];

  let allVideos: any[] = [];

  competitors.forEach((c: any) => {
    if (
      c.channelData.engagementRate >
      bestEngaged.channelData.engagementRate
    ) {
      bestEngaged = c;
    }

    if (c.channelData.totalViews > mostViews.channelData.totalViews) {
      mostViews = c;
    }

    if (c.channelData.subscribers > mostSubscribers.channelData.subscribers) {
      mostSubscribers = c;
    }

    if (
      c.channelData.uploadFrequency >
      mostActive.channelData.uploadFrequency
    ) {
      mostActive = c;
    }

    c.channelData.videos.forEach((v: any) => {
      allVideos.push({
        ...v,
        company: c.name
      });
    });
  });

  allVideos.sort((a, b) => b.views - a.views);

  // =========================================================
  // SLIDE 1
  // =========================================================

  const slide1 = pres.addSlide();

  slide1.background = { color: '1E293B' };

  slide1.addText('Competitor Intelligence Report', {
    x: 1,
    y: 2,
    w: 8,
    h: 1.5,
    fontSize: 44,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    fontFace: 'Arial'
  });

  slide1.addText(`Market Analysis for: ${reportData.companyName}`, {
    x: 1,
    y: 3.5,
    w: 8,
    h: 0.5,
    fontSize: 24,
    color: '93C5FD',
    align: 'center'
  });

  slide1.addText(`Generated: ${new Date().toLocaleDateString()}`, {
    x: 1,
    y: 4.5,
    w: 8,
    h: 0.5,
    fontSize: 14,
    color: '94A3B8',
    align: 'center'
  });

  // =========================================================
  // SLIDE 2
  // =========================================================

  const slide2 = pres.addSlide({
    masterName: 'MASTER_SLIDE'
  });

  slide2.addText('Executive Summary', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: '1E293B'
  });

  slide2.addText(
    [
      {
        text: `Total Channels Analyzed: ${competitors.length}\n\n`,
        options: { bullet: true }
      },
      {
        text: `Market Leader by Reach: ${mostViews.name} (${Number(
          mostViews.channelData.totalViews
        ).toLocaleString()} views).\n\n`,
        options: { bullet: true }
      },
      {
        text: `Market Leader by Engagement: ${bestEngaged.name} (${bestEngaged.channelData.engagementRate.toFixed(
          2
        )}%).\n\n`,
        options: { bullet: true }
      },
      {
        text: `Most Active Content Creator: ${mostActive.name} (${mostActive.channelData.uploadFrequency.toFixed(
          2
        )} videos/week).\n`,
        options: { bullet: true }
      }
    ],
    {
      x: 0.5,
      y: 1.8,
      w: 9,
      h: 3,
      fontSize: 18,
      color: '334155',
      lineSpacing: 32
    }
  );

  // =========================================================
  // SLIDE 3
  // =========================================================

  const slide3 = pres.addSlide({
    masterName: 'MASTER_SLIDE'
  });

  slide3.addText('Audience Reach & Subscribers', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: '1E293B'
  });

  const subChartData = [
    {
      name: 'Subscribers',
      labels: competitors.map((c: any) => c.name),
      values: competitors.map((c: any) => c.channelData.subscribers)
    }
  ];

  slide3.addChart(pres.ChartType.bar, subChartData, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 3.5,
    showLegend: false,
    showTitle: false,
    barDir: 'col',
    dataLabelColor: '000000',
    showValue: true
  });

  // =========================================================
  // SLIDE 4
  // =========================================================

  const slide4 = pres.addSlide({
    masterName: 'MASTER_SLIDE'
  });

  slide4.addText('Total Viewership Comparison', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: '1E293B'
  });

  const viewsChartData = [
    {
      name: 'Total Views',
      labels: competitors.map((c: any) => c.name),
      values: competitors.map((c: any) =>
        Number(c.channelData.totalViews)
      )
    }
  ];

  slide4.addChart(pres.ChartType.bar, viewsChartData, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 3.5,
    showLegend: false,
    barDir: 'col',
    showValue: true
  });

  // =========================================================
  // SLIDE 5
  // =========================================================

  const slide5 = pres.addSlide({
    masterName: 'MASTER_SLIDE'
  });

  slide5.addText('Subscriber Market Share', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: '1E293B'
  });

  const pieSubData = [
    {
      name: 'Subscribers',
      labels: competitors.map((c: any) => c.name),
      values: competitors.map((c: any) => c.channelData.subscribers)
    }
  ];

  slide5.addChart(pres.ChartType.pie, pieSubData, {
    x: 2,
    y: 1.5,
    w: 6,
    h: 3.5,
    showLegend: true,
    legendPos: 'r',
    showValue: true,
    showPercent: true,
    dataLabelColor: 'FFFFFF'
  });

  // =========================================================
  // SLIDE 6
  // =========================================================

  const slide6 = pres.addSlide({
    masterName: 'MASTER_SLIDE'
  });

  slide6.addText('Viewership Market Share', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: '1E293B'
  });

  const pieViewsData = [
    {
      name: 'Views',
      labels: competitors.map((c: any) => c.name),
      values: competitors.map((c: any) => Number(c.channelData.totalViews))
    }
  ];

  slide6.addChart(pres.ChartType.doughnut, pieViewsData, {
    x: 2,
    y: 1.5,
    w: 6,
    h: 3.5,
    showLegend: true,
    legendPos: 'r',
    showValue: false,
    showPercent: true,
    holeSize: 50
  });

  // =========================================================
  // SLIDE 7
  // =========================================================

  const slide7 = pres.addSlide({
    masterName: 'MASTER_SLIDE'
  });

  slide7.addText('Engagement Rate Deep Dive', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: '1E293B'
  });

  const engChartData = [
    {
      name: 'Engagement Rate (%)',
      labels: competitors.map((c: any) => c.name),
      values: competitors.map(
        (c: any) => c.channelData.engagementRate
      )
    }
  ];

  slide7.addChart(pres.ChartType.line, engChartData, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 3.5,
    showLegend: true,
    showValue: true,
    lineSize: 3,
    lineDataSymbol: 'circle'
  });

  // =========================================================
  // SLIDE 8
  // =========================================================

  const slide8 = pres.addSlide({
    masterName: 'MASTER_SLIDE'
  });

  slide8.addText('Content Velocity (Upload Frequency)', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: '1E293B'
  });

  const freqChartData = [
    {
      name: 'Videos Per Week',
      labels: competitors.map((c: any) => c.name),
      values: competitors.map(
        (c: any) => c.channelData.uploadFrequency
      )
    }
  ];

  slide8.addChart(pres.ChartType.bar, freqChartData, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 3.5,
    showLegend: false,
    barDir: 'col',
    showValue: true
  });

  // =========================================================
  // SLIDE 9
  // =========================================================

  const slide9 = pres.addSlide({
    masterName: 'MASTER_SLIDE'
  });

  slide9.addText('Competitor Performance Score', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: '1E293B'
  });

  const radarData = [
    {
      name: 'Overall Score',
      labels: competitors.map((c: any) => c.name),
      values: competitors.map((c: any) => c.channelData.score)
    }
  ];

  slide9.addChart(pres.ChartType.radar, radarData, {
    x: 2.5,
    y: 1.5,
    w: 5,
    h: 3.5,
    showLegend: false,
    showValue: true
  });

  // =========================================================
  // SLIDE 10
  // =========================================================

  const slide10 = pres.addSlide({
    masterName: 'MASTER_SLIDE'
  });

  slide10.addText('The Data Matrix', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: '1E293B'
  });

  const tableData: any[][] = [];

  tableData.push([
    'Company',
    'Subscribers',
    'Views',
    'Videos',
    'Score'
  ]);

  competitors.forEach((c: any) => {
    tableData.push([
      c.name,
      c.channelData.subscribers.toLocaleString(),
      Number(c.channelData.totalViews).toLocaleString(),
      c.channelData.videoCount.toString(),
      c.channelData.score.toFixed(1)
    ]);
  });

  slide10.addTable(tableData, {
    x: 0.5,
    y: 1.5,
    w: 9,
    border: {
      type: 'solid',
      color: 'E2E8F0',
      pt: 1
    },
    fill: { color: 'FFFFFF' },
    color: '000000',
    fontSize: 14
  });

  // =========================================================
  // SLIDE 11
  // =========================================================

  const slide11 = pres.addSlide({
    masterName: 'MASTER_SLIDE'
  });

  slide11.addText('Top Performing Videos', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: '1E293B'
  });

  const topVideos = allVideos.slice(0, 5);
  const topVideosChartData = [
    {
      name: 'Views',
      labels: topVideos.map((v: any) => v.title.length > 30 ? v.title.substring(0, 30) + '...' : v.title),
      values: topVideos.map((v: any) => v.views)
    }
  ];

  slide11.addChart(pres.ChartType.bar, topVideosChartData, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 3.5,
    showLegend: false,
    barDir: 'bar',
    showValue: true
  });

  // =========================================================
  // SLIDE 12
  // =========================================================

  const slide12 = pres.addSlide({
    masterName: 'MASTER_SLIDE'
  });

  slide12.addText('Strategic Recommendations', {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: '1E293B'
  });

  slide12.addText(
    [
      {
        text: `Focus on audience growth strategies used by ${mostSubscribers.name}.\n\n`,
        options: { bullet: true }
      },
      {
        text: `Improve engagement tactics inspired by ${bestEngaged.name}.\n\n`,
        options: { bullet: true }
      },
      {
        text: `Increase upload consistency similar to ${mostActive.name}.\n\n`,
        options: { bullet: true }
      },
      {
        text: `Adopt high-performing SEO keywords from leading competitors.`,
        options: { bullet: true }
      }
    ],
    {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 3,
      fontSize: 18,
      color: '334155',
      lineSpacing: 28
    }
  );

  return pres.write({
    outputType: 'nodebuffer'
  }) as Promise<Buffer>;
};