import '../styles/globals.css'
import { RecoilRoot } from 'recoil'
import { AuthProvider } from '@hooks/useAuth'
import ProgressBar from "@badrap/bar-of-progress";
import { Router } from 'next/router';

const progress = new ProgressBar({
  size: 4,
  color: '#FE595E',
  className: 'z-50 bg-gradient-to-r from-sky-500 to-purple-500',
  delay: 100,
});

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        {/* Higher Order Component */}
        <AuthProvider>
          {
            Component.auth ? (
              <Auth adminOnly={Component.auth.adminOnly}>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )
          }
        </AuthProvider>
      </RecoilRoot>
    </SessionProvider>
  )
}

export default MyApp