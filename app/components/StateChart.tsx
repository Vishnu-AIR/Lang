'use client'

import { Card } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface StatsChartProps {
  data: {
    reels: {
      likes: number
      shares: number
      comments: number
      views: number
    }
    carousels: {
      likes: number
      shares: number
      comments: number
      views: number
    }
  }
}

export default function StatsChart({ data }: StatsChartProps) {
  const chartData = [
    { name: 'Likes', Reels: data.reels.likes, Carousels: data.carousels.likes },
    { name: 'Shares', Reels: data.reels.shares, Carousels: data.carousels.shares },
    { name: 'Comments', Reels: data.reels.comments, Carousels: data.carousels.comments },
    { name: 'Views', Reels: data.reels.views, Carousels: data.carousels.views },
  ]

  return (
    <Card className="p-6">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Reels" fill="#3b82f6" />
          <Bar dataKey="Carousels" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

