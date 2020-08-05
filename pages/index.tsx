import * as React from 'react';
import cheerio from 'cheerio';
import styles from '../styles/index.module.css';

const cybersport = 'https://www.cybersport.ru';
const gameInside = 'https://gameinside.ua';
const cyberSports = 'https://cyber.sports.ru';
const championat = 'https://championat.com';

const MainPage = ({ news }: { news: any[] }) => {
    const newsList = news.map(({ title, link, commentsCount, isMain }, i) => {
        const isHot = commentsCount > 24;
        
        return (
            <div className={styles.title} key={i + '__n'} style={{fontWeight: isMain ? 'bolder' : 'normal', marginBottom: isMain ? 16 : 0}}>
                <a href={cybersport + link} target="_blank">
                    {title}
                </a>

                <a
                    href={cybersport + link + '#comments'}
                    target="_blank"
                    style={{ marginLeft: 15, textDecoration: 'none' }}
                >
                    <img
                        src={isHot ? '/fire.png' : '/comments.png'}
                        width="15px"
                        style={{ marginRight: 4, marginBottom: -2, filter: isHot ? 'none' : 'opacity(0.6)' }}
                    />
                    <span style={{color: isHot ? '#ff5722' : 'gray'}}>
                        {commentsCount}
                    </span>
                </a>
            </div>
        );
    });
    return (
        <div className={styles.container}>
            <ul className={styles.list}>
                <li>
                    <a href="/" >
                        <img width="40px" alt="www.cybersport.ru" src={`${cybersport}/favicon.ico`} />
                    </a>
                </li>
                <li>
                    <a href="/">
                        <img width="40px"  alt="www.gameInside.ua" src={`${gameInside}/favicon.ico`} />
                    </a>
                </li>
                <li>
                    <a href="/">
                        <img width="40px" alt="www.cyber.sports.ru" src={`${cyberSports}/favicon.ico`} />
                    </a>
                </li>
                <li>
                    <a href="/">
                        <img width="40px" alt="www.championat.ru/cybersport" src={`${championat}/favicon.ico`} />
                    </a>
                </li>
            </ul>
            <div>{newsList}</div>
        </div>
    );
};

export async function getStaticProps(context) {
    console.time();

    const news = await fetch(cybersport)
        .then((res) => res.text())
        .then((data) => {
            const r = cheerio.load(data);
            return r;
        })
        .then(($) => {
            const $mainArticle = $('.news--1');
            const mainTitle = $mainArticle.find('.card-feature__title').children('a').text();
            const mainLink = $mainArticle.find('.responsive-card-feature ').attr('href');
            const mainCommentsId = $mainArticle.find('.comment-counter').data().objectId;
            
            const titles = $('.news-sidebar__post').map((index, element) => {
                const $link = $(element).find('.news-sidebar__link');
                const commentsId = $(element).find('.comment-counter').data()
                    .objectId;
                const title = $link.text();
                return {
                    title: title,
                    link: $link.attr('href'),
                    commentsCount: 0,
                    commentsId,
                    isMain: false,
                };
            });

            const titlesArray: any[] = titles.toArray();
            titlesArray.unshift({
                title: mainTitle,
                link:mainLink,
                commentsCount: 0,
                commentsId: mainCommentsId,
                isMain: true,
            })
            return titlesArray;
        })
        .then((titles) => {
            const commentsQuery = titles
                .map(({ commentsId }) => commentsId)
                .join(',1|');

            return fetch(
                `${cybersport}/internal-api/comments/count?data=1|${commentsQuery}`
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
        props: { news: news  }, // will be passed to the page component as props
    };
}

export default MainPage;
