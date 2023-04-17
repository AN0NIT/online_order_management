import { Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from 'context/BackendContext';


const UserRoute = ({ component, ...rest }) => {

    let { user } = useContext(UserContext);

    if (!user) {
        return (<Route {...rest}>{<Navigate to='/' />} </Route>)
    } else {
        return (<Route {...rest} component={component} />)
    }
}

export default UserRoute;