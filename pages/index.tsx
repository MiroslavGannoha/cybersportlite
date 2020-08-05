import * as React from 'react';
import cheerio from 'cheerio';
import styles from '../styles/index.module.css';
import PortalsNavbar from '../components/PortalsNavbar';
import { portalsDomains } from '../settings';
import Head from 'next/head';

const MainPage = ({ news }: { news: any[] }) => {
    const featuredTitlesList = news
        .filter(({ isFeatured }) => isFeatured)
        .map(({ title, link, commentsCount }, i) => {
            const isHot = commentsCount > 24;

            return (
                <div
                    className={styles.title}
                    key={i + '__n__featured'}
                    style={{
                        fontWeight: 'bolder',
                        fontSize: '1.15em',
                    }}
                >
                    <a href={portalsDomains.cybersport + link} target="_blank">
                        <img
                            src="/featured.png"
                            width="20px"
                            style={{
                                marginRight: 12,
                                verticalAlign: 'bottom',
                            }}
                            alt="featured title"
                        />
                        {title}
                    </a>

                    <a
                        href={portalsDomains.cybersport + link + '#comments'}
                        target="_blank"
                        style={{ marginLeft: 15, textDecoration: 'none' }}
                    >
                        <img
                            alt="comments"
                            src={isHot ? '/fire.png' : '/comments.png'}
                            width="15px"
                            style={{
                                marginRight: 4,
                                marginBottom: -2,
                                filter: isHot ? 'none' : 'opacity(0.6)',
                            }}
                        />
                        <span style={{ color: isHot ? '#ff5722' : 'gray' }}>
                            {commentsCount}
                        </span>
                    </a>
                </div>
            );
        });
    const titlesList = news
        .filter(({ isFeatured }) => !isFeatured)
        .map(({ title, link, commentsCount, discipline }, i) => {
            const isHot = commentsCount > 24;

            return (
                <div className={styles.title} key={i + '__n'}>
                    <a href={portalsDomains.cybersport + link} target="_blank">
                        <img
                            src={'/' + discipline + '.png'}
                            width="20px"
                            style={{
                                marginRight: 12,
                                verticalAlign: 'bottom',
                            }}
                            alt={discipline}
                        />
                        {title}
                    </a>

                    <a
                        href={portalsDomains.cybersport + link + '#comments'}
                        target="_blank"
                        style={{ marginLeft: 15, textDecoration: 'none' }}
                    >
                        <img
                            alt="comments"
                            src={isHot ? '/fire.png' : '/comments.png'}
                            width="15px"
                            style={{
                                marginRight: 4,
                                marginBottom: -2,
                                filter: isHot ? 'none' : 'opacity(0.6)',
                            }}
                        />
                        <span style={{ color: isHot ? '#ff5722' : 'gray' }}>
                            {commentsCount}
                        </span>
                    </a>
                </div>
            );
        });
    return (
        <div className={styles.container}>
            <Head>
                <title>Cybersport news</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <meta
                    name="description"
                    content="cybersport.ru news киберспортивные новости"
                ></meta>
                <link rel="icon" href="./favicon.png" />
            </Head>
            <PortalsNavbar />
            <div style={{ marginBottom: 26 }}>{featuredTitlesList}</div>
            <div>{titlesList}</div>
        </div>
    );
};

export async function getStaticProps(context) {
    console.time();

    const news = await fetch(portalsDomains.cybersport)
        .then((res) => res.text())
        .then((data) => {
            const r = cheerio.load(data);
            return r;
        })
        .then(($) => {
            const titles = $('.news-sidebar__post').map((index, element) => {
                const $link = $(element).find('.news-sidebar__link');
                const discipline = $(element)
                    .find('.news-sidebar__discipline')
                    .find('g')
                    .attr('class')
                    .split('--')[1];

                const commentsId = $(element).find('.comment-counter').data()
                    .objectId;
                const title = $link.text();

                return {
                    title: title,
                    link: $link.attr('href'),
                    commentsCount: 0,
                    commentsId,
                    isFeatured: false,
                    discipline,
                };
            });
            const featuredTitles = $('.card-feature.news').map(
                (index, element) => {
                    const link = $(element)
                        .find('.responsive-card-feature ')
                        .attr('href');
                    const commentsId = $(element)
                        .find('.comment-counter')
                        .data().objectId;

                    const title = $(element)
                        .find('.card-feature__title')
                        .children('a')
                        .text();

                    return {
                        title: title,
                        discipline: '',
                        link,
                        commentsCount: 0,
                        commentsId,
                        isFeatured: true,
                    };
                }
            );

            const titlesArray: any[] = [
                ...featuredTitles.toArray(),
                ...titles.toArray(),
            ];

            return titlesArray;
        })
        .then((titles) => {
            const commentsQuery = titles
                .map(({ commentsId }) => commentsId)
                .join(',1|');

            return fetch(
                `${portalsDomains.cybersport}/internal-api/comments/count?data=1|${commentsQuery}`
            )
                .then((resp) => resp.json())
                .then((data) => {
                    data.content.forEach(
                        ({ count, identity: { objectId } }) => {
                            const article = titles.find(
                                ({ commentsId }) =>
                                    Number(commentsId) === objectId
                            );

                            if (article) {
                                article.commentsCount = count;
                            }
                        }
                    );
                    return titles;
                });
        });
    console.timeEnd();

    return {
        props: { news: news }, // will be passed to the page component as props
    };
}

export default MainPage;
