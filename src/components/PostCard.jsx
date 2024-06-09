import React, { useState } from "react";

const PostCard = ({ post }) => {

    const [showComments, setShowComments] = useState(false);

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const sortedComments = post.comments.slice().sort((a, b) => new Date(b.dateOfCreation) - new Date(a.dateOfCreation));


    const getTimeDifference = (commentDate) => {
        const currentDate = new Date();
        const creationDate = new Date(commentDate);
        const difference = Math.abs(currentDate - creationDate);
        const minutes = Math.floor(difference / (1000 * 60));
        const hours = Math.floor(minutes / 60);
    
        if (minutes < 60) {
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else {
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        }
    };

    const deleteComment = (commentId) => {


        console.log("Deleting comment with ID ${commentId}");

    };


    return (
        <article className="lp-article" key={post.id}>
            <section className="lp-section-header">
                <h2>{post.title}</h2>
            </section> 
            <img className="lp-img" src={post.imageName} alt={post.title} />
            <p>{post.content}</p>
            <section className="lp-section-bottom">
                <div className="lp-comments-wrapper">
                    <button className="lp-comments" onClick={toggleComments}> 
                    <span>{post.comments.length}</span> Comentários 
                    </button>
                    {showComments && (
                        <ul className="lp-comment-list">
                            {sortedComments.map((comment,index)=> (
                                <li key={index}>
                                <strong> {comment.user.pessoa.fullName} ({comment.user.username})</strong>: {comment.content}
                                <br/>
                                <span>Created: {getTimeDifference(comment.dateOfCreation)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <p className="lp-category">Categoria: {post.category.categoryTitle}</p>
                </div>
            </section> 
        </article>
    );
}

export default PostCard;
