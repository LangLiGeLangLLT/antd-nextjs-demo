'use client'

import React from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
)

export default function Page() {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-16 bg-background sticky top-0 z-50 shadow" />
      <ScrollArea className="flex-1 w-full p-4">
        {`Jokester began sneaking into the castle in the middle of the night and
      leaving jokes all over the place: under the king's pillow, in his soup,
      even in the royal toilet. The king was furious, but he couldn't seem to
      stop Jokester. And then, one day, the people of the kingdom discovered
      that the jokes left by Jokester were so funny that they couldn't help but
      laugh. And once they started laughing, they couldn't stop.`.repeat(20)}
      </ScrollArea>
    </div>
  )
}
