import * as React from "react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

interface StatChartProps {
  stats: Array<{
    name: string
    value: number
    max?: number
  }>
  className?: string
}

export const StatChart: React.FC<StatChartProps> = ({ stats, className }) => {
  const data = stats.map(stat => ({
    stat: stat.name.replace('-', ' ').toUpperCase(),
    value: stat.value,
    fullMark: stat.max || 200
  }))

  return (
    <div className={cn("w-full h-64", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid className="stroke-border/50" />
          <PolarAngleAxis 
            dataKey="stat" 
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            className="text-xs"
          />
          <PolarRadiusAxis
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            tickCount={4}
            domain={[0, 200]}
          />
          <Radar
            name="Stats"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}