import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { logout } from '../utils/generalFunctions';
import { UserNavigationMenuItem } from './utils/generalComponents';

function Landing() {
    const [ jwtToken, setJwtToken ] = React.useState( localStorage.getItem('user-access-token') );

    return <>
        { (jwtToken) ?
            (<>
                <UserNavigationMenuItem text={'Log Out'} onClickFunction={() => logout(setJwtToken)} />
                <h1>Main Page</h1>
                <h2><Link to={'/courses'}>Purchase Courses</Link></h2>
                <h2><Link to={'/courses/purchased'}>Show Purchased Courses</Link></h2>
            </>) :
                (<> 
                    <h1>Main Page</h1>
                    <h2><Link to={'/login'}>Login</Link></h2>
                    <h2><Link to={'/signup'}>Signup</Link></h2>
                </>) }
    </>
}

export default Landing;
