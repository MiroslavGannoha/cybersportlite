import * as React from 'react';
import Head from 'next/head';

const PageHead = () => {
    return (
        <Head>
            <title>
                Cybersportnews.com - киберспортивные новости на максимальной
                скорости.
            </title>
            <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
            />
            <meta
                name="description"
                content="Киберспортивные новости с популярных порталов оптимизированные под мобильные устройства."
            />
            <meta
                property="og:title"
                content="Cybersportnews.com - киберспортивные новости на максимальной
                скорости."
            />
            <meta
                name="twitter:title"
                content="Cybersportnews.com - киберспортивные новости на максимальной
                скорости."
            />

            <meta property="og:url" content="https://www.cybersportnews.com/" />
            <meta name="twitter:url" content="https://www.cybersportnews.com/" />

            <meta
                property="og:description"
                content="Киберспортивные новости с популярных порталов оптимизированные под мобильные устройства."
            />
            <meta
                name="twitter:description"
                content="Киберспортивные новости с популярных порталов оптимизированные под мобильные устройства."
            />

            <link rel="icon" href="./favicon.png" />
        </Head>
    );
};

export default PageHead;
