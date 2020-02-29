import React from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends React.Component {

  componentDidMount() {
    this.props.onFetchOrders();

    // axios.get('/orders.json')
    //       .then(res => {
    //         const fetchedData = [];
    //         for(let key in res.data) {
    //           fetchedData.push({
    //             ...res.data[key],
    //             id: key
    //           });
    //         }
    //         this.setState({ loading: false, orders: fetchedData })
    //       }).catch(err => {
    //         this.setState({ loading: false })
    //       })
  }

  render() {
    let orders = <Spinner />;
    if(!this.props.loading) {
      orders = this.props.orders.map(order => {
        return <Order key={order.id}
                      ingredients={order.ingredients}
                      price={+order.price} />
      })
    }
    return orders;
  }
}

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: () => dispatch(actions.fetchOrders()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));