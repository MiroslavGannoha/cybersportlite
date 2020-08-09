import * as React from 'react';
import styles from '../styles/index.module.css';
import PortalsNavbar from '../components/PortalsNavbar';
import Head from 'next/head';
import PageHead from '../components/PageHead';

const MainPage = ({ news }: { news: any[] }) => {

    return (
        <div className={styles.container}>
            <PageHead />
            <PortalsNavbar />
            Киберспортивные новости с популярных порталов оптимизированные под мобильные устройства.
        </div>
    );
};
export default MainPage;
