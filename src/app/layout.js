import './globals.css'
import { Inter } from 'next/font/google'
import Header from '../components/Header';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Pouya Sadeqpour | Front End Developer and Designer',
  description: 'Where the Codes Meet Arts , I am there ...',
  keywords: ['Front End Developer', 'React', 'Next.js', 'Web Design'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
