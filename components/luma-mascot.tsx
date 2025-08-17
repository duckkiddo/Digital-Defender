import { Bot } from "lucide-react"

interface LumaMascotProps {
  message: string
  className?: string
}

export function LumaMascot({ message, className = "" }: LumaMascotProps) {
  return (
    <div className={`flex items-start space-x-3 p-4 bg-primary/10 rounded-2xl border border-primary/20 ${className}`}>
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-primary mb-1">Luma</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
