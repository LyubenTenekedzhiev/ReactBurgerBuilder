import React from 'react';

import classes from './Input.module.css';

const input = (props) => {
  let inputEl = null;
  const classesArray = [classes.InputElement];
  
  if(props.invalid && props.shouldValidate && props.touched) {
    classesArray.push(classes.Invalid)
  }

  switch(props.elementType) {
    case( 'input' ): 
      inputEl = <input className={classesArray.join(' ')} onChange={props.changed} {...props.elementConfig}  value={props.value}/>;
      break;
    case ('textarea'):
      inputEl = <textarea className={classesArray.join(' ')} onChange={props.changed} {...props.elementConfig} value={props.value}/>;
      break;
    case ('select'):
      inputEl = <select className={classesArray.join(' ')} onChange={props.changed}  value={props.value}>
                {props.elementConfig.option.map(option => {
                  return <option key={option.value} value={option.value}>{option.displayValue}</option>
                })}
                </select>;
                break;
    default:
      inputEl = <input className={classesArray.join(' ')} {...props.elementConfig} value={props.value}/>;
      break;
  }

  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputEl}
    </div>
  )
}

export default input;
