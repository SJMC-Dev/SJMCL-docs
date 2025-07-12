'use client'

import Image from "next/image";
import styles from "../styles/logo-title.module.css";
import logo from "../../public/images/icons/Logo_128x128.png";

export const TitleShort = (props) => {
  return (
    <h2 className={styles.title} {...props}>
      SJMC
      <span className={styles.highlight}>L</span>
    </h2>
  );
};

export const TitleFull = (props) => {
  return (
    <h2 className={styles.title} {...props}>
      SJMC
      <span className={styles.highlight}>&nbsp;L</span>
      auncher
    </h2>
  );
};


export const TitleFullWithLogo = (props) => {
  const SUPPORTED_LANGS = ['zh', 'en']

  const handleClick = () => {
    const path = window.location.pathname
    const parts = path.split('/').filter(Boolean)

    console.log(parts)

    const root = parts[0] || ''
    const lang = parts[1] && SUPPORTED_LANGS.includes(parts[1]) ? parts[1] :'zh'

    const target = `/${root}/${lang}`
    window.location.href = target
  }
  
  return (
    <div
      onClick={handleClick}
      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
    >
      <Image src={logo} alt="Logo" width={36} height={36} />
      &nbsp;&nbsp;
      <TitleFull {...props} />
    </div>
  )
}