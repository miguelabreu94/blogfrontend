import React, { useState, useEffect } from "react";
import "../css/PostCard.css"

const PostCard = ({ post, onDeletePost }) => {

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

    const sortedComments = comments.slice().sort((a, b) => new Date(a.dateOfCreation) - new Date(b.dateOfCreation));

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

    const handleDeletePost = async () => {
        const token = localStorage.getItem("token");
    
        try {
          await fetch(`http://localhost:8080/posts/${post.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          onDeletePost(post.id)
        } catch (error) {
          console.error("Error:", error);
        }
      };

      const formattedDate = new Date(post.dateOfCreation).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      });

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <article className="lp-article" key={post.id}>
            <section className="lp-section-header">
                <h2>{post.title}</h2>
            </section>
            <img className="lp-img" src={post.imageName} alt={post.title} />
            <div className="lp-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            <p className="lp-created-by" >Criado por: ({post.user.pessoa.fullName}) {post.user.username}</p>
            <p style={{ color: "black", fontSize: "14px" }}>Data de criação: {formattedDate}</p>
            <section className="lp-section-bottom">
                <div className="lp-comments-wrapper">
                    <button className="lp-comments" onClick={toggleComments}>
                        <span>{comments.length}</span> Comentários
                    </button>
                    {isAdmin && (
                        <button className="lp-delete-post-btn" onClick={handleDeletePost}>Apagar Post</button>
                    )}
                    {showComments && (
                        <>
                            {user && (
                                <div className="lp-add-comment">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment"
                                    />
                                    <button className="lp-add-comment-btn" onClick={handleAddComment} disabled={!user}>Add</button>
                                </div>
                            )}
                            <ul className="lp-comment-list">
                                {sortedComments.map((comment) => (
                                    <li key={comment.id} className="lp-comment-item">
                                        <strong>{comment.user.pessoa.fullName} ({comment.user.username})</strong>: {comment.content}
                                        <br />
                                        <span className="lp-comment-created">Created: {getTimeDifference(comment.dateOfCreation)}</span>
                                        {(isAdmin || comment.user.id === userId) && (
                                            <button className="lp-delete-comment-btn" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    <div className="lp-categories">
                        <p className="lp-categories-label">Categorias:</p>
                        <ul className="lp-category-list">
                            {post.categories.map((category) => (
                                <li key={category} className="lp-category-item">{category}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </article>
    );
};

export default PostCard;

