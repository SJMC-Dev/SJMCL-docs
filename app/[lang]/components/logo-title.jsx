import Image from "next/image";
import styles from "../styles/logo-title.module.css";
import logo from "../../../public/images/icons/Logo_128x128.png";

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
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Image src={logo} alt="Logo" width={36} height={36} />
      &nbsp;&nbsp;
      <TitleFull {...props} />
    </div>
  );
};