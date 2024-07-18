'use client'

import { useSize } from 'ahooks'
import React from 'react'

import { useVirtualizer } from '@tanstack/react-virtual'
import { ScrollArea } from '@/components/ui/scroll-area'

const data: number[] = new Array(10000).fill(0).map((_, i) => i)
const { Fragment } = React

export default function Page() {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const size = useSize(parentRef)
  const len = 122
  const columnCount = Math.floor((size?.width || 0) / len)

  return (
    <div ref={parentRef} className="flex-1">
      {columnCount !== 0 && <Demo columnCount={columnCount} len={len} />}
    </div>
  )
}

const Demo = React.memo(function Demo({
  columnCount,
  len,
}: {
  columnCount: number
  len: number
}) {
  const parentRef = React.useRef<HTMLDivElement>(null)

  const rowCount = Math.ceil(data.length / columnCount)

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => len,
    overscan: 5,
  })

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columnCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => len,
    overscan: 5,
  })

  return (
    <ScrollArea className="h-[calc(100vh-64px-48px)]">
      <div ref={parentRef}>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `${columnVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <Fragment key={virtualRow.key}>
              {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
                <Fragment key={virtualColumn.key}>
                  {virtualRow.index * columnCount + virtualColumn.index <=
                  data.length - 1 ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: `${virtualColumn.size}px`,
                        height: `${virtualRow.size}px`,
                        transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                      }}
                      className="bg-neutral-200 rounded-lg flex justify-center items-center"
                    >
                      {
                        data[
                          virtualRow.index * columnCount + virtualColumn.index
                        ]
                      }
                    </div>
                  ) : null}
                </Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
})
