import * as React from 'react';
import styles from '../styles/index.module.css';
import { portalsDomains } from '../settings';
import Link from 'next/link';

const PortalsNavbar = () => {
    return (
        <div style={{display: 'flex', justifyContent: "space-between"}}>
            <Link href="/" >
                <a>
                    <img
                        style={{ borderRadius: 10 }}
                        width="40px"
                        alt="home"
                        src="/favicon.png"
                    />
                </a>
            </Link>
            <ul className={styles.list} style={{marginLeft: 60}}>
                <li>
                    <Link href="/cybersport">
                        <a>
                            <img
                                style={{ borderRadius: 10 }}
                                width="40px"
                                alt={portalsDomains.cybersport}
                                src={`${portalsDomains.cybersport}/favicon.ico`}
                            />
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href="/gameinside">
                        <a>
                            <img
                                style={{ borderRadius: 10 }}
                                width="40px"
                                alt={portalsDomains.gameInside}
                                src={`${portalsDomains.gameInside}/favicon.ico`}
                            />
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href="/">
                        <a>
                            <img
                                style={{ borderRadius: 10 }}
                                width="40px"
                                alt={portalsDomains.cyberSports}
                                src={`${portalsDomains.cyberSports}/favicon.ico`}
                            />
                        </a>
                    </Link>
                </li>
                {/*             <li>
                <Link href="/">
                    <a>
                        <img
                            style={{borderRadius: 10}}
                            width="40px"
                            alt={portalsDomains.championat}
                            src={`${portalsDomains.championat}/favicon.ico`}
                        />
                    </a>
                </Link>
            </li> */}
            </ul>
        </div>
    );
};

export default PortalsNavbar;
