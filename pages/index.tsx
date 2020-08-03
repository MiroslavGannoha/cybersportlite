import * as React from 'react';
import cheerio from 'cheerio';

const MainPage = ({ news }: { news: string[] }) => {
    const newsList = news.map((n, i) => {
        return <div key={i + '__n'}>{n}</div>;
    });
    return (
        <>
            <div>Main page1 {news?.length}</div>
            {newsList}
        </>
    );
};

export async function getStaticProps(context) {
    console.time();

    const news = await fetch('https://www.cybersport.ru')
        .then((res) => res.text())
        .then((data) => {
            const r = cheerio.load(data);
            return r;
        })
        .then(($) => {
            const news = $('.news-sidebar__link').map((index, element) =>
                $(element).text()
            );

            return news.toArray();
        });
    console.timeEnd();

    return {
        props: { news: news }, // will be passed to the page component as props
    };
}

export default MainPage;
