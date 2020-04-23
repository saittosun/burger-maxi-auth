// jshint esversion:6
import React, { Component } from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from '../src/hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/auth/Auth.js';
import Logout from './containers/auth/logout/Logout';
import * as actions from './store/actions/index';

class App extends Component {
  // state = {
  //   show: true
  // }

  // componentDidMount() {
  //   setTimeout(() => {
  //     this.setState({show: false})
  //   }, 5000);
  // }
  componentDidMount() {
    this.props.onTryAutoSignup();
  }
  render() {
    return (
      <div className="App">
        <Layout>
          {/* {this.state.show && <BurgerBuilder />} */}
          {/* <BurgerBuilder />
          <Checkout/> */}
          <Switch>
            <Route path="/checkout" component={Checkout}/>
            <Route path="/orders" component={Orders}/>
            {/* to be able to reach that, I'll also go into my components folder and there to navigation, navigation items into the navigation items component, here we got our links and I will add a new one, */}
            <Route path="/auth" component={Auth}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/" exact component={BurgerBuilder}/>
          </Switch>
        </Layout>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  // return my javascript object where I do map my props
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

// if you get an error like this which is always related to connect wrapping your component which you also want to load with routing and therefore this component doesn't receive your route props, you can simply wrap connect here with withRouter just like that.
//  with that tiny change, withRouter will enforce your props being passed down to your app component still and therefore the react router is back on the page and we'll know what's getting loaded so with that, we're working again.
export default withRouter(connect(null, mapDispatchToProps) (App));
