import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { UserNavigationMenu } from './utils/generalComponents';

function ShowAllCourses() {
    const [allCourses, setAllCourses] =React.useState([]);
    const jwtToken = localStorage.getItem('user-access-token');
    
    useEffect(() => {
        const config = {
            method: 'GET',
            url: 'http://localhost:3000/users/courses',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        }
        
        axios.request(config)
        .then(response => response.data)
        .then(responseData => setAllCourses(responseData))
        .catch(err => console.log(err));
    }, [])

    return <>
        <UserNavigationMenu />
        <h1>
            All Courses Available
        </h1>
        {allCourses.map((val,idx) => (<Course key={idx} title={val.title} courseId={val._id} allCourses={allCourses} />))}
    </>
}

function Course(props) {
    const navigate = useNavigate();

    return <>
        <h2>{props.title} | | | <a href='' onClick={() => navigate(`/course/${props.courseId}`, {
            state: {
                allCourses: props.allCourses
            }
        })}>Purchase Course</a></h2>
    </>
}

export default ShowAllCourses;
