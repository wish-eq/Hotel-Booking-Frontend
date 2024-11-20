import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TopMenu from '@/components/TopMenu'
import NextAuthProvider from '@/provider/NextAuthProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/authOptions'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HOTEL',
  description: 'EIAM & Q',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`{inter.className} dark:bg-slate-100`}>
          <NextAuthProvider session={session}>
            <TopMenu/>
            {children}
          </NextAuthProvider>
      </body>
    </html>
  )
}