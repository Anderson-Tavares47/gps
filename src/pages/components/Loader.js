// src/components/Loader.js

import React from 'react';
import styles from '@/styles/Load.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <p>Carregando...</p>
    </div>
  );
};

export default Loader;
