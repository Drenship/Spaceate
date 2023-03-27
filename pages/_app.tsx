import type { AppProps } from 'next/app'
import { SessionProvider, useSession } from 'next-auth/react';
import { Router, useRouter } from 'next/router';
import ProgressBar from "@badrap/bar-of-progress";
import { RecoilRoot, RecoilEnv } from 'recoil';
import { NotifyContextProvider } from '@libs/hooks/notify';
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css'
import CookiePopup from '@components/ui-ux/Notifications/CookiePopup';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const progress = new ProgressBar({
  size: 4,
  color: '#FE595E',
  className: 'z-50 bg-gradient-to-r from-sky-500 to-purple-500',
  delay: 100,
});

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

const MyApp: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <NotifyContextProvider>
          {/* Higher Order Component */}
          {
            Component.auth ? (
              <Auth adminOnly={Component.auth.adminOnly}>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )
          }
          <Analytics />
          <CookiePopup />
        </NotifyContextProvider>
      </RecoilRoot>
    </SessionProvider>
  )
}

interface AuthProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const Auth: React.FC<AuthProps> = ({ children, adminOnly = false }) => {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=admin login required');
  }

  return children;
}


//export function reportWebVitals(metric) {
//  console.log(metric)
//}

export default MyApp