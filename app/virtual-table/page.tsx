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

const data: DataType[] = new Array(100)
  .fill(0)
  .map((_, i) => ({ name: `Name ${i + 1}` }))

export default function Page() {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState(0)
  const size = useSize(parentRef)

  React.useEffect(() => {
    setHeight(size?.height || 0)
  }, [size])

  return (
    <div
      ref={parentRef}
      className="flex-1 max-h-[calc(100vh-64px-48px)] overflow-y-hidden"
    >
      <Table
        virtual
        scroll={{ y: height }}
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.name}
        pagination={false}
      />
    </div>
  )
}
