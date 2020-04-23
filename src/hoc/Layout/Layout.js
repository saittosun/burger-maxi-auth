//jshint esversion: 6
//this should actually be a container because there we plan on managing the state for the burger we're about to build.
//Now this allows us to simply use this layout component as a wrapper around the core content component we want to render to the screen.
import React, { Component } from 'react';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import Aux from '../_Aux/_Aux';
import classes from './Layout.css';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

//two solutions to that, do you remember them? Well for one, we could return an array here instead of JSX which is sitting next to each other, if we return an array and give each item a key, we are allowed to kind of return adjacent elements. The alternative is to create such an auxiliary higher order component. It serves only one purpose, wrapping something and immediately outputting it but hence fulfilling the requirement of having a wrapping component. we also have of course the third option of wrapping everything in a div here or another element but I don't need that div or any other element, actually I want to have adjacent elements, that is why I will go with the higher order component approach and create such a utility auxiliary component.
class Layout extends Component {//in my opinion, it makes more sense to turn the layout component into a class component where we can implement the method so that we can listen to both the sideDrawer closing itself by clicking on the backdrop as well as toolbar opening the sideDrawer by clicking on that toggle button.
  state = {
    showSideDrawer: false
  }
  sideDrawerClosedHandler = () => {
    this.setState({showSideDrawer: false})
  }

  sideDrawerToggleHandler = () => {
    this.setState((prevState) => {//This is the clean way of setting the state when it depends on the old state. Now we have a secure way of toggling that and changing showSideDrawer
      return {
        showSideDrawer: !prevState.showSideDrawer
      }
    })
  }

  render() {
    return (
      <Aux>
        <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
        <SideDrawer 
          open={this.state.showSideDrawer} 
          closed={this.sideDrawerClosedHandler}/>
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </Aux>
    )
  }
}

export default Layout;