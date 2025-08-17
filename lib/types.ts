export interface Video {
  title: string;
  description: string;
  duration: string;
  level: string;
  thumbnail: string;
  youtubeId: string;
  category: string;
}

export interface VideoCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  videos: Video[];
}