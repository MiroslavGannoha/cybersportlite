import * as React from 'react';
import styles from '../styles/index.module.css';
import { portalsDomains } from '../settings';

const PortalsNavbar = () => {
    return (
        <ul className={styles.list}>
            <li>
                <a href="/">
                    <img
                        width="40px"
                        alt={portalsDomains.cybersport}
                        src={`${portalsDomains.cybersport}/favicon.ico`}
                    />
                </a>
            </li>
            <li>
                <a href="/gameinside">
                    <img
                        width="40px"
                        alt={portalsDomains.gameInside}
                        src={`${portalsDomains.gameInside}/favicon.ico`}
                    />
                </a>
            </li>
            <li>
                <a href="/">
                    <img
                        width="40px"
                        alt={portalsDomains.cyberSports}
                        src={`${portalsDomains.cyberSports}/favicon.ico`}
                    />
                </a>
            </li>
            <li>
                <a href="/">
                    <img
                        width="40px"
                        alt={portalsDomains.championat}
                        src={`${portalsDomains.championat}/favicon.ico`}
                    />
                </a>
            </li>
        </ul>
    );
};

export default PortalsNavbar;
