import { google, youtube_v3 } from 'googleapis';

const youtube = google.youtube('v3');
const API_KEY = process.env.YOUTUBE_API_KEY || '';

export interface VideoSnippet {
  videoId: string;
  title: string;
  publishedAt: Date;
  thumbnails: any;
  tags: string[];
  duration: string;
  views: number;
  likes: number;
  comments: number;
}

export interface ChannelInfo {
  channelId: string;
  title: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
  videos: VideoSnippet[];
}

export const fetchChannelData = async (companyName: string): Promise<ChannelInfo | null> => {
  if (!API_KEY) {
    console.warn("No YOUTUBE_API_KEY provided. Returning mock data if needed or throwing.");
    // For a real production app, throw an error. But to prevent crashing if the user hasn't added it yet:
    // throw new Error("YOUTUBE_API_KEY is not set");
  }

  try {
    // 1. Search for channel
    const searchRes = await youtube.search.list({
      key: API_KEY,
      q: companyName,
      type: ['channel'],
      part: ['snippet'],
      maxResults: 1
    });

    if (!searchRes.data.items || searchRes.data.items.length === 0) return null;
    const channelId = searchRes.data.items[0].snippet?.channelId;
    if (!channelId) return null;

    // 2. Get channel stats
    const channelRes = await youtube.channels.list({
      key: API_KEY,
      id: [channelId],
      part: ['statistics', 'snippet', 'contentDetails']
    });

    if (!channelRes.data.items || channelRes.data.items.length === 0) return null;
    const channel = channelRes.data.items[0];
    const stats = channel.statistics;
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

    // 3. Get latest 25 videos
    let videos: VideoSnippet[] = [];
    if (uploadsPlaylistId) {
      const playlistRes = await youtube.playlistItems.list({
        key: API_KEY,
        playlistId: uploadsPlaylistId,
        part: ['snippet'],
        maxResults: 25
      });

      const videoIds = playlistRes.data.items?.map(i => i.snippet?.resourceId?.videoId).filter(Boolean) as string[];
      
      if (videoIds && videoIds.length > 0) {
        const videoStatsRes = await youtube.videos.list({
          key: API_KEY,
          id: videoIds,
          part: ['statistics', 'snippet', 'contentDetails']
        });

        videos = (videoStatsRes.data.items || []).map(v => ({
          videoId: v.id!,
          title: v.snippet?.title || '',
          publishedAt: new Date(v.snippet?.publishedAt || ''),
          thumbnails: v.snippet?.thumbnails,
          tags: v.snippet?.tags || [],
          duration: v.contentDetails?.duration || '',
          views: parseInt(v.statistics?.viewCount || '0'),
          likes: parseInt(v.statistics?.likeCount || '0'),
          comments: parseInt(v.statistics?.commentCount || '0')
        }));
      }
    }

    return {
      channelId,
      title: channel.snippet?.title || companyName,
      subscribers: parseInt(stats?.subscriberCount || '0'),
      totalViews: parseInt(stats?.viewCount || '0'),
      videoCount: parseInt(stats?.videoCount || '0'),
      videos
    };

  } catch (error) {
    console.error(`Error fetching YouTube data for ${companyName}:`, error);
    return null;
  }
}
