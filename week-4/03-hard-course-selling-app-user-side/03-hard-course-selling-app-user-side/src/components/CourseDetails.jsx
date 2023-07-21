import React, { useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { UserNavigationMenu, UserNavigationMenuItem } from './utils/generalComponents';

function request2PurchaseCourse(id, jwtToken) {
    const config = {
        method: 'POST',
        url: `http://localhost:3000/users/courses/${id}`,
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    }

    axios.request(config)
    .then(response => console.log('Course Purchased Successfully!'))
    .catch(err => console.log(err));
}

function CourseDetails() {
    const navigate = useNavigate();

    const params = useParams();
    const id = params.id;

    const jwtToken = localStorage.getItem('user-access-token');

    const [ courseDetails, setCourseDetails ] = React.useState({});

    const location = useLocation();
    useEffect(() => {
        const allCourses = (location.state?.allCourses) || ([]);
        const filteredInCourse = allCourses.filter(val => val._id === id);
        if (filteredInCourse.length === 1) {
            setCourseDetails( filteredInCourse[0] )
        } else {

            console.log('Error while fetching course with a specific ID');
            console.log(filteredInCourse);

        }
    }, []);

    return <>
        <UserNavigationMenu />
        <UserNavigationMenuItem text={'Go Back To Previous Page'} onClickFunction={() => navigate('/courses')} />
        <h1>Course Details</h1>
        <h2>{ (courseDetails?.title) ?
                (<>Title - {courseDetails.title}</>) :
                    (<></>) }</h2>
        <h3>{ (courseDetails?.description) ?
                (<>Description - {courseDetails.description}</>) :
                    (<></>) }</h3>
        <h3>{ (courseDetails?.price) ?
                (<>Price - {courseDetails.price}</>) :
                    (<></>) }</h3>
        <h3>{ (courseDetails?.imageLink) ?
                (<>Image Link - {courseDetails.imageLink}</>) :
                    (<></>) }</h3>
        <h3>{ (courseDetails?.published !== null) ?
                (<>Published - { (courseDetails.published) ? 'Yes' : 'No'}</>) :
                    (<></>) }</h3>
        <button onClick={() => {
            request2PurchaseCourse(id, jwtToken);
            navigate('/courses');
        }}>Purchase Course</button>
    </>
}

export default CourseDetails;
