import * as React from 'react';
import cheerio from 'cheerio';
import styles from '../../styles/index.module.css';
import PortalsNavbar from '../../components/PortalsNavbar';
import { portalsDomains } from '../../settings';
import { GetStaticProps } from 'next';
import Spinner from '../../components/Spinner';
import PageHead from '../../components/PageHead';

const Cybersport = ({ news }: { news: any[] }) => {
    const [comments, setComments] = React.useState([]);
    const [selectedItemId, setSelectedItemId] = React.useState(null);
    const [commentsLoading, setCommentsLoading] = React.useState(false);

    function showComments(itemId) {
        return () => {
            setCommentsLoading(true);
            setSelectedItemId(itemId);
            setComments([]);

            fetch(`/api/getComments?itemId=${itemId}`)
                .then((resp) => resp.json())
                .then((data) => {
                    setCommentsLoading(false);
                    setComments(data);
                });
        };
    }

    const commentsList = comments.map(
        ({ text, author, avatar, likes, dislikes }, i) => {
            return (
                <div
                    key={`comment-${author}-${i}`}
                    style={{
                        fontSize: '0.9em',
                        color: '#676767',
                        display: 'flex',
                        marginBottom: 10,
                    }}
                >
                    <div
                        style={{
                            minWidth: 40,
                            marginRight: 4,
                            fontWeight: 'bold',
                        }}
                    >
                        <div style={{ color: '#00aa00' }}>▲ {likes}</div>
                        <div style={{ color: 'red' }}>▼ {dislikes}</div>
                    </div>
                    <img
                        src={avatar}
                        width="40px"
                        height="40px"
                        style={{ marginRight: 10 }}
                    />
                    <div>
                        <div style={{ marginBottom: 5 }}>{author}</div>
                        <div style={{ color: 'black' }}>{text}</div>
                    </div>
                </div>
            );
        }
    );

    const featuredTitlesList = news
        .filter(({ isFeatured }) => isFeatured)
        .map(({ title, link, commentsCount, itemId }, i) => {
            const isHot = commentsCount > 24;

            return (
                <div key={i + '__n__featured'}>
                    <div
                        className={styles.title}
                        style={{
                            fontWeight: 'bolder',
                        }}
                    >
                        <a
                            href={portalsDomains.cybersport + link}
                            target="_blank"
                        >
                            <img
                                src="/featured.png"
                                width="20px"
                                style={{
                                    marginRight: 12,
                                    verticalAlign: 'bottom',
                                }}
                                alt="главные новости"
                            />
                            {title}
                        </a>

                        <a
                            href={
                                portalsDomains.cybersport + link + '#comments'
                            }
                            target="_blank"
                            style={{ marginLeft: 15, textDecoration: 'none' }}
                        >
                            <img
                                alt="всего комментариев"
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
                        <img
                            alt="просмотр топ комментариев"
                            src="preview.png"
                            width="18px"
                            onClick={showComments(itemId)}
                            style={{
                                marginLeft: 10,
                                marginBottom: -4,
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                    {itemId === selectedItemId ? (
                        commentsLoading ? (
                            <div style={{ marginLeft: 40 }}>
                                <Spinner />
                            </div>
                        ) : (
                            <div style={{ marginLeft: 20 }}>{commentsList}</div>
                        )
                    ) : null}
                </div>
            );
        });

    const titlesList = news
        .filter(({ isFeatured }) => !isFeatured)
        .map(({ title, link, commentsCount, discipline, itemId }, i) => {
            const isHot = commentsCount > 24;

            return (
                <div key={i + '__n'}>
                    <div className={styles.title}>
                        <a
                            href={portalsDomains.cybersport + link}
                            target="_blank"
                        >
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
                            href={
                                portalsDomains.cybersport + link + '#comments'
                            }
                            target="_blank"
                            style={{ marginLeft: 15, textDecoration: 'none' }}
                        >
                            <img
                                alt="всего комментариев"
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
                        <img
                            alt="просмотр топ комментариев"
                            src="preview.png"
                            width="18px"
                            onClick={showComments(itemId)}
                            style={{
                                marginLeft: 10,
                                marginBottom: -4,
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                    {itemId === selectedItemId ? (
                        commentsLoading ? (
                            <div style={{ marginLeft: 40 }}>
                                <Spinner />
                            </div>
                        ) : (
                            <div style={{ marginLeft: 20 }}>{commentsList}</div>
                        )
                    ) : null}
                </div>
            );
        });
    return (
        <div className={styles.container}>
            <PageHead />
            <PortalsNavbar />
            <div style={{ marginBottom: 26 }}>{featuredTitlesList}</div>
            <div>{titlesList}</div>
        </div>
    );
};

export async function getStaticProps<GetStaticProps>() {
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

                const itemId = $(element).find('.comment-counter').data()
                    .objectId;
                const title = $link.text();

                return {
                    title: title,
                    link: $link.attr('href'),
                    commentsCount: 0,
                    itemId,
                    isFeatured: false,
                    discipline,
                };
            });
            const featuredTitles = $('.card-feature.news').map(
                (index, element) => {
                    const link = $(element)
                        .find('.responsive-card-feature ')
                        .attr('href');
                    const itemId = $(element).find('.comment-counter').data()
                        .objectId;

                    const title = $(element)
                        .find('.card-feature__title')
                        .children('a')
                        .text();

                    return {
                        title: title,
                        discipline: '',
                        link,
                        commentsCount: 0,
                        itemId,
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
                .map(({ itemId }) => itemId)
                .join(',1|');

            return fetch(
                `${portalsDomains.cybersport}/internal-api/comments/count?data=1|${commentsQuery}`
            )
                .then((resp) => resp.json())
                .then((data) => {
                    data.content.forEach(
                        ({ count, identity: { objectId } }) => {
                            const currentArticles = titles.filter(
                                ({ itemId }) => Number(itemId) === objectId
                            );

                            if (currentArticles) {
                                currentArticles.forEach((a) => a.commentsCount = count);
                            }
                        }
                    );
                    return titles;
                });
        });
    console.timeEnd();

    return {
        props: { news: news }, // will be passed to the page component as props
        revalidate: 60,
    };
}

export default Cybersport;
