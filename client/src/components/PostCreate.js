import React, { useState } from 'react'
import axios from 'axios'

const PostCreate = () => {
    const [title, setTitle] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        /* await axios.post("http://localhost:4000/posts", { */
        await axios.post("http://posts.com/posts/create", {
            title
        })

        setTitle("")
    }


    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary mt-2">Submit</button>
            </form>
        </div>
    )
}

export default PostCreate
