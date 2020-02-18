import React from 'react';
import LogoPng from '../../assets/burger-logo (1).png';
import classes from './Logo.module.css'

  const logo = (props) => (
    <div className={classes.Logo}>
      <img src={LogoPng} alt="My burger" />
    </div>
  );

  export default logo;