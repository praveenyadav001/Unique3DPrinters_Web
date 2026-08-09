import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LucideIcon, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  defaultActive?: string
  logo?: (isCollapsed: boolean) => React.ReactNode
  rightContent?: (isCollapsed: boolean) => React.ReactNode
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function AnimeNavBar({ items, className, defaultActive = "Home", logo, rightContent, isCollapsed, onToggleCollapse }: NavBarProps) {
  const [mounted, setMounted] = useState(false)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>(defaultActive)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={cn("fixed top-0 left-0 bottom-0 z-[9999] pointer-events-none transition-all duration-500 ease-in-out", isCollapsed ? "w-16" : "w-72", className)}>
      <div className={cn("flex flex-col h-full pointer-events-auto overflow-hidden relative transition-all duration-500 ease-in-out", isCollapsed ? "bg-transparent border-transparent pt-6 items-center" : "bg-black/95 border-r border-white/10 backdrop-blur-xl pt-6 pb-6 px-4")}>
        
        {/* Toggle Button */}
        {isCollapsed ? (
          <button 
            onClick={onToggleCollapse}
            className="w-12 h-12 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-white hover:text-[#00E5FF] hover:border-[#00E5FF] hover:bg-black/90 z-50 transition-all shadow-xl cursor-pointer ml-2"
          >
            <Menu size={24} />
          </button>
        ) : (
          <button 
            onClick={onToggleCollapse}
            className="absolute right-4 top-6 w-8 h-8 bg-black/40 border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black z-50 transition-colors shadow-lg cursor-pointer"
          >
            <X size={16} />
          </button>
        )}

        <div className={cn("flex flex-col h-full w-full transition-opacity duration-300", isCollapsed ? "opacity-0 pointer-events-none absolute" : "opacity-100 pointer-events-auto mt-8 relative overflow-y-auto overflow-x-hidden")}>
          {/* Logo Section */}
          <div className="mb-10 flex justify-center w-full">
            {logo && logo(false)}
          </div>

          {/* Navigation */}
          <motion.div 
            className="flex flex-col gap-3 relative flex-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.name
              const isHovered = hoveredTab === item.name

              return (
                <a
                  key={item.name}
                  href={item.url}
                  onClick={(e) => {
                    if (item.url === "#") e.preventDefault()
                    setActiveTab(item.name)
                  }}
                  onMouseEnter={() => setHoveredTab(item.name)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-4 py-4 rounded-2xl transition-all duration-300 flex items-center justify-start gap-4",
                    "text-white/70 hover:text-white",
                    isActive && "text-white"
                  )}
                >
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-2xl -z-10 overflow-hidden animate-nav-glow"
                      aria-hidden="true"
                    >
                      <div className="absolute inset-0 bg-primary/25 rounded-2xl blur-md" />
                      <div className="absolute inset-[-4px] bg-primary/20 rounded-2xl blur-xl" />
                      <div className="absolute inset-[-8px] bg-primary/15 rounded-2xl blur-2xl" />
                      <div className="absolute inset-[-12px] bg-primary/5 rounded-2xl blur-3xl" />

                      <div
                        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
                        style={{ animation: "shine 4s ease-in-out infinite" }}
                      />
                    </div>
                  )}

                  <Icon size={20} strokeWidth={2.5} className="relative z-10 flex-shrink-0" />
                  
                  <motion.span
                    className="relative z-10 whitespace-nowrap flex-1 text-left"
                  >
                    {item.name}
                  </motion.span>
            
                  <AnimatePresence>
                    {isHovered && !isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 bg-white/10 rounded-2xl -z-10"
                      />
                    )}
                  </AnimatePresence>

                  {isActive && (
                    <motion.div
                      layoutId="anime-mascot"
                      className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none hidden md:block"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className="relative w-8 h-8">
                        <div
                          className="absolute w-8 h-8 bg-white rounded-full left-1/2 -translate-x-1/2 animate-mascot-float"
                          style={{
                            animation: hoveredTab
                              ? "mascot-bounce 0.5s ease-in-out"
                              : "mascot-float 3s ease-in-out infinite",
                          }}
                        >
                          <div
                            className="absolute w-1.5 h-1.5 bg-black rounded-full"
                            style={{
                              left: "25%",
                              top: "40%",
                              animation: hoveredTab ? "mascot-blink 0.2s ease-in-out" : "none",
                            }}
                          />
                          <div
                            className="absolute w-1.5 h-1.5 bg-black rounded-full"
                            style={{
                              right: "25%",
                              top: "40%",
                              animation: hoveredTab ? "mascot-blink 0.2s ease-in-out" : "none",
                            }}
                          />
                          <div
                            className="absolute w-1.5 h-1 bg-pink-300 rounded-full"
                            style={{
                              left: "15%",
                              top: "55%",
                              opacity: hoveredTab ? 0.8 : 0.6,
                            }}
                          />
                          <div
                            className="absolute w-1.5 h-1 bg-pink-300 rounded-full"
                            style={{
                              right: "15%",
                              top: "55%",
                              opacity: hoveredTab ? 0.8 : 0.6,
                            }}
                          />

                          <div
                            className="absolute w-3 h-1.5 border-b-2 border-black rounded-full"
                            style={{
                              left: "30%",
                              top: "60%",
                              transform: hoveredTab ? "scaleY(1.5) translateY(-4px)" : "none",
                            }}
                          />
                          <AnimatePresence>
                            {hoveredTab && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0 }}
                                  className="absolute -top-1 -right-1 w-2 h-2 text-yellow-300"
                                >
                                  ✨
                                </motion.div>
                                <motion.div
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="absolute -top-2 left-0 w-2 h-2 text-yellow-300"
                                >
                                  ✨
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                        <div
                          className="absolute -bottom-0.5 left-1/2 w-3 h-3 -translate-x-1/2"
                          style={{
                            animation: hoveredTab
                              ? "mascot-triangle-bounce 0.3s ease-in-out infinite alternate"
                              : "mascot-triangle-float 2s ease-in-out infinite",
                          }}
                        >
                          <div className="w-full h-full bg-white rotate-45 transform origin-center" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </a>
              )
            })}
          </motion.div>

          {/* Bottom Content */}
          <div className="mt-auto flex flex-col justify-center gap-4 w-full border-t border-white/10 pt-6">
            {rightContent && rightContent(false)}
          </div>
        </div>
      </div>
    </div>
  )
}
