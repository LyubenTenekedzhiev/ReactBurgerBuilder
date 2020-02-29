import React from 'react';

import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

import * as actions from '../../../store/actions/index';

class ContactData extends React.Component {
  state = {
    orderForm: {
        name: {
          elementType: 'input',
          elementConfig: {
            type: 'text',
            placeholder: 'Your Name',
          },
          value: '',
          validation: {
            required: true,
          },
          valid: false,
          touched: false,
        },
        street: {
          elementType: 'input',
          elementConfig: {
            type: 'text',
            placeholder: 'Your Street',
          },
          value: '',
          validation: {
            required: true,
          } ,
          valid: false,
          touched: false,
        },
        zipcode: {
          elementType: 'input',
          elementConfig: {
            type: 'text',
            placeholder: 'ZIP Code',
          },
          value: '',
          validation: {
            required: true,
            minLength: 5,
            maxLength: 5,
          },
          valid: false,
          touched: false,
        },
        country: {
          elementType: 'input',
          elementConfig: {
            type: 'text',
            placeholder: 'Country',
          },
          value: '',
          validation: {
            required: true,
          },
          valid: false,
          touched: false,
        },
        email: {
          elementType: 'input',
          elementConfig: {
            type: 'text',
            placeholder: 'Your Email',
          },
          value: '',
          validation: {
            required: true,
          },
          valid: false,
          touched: false,
        },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
         option: [
           {value: 'fastest', displayValue: 'Fastest'},
           {value: 'cheapest', displayValue: 'Cheapest'},
          ],
        },
        value: 'fastest',
        validation: {},
        valid: true
      },
    },
    formIsValid: false
  }

  orderHandler = (event) => {
    event.preventDefault();  
    //Showing spinner
    // this.setState({loading: true});

    const formData = {};
    for(let formElIdentifier in this.state.orderForm) {
      console.log(formElIdentifier);
      formData[formElIdentifier] = this.state.orderForm[formElIdentifier].value;
    }

    const order = {
      ingredients: this.props.ings,
      price: this.props.totalPrice,
      orderData: formData,
    }
    this.props.onOrderBurger(order);

    // fetching data without redux

    // axios.post('/orders.json', order)
    //       .then(response => {
    //         this.setState({ loading: false})
    //         this.props.history.push('/');
    //       }).catch(error => {
    //         this.setState({ loading: false})
    //       });
  }

  checkValidity(value, validation) {
    let isValid = true;

    if(validation.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if(validation.minLength) {
      isValid = value.length >= validation.minLength && isValid;
    }

    if(validation.maxLength) {
      isValid = value.length <= validation.maxLength && isValid;
    }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedFormEl = {...updatedOrderForm[inputIdentifier]};
    updatedFormEl.value = event.target.value;
    updatedFormEl.valid = this.checkValidity(updatedFormEl.value, updatedFormEl.validation);
    updatedFormEl.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormEl;

    let formIsValid = true;
    for(let inputChangedHandler in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
  };
  

  render() {
    const formElementArray = [];
    for(let key in this.state.orderForm) {
      formElementArray.push({
        id: key,
        config: this.state.orderForm[key],
      })
    }
    let form = (
      <form onSubmit={this.orderHandler}>
          {formElementArray.map(element => {
            return <Input 
                          key={element.id}
                          elementType={element.config.elementType}
                          elementConfig={element.config.elementConfig}
                          value={element.config.value}
                          invalid={!element.config.valid}
                          shouldValidate={element.config.validation}
                          touched={element.config.touched}
                          changed={(event) => this.inputChangedHandler(event, element.id)} />
          })}
          <Button btnType="Success" disabled={!this.state.formIsValid} >ORDER</Button>
        </form>
    );
    if(this.props.loading) {
      form = <Spinner />
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData) => dispatch(actions.purchaseBurger(orderData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));