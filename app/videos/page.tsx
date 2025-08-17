"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Clock, Users, Shield, Smartphone, Globe, Eye, Brain } from "lucide-react";

const iconMap: { [key: string]: React.ElementType } = {
  Shield: Shield,
  Users: Users,
  Smartphone: Smartphone,
  Globe: Globe,
  Eye: Eye,
  Brain: Brain,
};
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import videoCategories from "../../data/videos.json";
import { VideoCategory, Video } from "../../lib/types";




export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)

  const filteredVideos: Video[] = selectedCategory
    ? ((videoCategories as VideoCategory[]).find((cat: VideoCategory) => cat.id === selectedCategory)?.videos || [])
    : (videoCategories as VideoCategory[]).flatMap((cat: VideoCategory) => cat.videos);



  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-primary mb-4">Digital Awareness Videos</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive video library to enhance your digital literacy and stay safe online. Learn from
            experts about privacy, security, AI, and responsible digital citizenship.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="mb-2"
            >
              All Categories
            </Button>
            {videoCategories.map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap];
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="mb-2"
                >
                  {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                  {category.title}
                </Button>
              );
            })}
          </div>
        </div>



        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <Card key={index} className="flex flex-col">
              <img
                alt={video.title}
                className="w-full h-48 object-cover rounded-t-lg"
                src={video.thumbnail}
                style={{
                  aspectRatio: "300/200",
                  objectFit: "cover",
                }}
              />
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{video.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {video.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{video.duration}</span>
                  </div>

                </div>
                <div className="mb-4">
                  <Badge variant="secondary">{video.category}</Badge>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      onClick={() => setPlayingVideoId(video.youtubeId || null)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play Video
                    </Button>
                  </DialogTrigger>
                  {playingVideoId === video.youtubeId && (
                    <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
                      <div className="relative" style={{ paddingBottom: "56.25%" }}>
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=1&color=white&controls=1&disablekb=1&loop=0&playlist=${playingVideoId}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Educational Note */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Stay Informed, Stay Protected</h3>
              <p className="text-muted-foreground">
                Digital literacy is an ongoing journey. These videos are regularly updated to reflect the latest
                threats, technologies, and best practices in the digital world.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
