'use client'

import { faker } from '@faker-js/faker'
import '../styles.css'

import React from 'react'
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual'
import { Button } from 'antd'

enum Type {
  Row = 'Row',
  Column = 'Column',
  Grid = 'Grid',
}

const randomNumber = (min: number, max: number) =>
  faker.number.int({ min, max })

const sentences = new Array(100)
  .fill(true)
  .map(() => faker.lorem.sentence(randomNumber(20, 70)))

export default function Page() {
  const [isClient, setIsClient] = React.useState(false)
  const [type, setType] = React.useState<Type>(Type.Row)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <>
      <div className="space-x-2">
        <Button type="primary" onClick={() => setType(Type.Row)}>
          Row
        </Button>
        <Button type="primary" onClick={() => setType(Type.Column)}>
          Column
        </Button>
        <Button type="primary" onClick={() => setType(Type.Grid)}>
          Grid
        </Button>
      </div>
      {(() => {
        switch (type) {
          case Type.Row:
            return <RowVirtualizerDynamic />
          case Type.Column:
            return <ColumnVirtualizerDynamic />
          case Type.Grid: {
            const columns = generateColumns(30)
            const data = generateData(columns)
            return <GridVirtualizerDynamic columns={columns} data={data} />
          }
        }
      })()}
    </>
  )
}

function RowVirtualizerDynamic() {
  const parentRef = React.useRef<HTMLDivElement>(null)

  const [enabled, setEnabled] = React.useState(true)

  const count = sentences.length
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    enabled,
  })

  const items = virtualizer.getVirtualItems()

  return (
    <div>
      <button
        onClick={() => {
          virtualizer.scrollToIndex(0)
        }}
      >
        scroll to the top
      </button>
      <span style={{ padding: '0 4px' }} />
      <button
        onClick={() => {
          virtualizer.scrollToIndex(count / 2)
        }}
      >
        scroll to the middle
      </button>
      <span style={{ padding: '0 4px' }} />
      <button
        onClick={() => {
          virtualizer.scrollToIndex(count - 1)
        }}
      >
        scroll to the end
      </button>
      <span style={{ padding: '0 4px' }} />
      <button
        onClick={() => {
          setEnabled((prev) => !prev)
        }}
      >
        turn {enabled ? 'off' : 'on'} virtualizer
      </button>
      <hr />
      <div
        ref={parentRef}
        className="List"
        style={{
          height: 400,
          width: 400,
          overflowY: 'auto',
          contain: 'strict',
        }}
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${items[0]?.start ?? 0}px)`,
            }}
          >
            {items.map((virtualRow) => (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={
                  virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'
                }
              >
                <div style={{ padding: '10px 0' }}>
                  <div>Row {virtualRow.index}</div>
                  <div>{sentences[virtualRow.index]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ColumnVirtualizerDynamic() {
  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    horizontal: true,
    count: sentences.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
  })

  return (
    <>
      <div
        ref={parentRef}
        className="List"
        style={{ width: 400, height: 400, overflowY: 'auto' }}
      >
        <div
          style={{
            width: virtualizer.getTotalSize(),
            height: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualColumn) => (
            <div
              key={virtualColumn.key}
              data-index={virtualColumn.index}
              ref={virtualizer.measureElement}
              className={
                virtualColumn.index % 2 ? 'ListItemOdd' : 'ListItemEven'
              }
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                transform: `translateX(${virtualColumn.start}px)`,
              }}
            >
              <div style={{ width: sentences[virtualColumn.index].length }}>
                <div>Column {virtualColumn.index}</div>
                <div>{sentences[virtualColumn.index]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

interface Column {
  key: string
  name: string
  width: number
}

function GridVirtualizerDynamic({
  columns,
  data,
}: {
  data: string[][]
  columns: Column[]
}) {
  const parentRef = React.useRef<HTMLDivElement | null>(null)

  const parentOffsetRef = React.useRef(0)

  React.useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0
  }, [])

  const getColumnWidth = (index: number) => columns[index].width

  const virtualizer = useWindowVirtualizer({
    count: data.length,
    estimateSize: () => 350,
    overscan: 5,
    scrollMargin: parentOffsetRef.current,
  })

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columns.length,
    getScrollElement: () => parentRef.current,
    estimateSize: getColumnWidth,
    overscan: 5,
  })
  const columnItems = columnVirtualizer.getVirtualItems()
  const [before, after] =
    columnItems.length > 0
      ? [
          columnItems[0].start,
          columnVirtualizer.getTotalSize() -
            columnItems[columnItems.length - 1].end,
        ]
      : [0, 0]

  return (
    <div
      ref={parentRef}
      style={{ overflowY: 'auto', border: '1px solid #c8c8c8' }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((row) => {
          return (
            <div
              key={row.key}
              data-index={row.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translateY(${
                  row.start - virtualizer.options.scrollMargin
                }px)`,
                display: 'flex',
              }}
            >
              <div style={{ width: `${before}px` }} />
              {columnItems.map((column) => {
                return (
                  <div
                    key={column.key}
                    style={{
                      minHeight: row.index === 0 ? 50 : row.size,
                      width: getColumnWidth(column.index),
                      borderBottom: '1px solid #c8c8c8',
                      borderRight: '1px solid #c8c8c8',
                      padding: '7px 12px',
                    }}
                  >
                    {row.index === 0 ? (
                      <div>{columns[column.index].name}</div>
                    ) : (
                      <div>{data[row.index][column.index]}</div>
                    )}
                  </div>
                )
              })}
              <div style={{ width: `${after}px` }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const generateColumns = (count: number) => {
  return new Array(count).fill(0).map((_, i) => {
    const key: string = i.toString()
    return {
      key,
      name: `Column ${i}`,
      width: randomNumber(75, 300),
    }
  })
}

const generateData = (columns: Column[], count = 300) => {
  return new Array(count).fill(0).map((_, rowIndex) =>
    columns.reduce<string[]>((acc, _curr, colIndex) => {
      // simulate dynamic size cells
      const val = faker.lorem.lines(((rowIndex + colIndex) % 10) + 1)

      acc.push(val)

      return acc
    }, [])
  )
}
