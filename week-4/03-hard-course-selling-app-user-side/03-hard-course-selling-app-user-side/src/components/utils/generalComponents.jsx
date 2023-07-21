import { useNavigate } from 'react-router-dom';

import { logout } from '../../utils/generalFunctions';

export function UserNavigationMenuItem(props) {
    return <>
        <h3 style={{textAlign: "right"}}>
            <a href='' onClick={props.onClickFunction}>{props.text}</a>
        </h3>
    </>
}

export function UserNavigationMenu(props) {
    const navigate = useNavigate();

    return <>
        <UserNavigationMenuItem text={'Log Out'} onClickFunction={() => {
            logout();
            navigate('/');
        }} />
        <UserNavigationMenuItem text={'Go Back to Home Page'} onClickFunction={() => navigate('/')} />
    </>
}