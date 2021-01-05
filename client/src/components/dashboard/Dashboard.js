import React, {Fragment}from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'; //connect redux to component
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom'
import DashboardActions from './DashboardActions';


const Dashboard = ({getCurrentProfile,auth:{user},profile:{loading,profile}}) => {
 
    React.useEffect(()=> {
        getCurrentProfile();
    },[])
    return loading &&  profile === null ? <Spinner> </Spinner>:
    <Fragment>
        <h1 className='large text-primary'> Dashboard</h1>
        <p className='lead'>
        <i className='fas fa-user'/> welcome {user && user.name} 
        </p>
        {profile != null ? 
        <Fragment>
            <DashboardActions/>
        </Fragment>:
        <Fragment>
            <p> you have not setup a profile, please add some info </p>
            <Link to ='/create-profile' className="btn btn-primary my-1">
                Create profile
            </Link>
        </Fragment>}
    </Fragment>
}

Dashboard.propTypes = {
    getCurrentProfile:PropTypes.func.isRequired,
    auth:PropTypes.object.isRequired,
    profile:PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth:state.auth,
    profile:state.profile
})

export default  connect(mapStateToProps,{getCurrentProfile})(Dashboard)
