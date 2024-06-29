import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import "../css/FavoritePosts.css";

const FavoritePostsPage = ({ user }) => {
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortByFavorites, setSortByFavorites] = useState(false); // State to toggle between sorting by date or by favorites

    useEffect(() => {
        const fetchFavoritePosts = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                let endpoint = sortByFavorites ? `/mostfav` : ""; // Adjust endpoint based on sortByFavorites state
                const response = await fetch(`http://localhost:8080/favorites/user/${user.id}${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    // Sort data if sortByFavorites is true
                    if (sortByFavorites) {
                        data.sort((a, b) => b.favoriteCount - a.favoriteCount);
                    }
                    setFavoritePosts(data);
                } else {
                    console.error("Failed to fetch favorite posts");
                }
            } catch (error) {
                console.error("Error fetching favorite posts:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchFavoritePosts();
        }
    }, [user, sortByFavorites]); // Include sortByFavorites as a dependency

    const handleSortChange = () => {
        setSortByFavorites(!sortByFavorites); // Toggle sortByFavorites state
    };

    if (loading) {
        return <div>Loading favorite posts...</div>;
    }

    return (
        <div className="favorite-posts-container">
            <h2 className='favorite-post-title'>YOUR FAVORITE POSTS</h2>
            <div className="sort-option">
                <label>
                    <input
                        type="checkbox"
                        checked={sortByFavorites}
                        onChange={handleSortChange}
                    />
                    Sort by Nº of Favorites
                </label>
            </div>
            {favoritePosts.length === 0 ? (
                <p>No favorite posts found.</p>
            ) : (
                <div className="favorite-posts-list">
                    {favoritePosts.map((post) => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritePostsPage;


