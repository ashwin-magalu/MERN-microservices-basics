import axios from 'axios'
import React, { useState } from 'react'

const CommentCreate = ({ postId }) => {
    const [comment, setComment] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault()

        await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
            content: comment
        })

        setComment("")
    }


    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>New Comment</label>
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-secondary mt-1">Comment</button>
            </form>
        </div>
    )
}

export default CommentCreate
