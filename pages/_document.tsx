import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html lang="fr">
                <Head>
                    <meta name="theme-color" content="#ffffff" />
                    <link rel="icon" href="/favicons/favicon.ico" />
                    <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
                    <link rel="manifest" href="/site.webmanifest" />
                    <meta charSet="utf-8" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
