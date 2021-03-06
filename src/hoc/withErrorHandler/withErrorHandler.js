import React, { useState, useEffect } from "react";
import Modal from "../../components/UI/Modal/Modal";
import Auxiliary from "../Auxiliary";

const withErrorHandler = (WrappedComponent, axios) => {
  return props => {
    const [error, setError] = useState(null);
    
    const requestInterceptor = axios.interceptors.request.use(req => {
      setError(null);
      return req;
    });
    const responseInterceptor = axios.interceptors.response.use(
      res => res,
      error => {
        setError(error);
      }
    );

    useEffect(() => {
      return () => {
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
      };
    }, [requestInterceptor, responseInterceptor]);

    const errorConfirmedHandler = () => {
      this.setState({ error: null });
    };

    return (
      <Auxiliary>
        <Modal show={error} modalClosed={errorConfirmedHandler}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Auxiliary>
    );
  };
};
export default withErrorHandler;
