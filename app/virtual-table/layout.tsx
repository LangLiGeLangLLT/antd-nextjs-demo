'use client'

import React from 'react'

import { Layout as AntdLayout } from 'antd'

const { Header, Content, Footer } = AntdLayout

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AntdLayout>
        <Header />
        <Content className="flex-1 container flex flex-col">{children}</Content>
        <Footer />
      </AntdLayout>
    </div>
  )
}
