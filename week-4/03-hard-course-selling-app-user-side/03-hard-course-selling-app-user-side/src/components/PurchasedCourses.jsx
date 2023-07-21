import axios from 'axios';
import React, { useEffect } from 'react';

import { UserNavigationMenu } from './utils/generalComponents';

function PurchasedCourses() {

    const [ purchasedCourses, setPurchasedCourses ] = React.useState([]);

    useEffect(() => {
        const jwtToken = localStorage.getItem('user-access-token');

        const config = {
            method: 'GET',
            url: 'http://localhost:3000/users/purchasedCourses',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        }

        axios.request(config)
        .then(response => response.data)
        .then(responseData => setPurchasedCourses(responseData))
        .catch(err => console.log(err));
    })

    return <>
        <UserNavigationMenu />
        <h1>Purchased Courses</h1>
        {purchasedCourses.map((val,idx) => (<PurchasedCourse key={idx} title={val.title} />))}
    </>
}

function PurchasedCourse(props) {
    return <>
        <h2>{props.title}</h2>
    </>
}

export default PurchasedCourses;
