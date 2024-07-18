'use client'

import { useSize } from 'ahooks'
import { Table, TableProps } from 'antd'
import React from 'react'

type DataType = {
  name: string
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
]

const data: DataType[] = new Array(10000)
  .fill(0)
  .map((_, i) => ({ name: `Name ${i}` }))

export default function Page() {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const size = useSize(parentRef)
  const headHeight = 55
  const height = size?.height ? size.height - headHeight : 0

  return (
    <div
      ref={parentRef}
      className="flex-1"
      style={{ maxHeight: `calc(100vh - 64px - 48px)` }}
    >
      {height !== 0 && (
        <Table
          virtual
          scroll={{ y: height }}
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.name}
          pagination={false}
        />
      )}
    </div>
  )
}
