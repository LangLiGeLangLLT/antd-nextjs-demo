'use client'

import { Button } from 'antd'
import React from 'react'

export default function Page() {
  const [count, setCount] = React.useState<number[]>([])

  const handleAdd3 = () => {
    setTimeout(() => {
      setCount((prev) => {
        console.log(prev)
        return [...prev, 3]
      })
    }, 3000)
  }

  const handleAdd5 = () => {
    setTimeout(() => {
      setCount((prev) => {
        console.log(prev)
        return [...prev, 5]
      })
    }, 5000)
  }

  return (
    <div>
      <Button onClick={handleAdd5}>按钮B（5秒后加5）</Button>
      <Button onClick={handleAdd3}>按钮A（3秒后加3）</Button>
      <div>当前列表：{count.join(', ')}</div>
    </div>
  )
}
