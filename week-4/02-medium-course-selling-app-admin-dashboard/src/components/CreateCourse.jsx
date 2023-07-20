import axios from "axios";
import React from "react";

function backendCallToCreateCourse(title, description, price, imageLink, published, setIsCourseCreated) {
    console.log('Inside backendCallToCreateCourse');

    const jwtToken = sessionStorage.getItem('admin-session-key');

    const requestConfig = {
        method: 'POST',
        url: 'http://localhost:3000/admin/courses',
        headers: {
            'Authorization': 'Bearer ' + jwtToken,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            title,
            description,
            price,
            imageLink,
            published
        })
    }

    axios.request(requestConfig)
    .then(response => response.data)
    .then(responseData => {
        console.log(responseData);
        setIsCourseCreated(true);
    })
    .catch(err => setIsCourseCreated(false));
}

function clearInput(setTitle, setDescription, setPrice, setImageLink, setPublished) {
    console.log('Inside clearInput');

    setTitle('');
    setDescription('');
    setPrice('');
    setImageLink('');
    setPublished(false);
}

function CreateCourse() {
    console.log('Inside CreateCourse');

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [imageLink, setImageLink] = React.useState("");
    const [published, setPublished] = React.useState(false);

    const [isCourseCreated, setIsCourseCreated] = React.useState(null);

    console.log(published);

    return <div>
        <h1>Create Course Page</h1>
        <div>
            Title - <input id='title-input' type={"text"} value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
            Description - <input id='description-input' type={"text"} value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
            Price - <input id='price-input' type={"number"} value={price} onChange={e => setPrice(e.target.value)} />
        </div>
        <div>
            Image Link - <input id='image-link-input' type={"text"} value={imageLink} onChange={e => setImageLink(e.target.value)} />
        </div>
        <div>
            published - <input id='published-input' type={"checkbox"} checked={published} onChange={e => setPublished(e.target.checked)} />
        </div>
        <div>
            <button onClick={() => {
                backendCallToCreateCourse(title, description, price, imageLink, published, setIsCourseCreated);
                clearInput(setTitle, setDescription, setPrice, setImageLink, setPublished);
            }}>Create Course</button>
        </div>
        <div>
            {isCourseCreated && (
                <>
                    Course Created Successfully!! 
                    <a href="/courses">Go to Courses</a>
                </>
            )}
            { (isCourseCreated !== null) && !isCourseCreated && (
                <>
                    Internal Error!! Failed to create Course!
                </>
            )}
        </div>
    </div>
}
export default CreateCourse;