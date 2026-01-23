import '../styles/globals.css'
import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Hello Gorgeous Med Spa',
  description: 'Luxury medical aesthetics and wellness in Oswego, IL',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
