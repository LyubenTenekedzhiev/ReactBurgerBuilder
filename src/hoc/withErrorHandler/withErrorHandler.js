import React from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Auxiliary from '../Auxiliary';

const withErrorHandler = ( WrappedComponent, axios ) => {

  return class extends React.Component {
    state = {
      error: null,

    }

    componentDidMount() {
      this.requestInterceptor = axios.interceptors.request.use(req => {
        this.setState({ error: null})
        return req;
      })
      this.responseInterceptor = axios.interceptors.response.use(res => res, error => {
        this.setState({ error: error})
      })
    }

    componentWillUnmount() {
      // console.log('Will Unmount', this.requestInterceptor, this.responseInterceptor)
      axios.interceptors.request.eject(this.requestInterceptor)
      axios.interceptors.response.eject(this.responseInterceptor)
    }

    errorConfirmedHandler = () => {
      this.setState({error: null})
    }

    render() {
      return (
        <Auxiliary>
          <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Auxiliary>
      );
    }
  }
}
export default withErrorHandler;