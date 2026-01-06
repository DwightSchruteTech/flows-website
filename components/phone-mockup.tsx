import { Play } from "lucide-react"

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] h-[560px]">
      {/* Phone bezel */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[48px] shadow-2xl p-3">
        {/* Inner screen */}
        <div className="relative w-full h-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-[36px] overflow-hidden">
          {/* Live badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </div>

          {/* Video content placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/interactive-video-content-with-colorful-ui-element.jpg" alt="Video content" className="w-full h-full object-cover" />
          </div>

          {/* Interactive overlay elements */}
          <div className="absolute bottom-20 left-4 right-4 space-y-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Play className="w-6 h-6 text-primary-foreground fill-current" />
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-white/30 rounded-full w-32 mb-2" />
                  <div className="h-2 bg-white/20 rounded-full w-20" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gradient-to-br from-gray-800 to-gray-900 rounded-b-3xl" />
      </div>
    </div>
  )
}
