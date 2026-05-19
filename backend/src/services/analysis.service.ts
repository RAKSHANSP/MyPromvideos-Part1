import { ChannelInfo, VideoSnippet } from './youtube.service';

export const analyzeData = (channel: ChannelInfo) => {
  // Calculate Engagement Rate = (Likes + Comments) / Views
  let totalEngagement = 0;
  let recentViews = 0;
  
  // Calculate Upload Frequency (videos per week over the last x videos)
  let uploadFrequency = 0;
  
  if (channel.videos.length > 0) {
    channel.videos.forEach(v => {
      totalEngagement += (v.likes + v.comments);
      recentViews += v.views;
    });

    const oldestDate = channel.videos[channel.videos.length - 1].publishedAt.getTime();
    const newestDate = channel.videos[0].publishedAt.getTime();
    const diffWeeks = Math.max(1, (newestDate - oldestDate) / (1000 * 60 * 60 * 24 * 7));
    uploadFrequency = channel.videos.length / diffWeeks;
  }

  const engagementRate = recentViews > 0 ? (totalEngagement / recentViews) * 100 : 0;
  
  // Scoring logic (heuristic)
  // Higher engagement rate is great, upload frequency around 1-3 is ideal, high views/subscribers is good
  const viewSubRatio = channel.subscribers > 0 ? recentViews / channel.subscribers : 0;
  
  // Normalizing scores
  const score = (engagementRate * 2) + (uploadFrequency > 0 ? Math.min(uploadFrequency, 5) * 5 : 0) + (viewSubRatio * 10);

  return {
    uploadFrequency,
    engagementRate,
    score
  };
}
