import type { Metadata } from 'next'
import Home from './Home';

export const metadata: Metadata = {
  title: 'Meta Bifrost - URL Shortener',
  description: 'Meta Bifrost로 URL을 한번 감싸서 안전하게 공유해보세요.',
  openGraph: {
    title: 'Meta Bifrost - URL Shortener',
    description: 'Meta Bifrost로 URL을 한번 감싸서 안전하게 공유해보세요.',
    images: [{
      url: '/og_image.jpeg',
      width: 1200,
      height: 630,
      alt: 'Meta Bifrost Preview'
    }]
  }
}

export default function Page() {
  return (
    <Home />
  )
}
