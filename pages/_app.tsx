import '../styles/globals.css'
import { ReactNode, useEffect, useState } from 'react';
import type { AppProps } from 'next/app'
import { NextComponentType, NextPageContext } from 'next';
import { SessionProvider, useSession } from 'next-auth/react';
import { Router, useRouter } from 'next/router';
import ProgressBar from "@badrap/bar-of-progress";
import { Toaster } from 'react-hot-toast';

import { NotifyContextProvider } from '@libs/hooks/notify';
import { TypeUser } from '@libs/typings';
import useUserStore from '@libs/hooks/modals/useUserStore';

import Sidebar from '@components/Sidebar';
import BodySkeleton from '@components/Loader/BodySkeleton';
import ExportModalIndex from '@components/Modals/ExportModalIndex';
import { Analytics } from '@vercel/analytics/react';

const progress = new ProgressBar({
  size: 4,
  color: '#FE595E',
  className: 'z-50 bg-gradient-to-r from-sky-500 to-purple-500',
  delay: 100,
});

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

interface MyAppProps extends AppProps {
  Component: NextComponentType<NextPageContext, any, any> & {
    auth?: {
      adminOnly?: boolean;
    };
  };
}

const MyApp: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }: MyAppProps) => {

  const [hasMounted, setHasMounted] = useState(false);
  const useUser = useUserStore();

  useEffect(() => setHasMounted(true), [])

  useEffect(() => {
    if (!useUser.user && useUser.isLoading === false && hasMounted) {
      useUser.fetchUser();
    }
  }, [hasMounted])

  return (
    <SessionProvider session={session}>

        <NotifyContextProvider>
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            gutter={8}
          />
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

          <Sidebar />

          <ExportModalIndex />

        </NotifyContextProvider>


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
      router.push('/auth/login');
    },
  });
  const user = session && session.user as TypeUser || null;
  if (status === 'loading') {
    return <BodySkeleton />;
  }
  if (adminOnly && !user?.isAdmin) {
    router.push('/auth/login');
  }

  return children;
}

export default MyApp