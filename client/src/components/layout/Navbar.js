import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {logout} from '../../actions/auth';
import { Fragment } from 'react';

 const Navbar = ({auth:{isAuthenticated,loading}, logout}) => {
     const authLinks = (
        <ul>
            <li>
                <a a onclick={logout} href="#!">
                <i className = "fas fa-sign-out-alt"></i>{''}
                <span className="hide-sm">logout </span>
                </a>
            </li>
        </ul>
     );

     const guestLinks = (
        <ul>
            <li>
                <Link to="!#">Developers</Link>
            </li>
            <li>
                <a href="/register">Register</a>
            </li>
            <li>
                <a href="/login">Login</a>
            </li>
        </ul>
     );
    return (
        <nav className="navbar bg-dark">
        <h1>
            <Link to ="/"><i className="fas fa-code"></i> DevConnector</Link>
        </h1>
        {!loading && (<Fragment> {isAuthenticated ? authLinks : guestLinks}</Fragment>)}
        </nav>
    )
}

Navbar.prototype = {
    logout:PropTypes.func.isRequired,
    auth:PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
  })
export default connect(mapStateToProps,{logout}) (Navbar)