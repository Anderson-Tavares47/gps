import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTruck, FaMapMarkerAlt } from 'react-icons/fa'; // Importa os ícones
import Logo from '@/assets/img/logo_logaux_v3.png';
import Rotas from '@/assets/img/motoristas.png';
import Trasporte from '@/assets/img/transportadoras.png';
import Local from '@/assets/img/localizações.png';
import styles from "@/styles/Nav.module.css";

const NavigationMenu = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMenu = () => {
    setIsMinimized(!isMinimized);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className={`${styles.nav} ${isMinimized ? styles.minimized : ''}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image src={Logo} alt="Daily Control" height={50} width={200} />
        </div>
        <FaBars className={styles.menuIcon} onClick={toggleMenu} />
      </div>
      <ul>
        <li>
          <Link href="/" legacyBehavior>
            <a>
              <div className={styles.iconWrapper}>
                {isMinimized ? <FaTruck size={24} /> : <Image src={Trasporte} alt="Home Icon" height={30} width={50} />}
              </div>
              {!isMinimized && <span className={styles.text}>Home</span>}
            </a>
          </Link>
        </li>
        <li>
          <Link href="/rotas" legacyBehavior>
            <a>
              <div className={styles.iconWrapper}>
                {isMinimized ? <FaMapMarkerAlt size={24} /> : <Image src={Local} alt="Listar Rotas Icon" height={30} width={20} />}
              </div>
              {!isMinimized && <span className={styles.text}>Listar Rotas</span>}
            </a>
          </Link>
        </li>
        <li>
          <Link href="/login" legacyBehavior>
            <a>
              <span className={styles.text}>Login</span>
            </a>
          </Link>
        </li>
      </ul>
      {!isMinimized && (
        <span className={styles.copy}>© {currentYear} Todos os direitos reservados</span>
      )}
    </div>
  );
};

export default NavigationMenu;
