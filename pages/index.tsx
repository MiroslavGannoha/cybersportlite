import * as React from 'react';
import cheerio from 'cheerio';

const MainPage = ({ news }: { news: any[] }) => {
    const newsList = news.map(({ title, link }, i) => {
        return (
            <div style={{margin: '5px 0'}}>
                <a href={'https://www.cybersport.ru' + link} target="_blank" key={i + '__n'}>
                    {title}
                </a>
            </div>
        );
    });
    return (
        <div style={{margin: '10px 10%'}}>
            {newsList}
        </div>
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
            const news = $('.news-sidebar__link').map((index, element) => {
                return {
                    title: $(element).text(),
                    link: $(element).attr('href'),
                };
            });

            return news.toArray();
        });
    console.timeEnd();

    return {
        props: { news: news }, // will be passed to the page component as props
    };
}

export default MainPage;
