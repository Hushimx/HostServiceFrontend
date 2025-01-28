import Link from 'next/link';
import styles from './Navbar.module.css';

const Logo = ({ href = '/' }: { href?: string }) => {
  return (
    <Link href={href || ''}>
      <div className={styles.navbarBrand}>
        <span className={styles.logoNav}>
          <span className={styles.host}>Host</span>
          <span className={styles.service}>Service</span>
        </span>
      </div>
      </Link>
  );
};

export default Logo;
