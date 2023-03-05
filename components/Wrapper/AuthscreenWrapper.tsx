import Head from 'next/head';
import Image from 'next/image';

interface AuthscreenWrapperProps {
  title?: string;
  children: React.ReactNode;
}

export default function AuthscreenWrapper({ title, children }: AuthscreenWrapperProps): JSX.Element {
  const titleHead = title ? `${title} - Spaceate` : 'Spaceate';
  return (
    <div data-theme="light" className="flex flex-col items-center justify-center w-full min-h-screen ">
      <Head>
        <title>{titleHead}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-start flex-1 w-full">
        <div className="relative flex items-center justify-center w-full h-screen overflow-x-hidden">
          <Image
            src="/devassets-images/wallpaper-auth.jpg"
            layout="fill"
            className="select-none"
            objectFit="cover"
          />

          {children}
        </div>
      </main>
    </div>
  );
}