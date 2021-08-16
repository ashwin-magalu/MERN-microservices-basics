import axios from 'axios'
import React, { useState } from 'react'

const CommentCreate = ({ postId }) => {
    const [content, setContent] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault()

        /* await axios.post(`http://localhost:4001/posts/${postId}/comments`, { */
        await axios.post(`http://posts.com/posts/${postId}/comments`, {
            content
        })

        setContent("")
    }


    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>New Comment</label>
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-secondary mt-1">Comment</button>
            </form>
        </div>
    )
}

export default CommentCreate
