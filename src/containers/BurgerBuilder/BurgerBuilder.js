import React from 'react';

import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';


class BurgerBuilder extends React.Component {
  state = {
    purchasing: false,
  }

  componentDidMount() {
    // fetching initial ingredients from DB without redux async

    // axios.get('https://burgerbuildertwo.firebaseio.com/ingredients.json')
    //         .then(response => {
    //           this.setState({ingredients: response.data})
    //           console.log(this.state.ingredients);
    //         }).catch(error => {
    //           this.setState({error: true})
    //         })

    // with redux
    this.props.onInitIngredients();
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients).map(igKey => {
      return ingredients[igKey];
    }).reduce((sum, el) => {
      return sum + el;
    }, 0);
    return sum > 0;
  }

  purchaseHandler = () => {
    if(this.props.isAuthenticated) {
      this.setState({purchasing: true})
    } else {
      this.props.onSethAuthRedirectPath('/checkout')
      this.props.history.push('/auth');
    }
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false})
  }

  purchaseContinueHandler = () => {
    // without REDUX

    // const queryParams = [];
    // for(let i in this.state.ingredients) {
    //   queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    // }
    // queryParams.push('price=' + this.state.totalPrice);
    // const queryString = queryParams.join('&');
    // this.props.history.push({
    //   pathname: '/checkout',
    //   search: '?' + queryString
    // })

    // with REDUX
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
  }

  render() {
    //Disabling the Less button
    const disabledInfo = {
      ...this.props.ings,
    };
    for(let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0 ? true : false;
    };

    //Checking if the state is loading => to display Spinner
    let orderSummary = null;
    //Showing Spinner instead of Burger while fetching the ingredients from Firebase
    let burger = this.props.error ? 'Ingredients cannot be loaded' : <Spinner />
    if(this.props.ings) {
      burger = ( 
        <Auxiliary>
          <Burger ingredients={this.props.ings} />
             <BuildControls 
                ingredientAdded={this.props.onIngredientAdded}
                ingredientRemoved={this.props.onIngredientRemoved}
                disabled={disabledInfo}
                purchasable={this.updatePurchaseState(this.props.ings)}
                price={this.props.totalPrice}
                isAuth={this.props.isAuthenticated}
                ordered={this.purchaseHandler} />
        </Auxiliary>
      );
      orderSummary = <OrderSummary ingredients={this.props.ings} 
                            purchaseCancelled={this.purchaseCancelHandler} 
                            purchaseContinued={this.purchaseContinueHandler}
                            price={this.props.totalPrice} />
    }
    
    return (
      <Auxiliary>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
            {orderSummary}
        </Modal>
        {burger}
      </Auxiliary>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSethAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));