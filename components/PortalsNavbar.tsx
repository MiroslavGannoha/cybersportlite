import * as React from 'react';
import styles from '../styles/index.module.css';
import { portalsDomains } from '../settings';
import Link from 'next/link'

const PortalsNavbar = () => {
    return (
        <ul className={styles.list}>
            <li>
                <Link href="/">
                    <img
                        width="40px"
                        alt={portalsDomains.cybersport}
                        src={`${portalsDomains.cybersport}/favicon.ico`}
                    />
                </Link>
            </li>
            <li>
                <Link href="/gameinside">
                    <img
                        width="40px"
                        alt={portalsDomains.gameInside}
                        src={`${portalsDomains.gameInside}/favicon.ico`}
                    />
                </Link>
            </li>
            <li>
                <Link href="/">
                    <img
                        width="40px"
                        alt={portalsDomains.cyberSports}
                        src={`${portalsDomains.cyberSports}/favicon.ico`}
                    />
                </Link>
            </li>
            <li>
                <Link href="/">
                    <img
                        width="40px"
                        alt={portalsDomains.championat}
                        src={`${portalsDomains.championat}/favicon.ico`}
                    />
                </Link>
            </li>
        </ul>
    );
};

export default PortalsNavbar;
