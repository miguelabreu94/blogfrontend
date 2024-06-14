import React, { useState, useEffect } from "react";

const PostCard = ({ post }) => {

    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState(post.comments);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedRole = localStorage.getItem("role");

    
        if (storedUser) {
            const userObject = JSON.parse(storedUser);
            setUser(userObject);
            setIsAdmin(storedRole === "ADMIN");
            setUserId(userObject.id); // Assuming userObject has an id field
          }
    
        setLoading(false);
      }, []);

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const sortedComments = comments.slice().sort((a, b) => new Date(b.dateOfCreation) - new Date(a.dateOfCreation));

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

    const handleAddComment = async () => {
        if (newComment.trim() && user) {
            const token = localStorage.getItem("token");
            console.log("Adding comment as user: ", user.id); // Debugging statement

            try {
                const response = await fetch(`http://localhost:8080/comments/post/${post.id}/user/${user.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ content: newComment })
                });

                const newCommentObject = await response.json();
                setComments([newCommentObject, ...comments]);
                setNewComment("");
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            console.log("User is not defined or new comment is empty."); // Debugging statement
        }
    };

    const handleDeleteComment = async (commentId) => {
        const token = localStorage.getItem("token");

        try {
            await fetch(`http://localhost:8080/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <article className="lp-article" key={post.id}>
            <section className="lp-section-header">
                <h2>{post.title}</h2>
            </section>
            <img className="lp-img" src={post.imageName} alt={post.title} />
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <p>Created by: ({post.user.pessoa.fullName}) {post.user.username}</p>
            <section className="lp-section-bottom">
                <div className="lp-comments-wrapper">
                    <button className="lp-comments" onClick={toggleComments}>
                        <span>{comments.length}</span> Comentários
                    </button>
                    {showComments && (
                        <>
                            {user && (
                                <div>
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment"
                                    />
                                    <button onClick={handleAddComment} disabled={!user}>Add</button>
                                </div>
                            )}
                            <ul className="lp-comment-list">
                                {sortedComments.map((comment) => (
                                    <li key={comment.id}>
                                        <strong>{comment.user.pessoa.fullName} ({comment.user.username})</strong>: {comment.content}
                                        <br />
                                        <span>Created: {getTimeDifference(comment.dateOfCreation)}</span>
                                        {isAdmin || comment.user.id === userId && <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    <p className="lp-category">Categoria: {post.category.categoryTitle}</p>
                </div>
            </section>
        </article>
    );
};

export default PostCard;

