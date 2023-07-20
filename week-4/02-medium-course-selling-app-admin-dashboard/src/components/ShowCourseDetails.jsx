import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function pushCourseDetailChanges(courseDetails, jwtToken) {
    console.log('Inside pushCourseDetailChanges');

    const config = {
        method: 'PUT',
        url: `http://localhost:3000/admin/courses/${courseDetails.id}`,
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(courseDetails)
    }

    console.log(config);

    axios.request(config)
    .then(response => console.log('Course Updated Successfully!'))
    .catch(err => console.log('Course Update Failed!'));
}

function ShowCourseDetails() {
    console.log('Inside ShowCourseDetails');

    const { id } = useParams();
    const jwtToken = sessionStorage.getItem('admin-session-key');

    const [ title, setTitle ] = React.useState('');
    const [ description, setDescription ] = React.useState('');
    const [ price, setPrice ] = React.useState('');
    const [ imageLink, setImageLink ] = React.useState('');
    const [ published, setPublished ] = React.useState(null);

    const allCourseDetails = {
        id,
        title,
        description,
        price,
        imageLink,
        published
    }

    const [ titleEditSwitch, setTitleEditSwitch ] = React.useState(false);
    const [ descriptionEditSwitch, setDescriptionEditSwitch ] = React.useState(false);
    const [ priceEditSwitch, setPriceEditSwitch ] = React.useState(false);
    const [ imageLinkEditSwitch, setImageLinkEditSwitch ] = React.useState(false);
    const [ publishedEditSwitch, setPublishedEditSwitch ] = React.useState(false);

    useEffect(() => {
        const config = {
            method: 'GET',
            url: `http://localhost:3000/admin/courses/${id}`,
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        }

        axios.request(config)
        .then(response => response.data)
        .then(responseData => {
            console.log('Data Fetch Successful!');

            setTitle(responseData.title);
            setDescription(responseData.description);
            setPrice(responseData.price);
            setImageLink(responseData.imageLink);
            setPublished(responseData.published);
        })
        .catch(err => console.log('Data Fetch Failed!'));

    }, [])

    return <div>
        <h2>Title : { titleEditSwitch ? 
                (<GeneralEditDetail content={title} allCourseDetails={allCourseDetails} authToken={jwtToken} setContent={setTitle} switch={setTitleEditSwitch}/>) : 
                    (<ShowDetail content={title} switch={setTitleEditSwitch}/>) }</h2>
        <h3>Description: { descriptionEditSwitch ? 
                (<GeneralEditDetail content={description} allCourseDetails={allCourseDetails} authToken={jwtToken} setContent={setDescription} switch={setDescriptionEditSwitch}/>) : 
                    (<ShowDetail content={description} switch={setDescriptionEditSwitch}/>) }</h3>
        <h3>Price: { priceEditSwitch ? 
                (<GeneralEditDetail content={price} allCourseDetails={allCourseDetails} authToken={jwtToken} setContent={setPrice} switch={setPriceEditSwitch}/>) : 
                    (<ShowDetail content={price} switch={setPriceEditSwitch}/>) }</h3>
        <h3>Image Link: { imageLinkEditSwitch ? 
                (<GeneralEditDetail content={imageLink} allCourseDetails={allCourseDetails} authToken={jwtToken} setContent={setImageLink} switch={setImageLinkEditSwitch}/>) : 
                    (<ShowDetail content={imageLink} switch={setImageLinkEditSwitch}/>) }</h3>
        <h3>Published: { publishedEditSwitch ?
                (<PublishedEditDetail content={published} allCourseDetails={allCourseDetails} authToken={jwtToken} setContent={setPublished} switch={setPublishedEditSwitch} />) :
                    (<ShowDetail content={ (published !== null) ? (published ? 'Yes' : 'No') : ''} switch={setPublishedEditSwitch}/>) }</h3>
        <a href="/courses">Show All Courses</a>
    </div>
}

function ShowDetail(props) {
    console.log('Inside ShowDetail');

    return <>
        {props.content} | | | <button onClick={() => {
            props.switch(true);
        }}>Edit</button>
    </>
}

function GeneralEditDetail(props) {
    console.log('Inside GeneralEditDetail');

    return <>
        <input type={'text'} value={props.content} onChange={e => props.setContent(e.target.value)} /> | | | <button onClick={() => {
            pushCourseDetailChanges(props.allCourseDetails, props.authToken );
            props.switch(false);
        }}>Finish Edit</button>
    </>
}

function PublishedEditDetail(props) {
    console.log('Inside PublishedEditDetail');

    return <>
        <input id='published-input' type={"checkbox"} checked={props.content} onChange={e => props.setContent(e.target.checked)} /> | | | <button onClick={() => {
            pushCourseDetailChanges(props.allCourseDetails, props.authToken);
            props.switch(false);
        }}>Finish Edit</button>
    </>
}

export default ShowCourseDetails;