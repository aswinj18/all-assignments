import React, { useEffect } from "react";
import axios from "axios";

function ShowCourses() {
    console.log('Inside ShowCourses');

    const [courses, setCourses] = React.useState([]);
    const jwtToken = sessionStorage.getItem('admin-session-key');

    console.log(jwtToken)

    useEffect(() => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            }
        }

        axios.get('http://localhost:3000/admin/courses', config)
        .then(response => response.data)
        .then(requestData => setCourses(requestData));
    }, [])

    return <div>
        <div style={{textAlign:"right"}}>
            <a href='/about'>Create Course</a>
        </div>
        <h1>Courses Present</h1>
        {courses.map((course, index) => <Course key={index} title={course.title} id={course._id} />)}
    </div>
}

function Course(props) {
    return <div>
        <h3>{props.title} | | | <a href={`course/${props.id}`}>Show Details</a></h3>
    </div>
}

export default ShowCourses;