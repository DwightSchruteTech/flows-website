import { Code, Globe, MessageSquare, ChevronDown } from "lucide-react"

export function DesktopMockup() {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* Mac Desktop Window */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Mac Menu Bar */}
        <div className="bg-gray-950 px-4 py-2 flex items-center gap-2 border-b border-gray-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-gray-400 ml-4">ClipFlow Desktop</span>
        </div>

        {/* Desktop Content Area */}
        <div className="relative p-8 min-h-[400px] bg-gradient-to-br from-gray-800/50 to-gray-900/50">
          {/* Floating Window Components */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Code Editor Window */}
            <div className="bg-gray-950 rounded-lg shadow-xl border border-gray-700 overflow-hidden transform hover:scale-105 transition-transform">
              <div className="bg-gray-900 px-3 py-2 flex items-center gap-2 border-b border-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/70" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                  <div className="w-2 h-2 rounded-full bg-green-500/70" />
                </div>
                <Code className="w-3 h-3 text-purple-400 ml-2" />
                <span className="text-xs text-gray-400">video-editor.tsx</span>
              </div>
              <div className="p-3 space-y-1.5">
                <div className="flex gap-2">
                  <span className="text-purple-400 text-xs font-mono">const</span>
                  <span className="text-blue-400 text-xs font-mono">video</span>
                  <span className="text-gray-400 text-xs font-mono">= {}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-purple-400 text-xs font-mono">export</span>
                  <span className="text-green-400 text-xs font-mono">function</span>
                </div>
                <div className="h-2 bg-primary/20 rounded w-20 ml-2" />
              </div>
            </div>

            {/* Browser Window */}
            <div className="bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden transform hover:scale-105 transition-transform">
              <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b border-gray-300">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <Globe className="w-3 h-3 text-blue-500 ml-2" />
                <div className="flex-1 bg-white rounded px-2 py-0.5 text-xs text-gray-600">clipflow.app/video/123</div>
              </div>
              <div className="p-3 bg-gradient-to-br from-primary/10 to-purple-100">
                <div className="h-2 bg-primary/30 rounded w-full mb-2" />
                <div className="h-2 bg-primary/20 rounded w-3/4" />
              </div>
            </div>

            {/* Slack/Communication Window */}
            <div className="bg-purple-950 rounded-lg shadow-xl border border-purple-800 overflow-hidden transform hover:scale-105 transition-transform">
              <div className="bg-purple-900 px-3 py-2 flex items-center gap-2 border-b border-purple-800">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/70" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                  <div className="w-2 h-2 rounded-full bg-green-500/70" />
                </div>
                <MessageSquare className="w-3 h-3 text-purple-300 ml-2" />
                <span className="text-xs text-purple-200">#team-videos</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded bg-purple-400" />
                  <div className="flex-1 space-y-1">
                    <div className="h-1.5 bg-purple-300/30 rounded w-16" />
                    <div className="h-1.5 bg-purple-300/20 rounded w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* File Manager Window */}
            <div className="bg-gray-100 rounded-lg shadow-xl border border-gray-300 overflow-hidden transform hover:scale-105 transition-transform">
              <div className="bg-gray-200 px-3 py-2 flex items-center gap-2 border-b border-gray-300">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-600 ml-2">Assets</span>
              </div>
              <div className="p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-400" />
                  <div className="h-1.5 bg-gray-300 rounded w-16 text-xs" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-400" />
                  <div className="h-1.5 bg-gray-300 rounded w-20 text-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* ClipFlow Menu Dropdown */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-float-slow">
            <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-purple-100 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Active Flows</span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
            <div className="p-2 space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-lg">🎬</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Video Production</div>
                  <div className="text-xs text-gray-500">4 windows</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-lg">💬</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Communication</div>
                  <div className="text-xs text-gray-500">2 windows</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-lg">🎨</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Creative Mode</div>
                  <div className="text-xs text-gray-500">3 windows</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
