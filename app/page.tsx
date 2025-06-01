'use client'

import dynamic from 'next/dynamic'

const StarsScene = dynamic(() => import('./components/scenes/StarsScene').then(mod => ({ default: mod.StarsScene })), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="w-screen h-screen bg-gray-900 overflow-hidden">
      <StarsScene />
    </main>
  )
}