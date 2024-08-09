// pages/login.js
import React from 'react';
import Image from 'next/image';
import styles from '@/styles/Login.module.css';
import Logo from '@/assets/img/logo2.png';

const Login = () => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginHeader}>
          <Image src={Logo} alt="Daily Control" height={50} width={200} />
          <p className={styles.subTitle}>Controle de Tráfego</p>
        </div>
        <form className={styles.loginForm}>
          <input type="email" placeholder="Telefone" className={styles.loginInput} />
          <input type="password" placeholder="Senha" className={styles.loginInput} />
          <button type="submit" className={styles.loginButton}>Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
