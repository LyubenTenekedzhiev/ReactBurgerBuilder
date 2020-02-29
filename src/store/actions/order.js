import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';
import order from '../../components/Order/Order';

export const purchaseBurgerSuccess = ( id, orderData ) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData
  }
}

export const purchaseBurgerFail = ( error ) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error: error
  }
}

export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START,
  }
}

export const purchaseBurger = ( orderData ) => {
  return dispatch => {
    dispatch(purchaseBurgerStart());
    axios.post('/orders.json', orderData)
    .then(response => {
      dispatch(purchaseBurgerSuccess(response.data.name, orderData));
      console.log(response.data);
    }).catch(error => {
      dispatch(purchaseBurgerFail(error));
    });
  }
}

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT
  }
}

export const fetchOrdersSuccess = (orders) => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders: orders,
  }
}

export const fetchOrdersFail = (error) => {
  return {
    type: actionTypes.FETCH_ORDERS_FAIL,
    error: error,
  }
}

export const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START,
  }
}

export const fetchOrders = () => {
  return dispatch => {
    dispatch(fetchOrdersStart());
    axios.get('/orders.json')
          .then(res => {
            const fetchedData = [];
            for(let key in res.data) {
              fetchedData.push({
                ...res.data[key],
                id: key
              });
            }
            dispatch(fetchOrdersSuccess(fetchedData));
          }).catch(err => {
            dispatch(fetchOrdersFail(err));
          })
  }
}