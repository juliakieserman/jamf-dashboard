import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navigation from '../components/Navigation';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Navigation />
      <Component {...pageProps} />
    </div>
  )
}
