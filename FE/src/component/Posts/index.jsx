import api from "../../config/axios";
import React, { useState, useEffect } from "react";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [status, setStatus] = useState('Processing');

    useEffect(() => {
        const fetchProcessingPosts = async () => {
            try {
                // Fetch posts with the 'Processing' status
                const response = await api.get(`Admin/getAdvByStatus/${status}`);
                setPosts(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProcessingPosts();
    }, [status]);

    // Function to approve a post and call the PUT API to update the status to "Approved"
    const approvePost = async (id) => {
        try {
            console.log(`Approving post with ID: ${id}`);

            // Ensure the correct data format and endpoint URL
            const response = await api.put(`Admin/approveAdv/${id}?status=Approved`);
            console.log("Response from server:", response.data);

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === id ? { ...post, status: "Approved" } : post
                )
            );
        } catch (error) {
            console.error("Error approving the post:", error);
            console.error("Response error:", error.response);  // Log the server response
        }
    };

    // Function to reject a post and call the PUT API to update the status to "Rejected"
    const rejectPost = async (id) => {
        try {
            console.log(`Rejecting post with ID: ${id}`);

            // Ensure the correct data format and endpoint URL
            const response = await api.put(`Admin/approveAdv/${id}?status=Rejected`);
            console.log("Response from server:", response.data);

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === id ? { ...post, status: "Rejected" } : post
                )
            );
        } catch (error) {
            console.error("Error rejecting the post:", error);
            console.error("Response error:", error.response);  // Log the server response
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold mb-4">Posts Management</h1>

            {posts.map((post) => (
                <div key={post.id} className="p-4 border mb-4 rounded shadow-md">
                    <h2 className="text-lg font-bold">{post.title}</h2>
                    <p className="text-gray-700">{post.advDate}</p>
                    <div className="mt-2">
                        <span
                            className={`text-sm font-bold mr-4 ${post.status === "Processing"
                                ? "text-yellow-600"
                                : post.status === "Approved"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                        >
                            Status: {post.status}
                        </span>

                        {post.status === "Processing" && (
                            <div className="mt-2">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                    onClick={() => approvePost(post.id)}
                                >
                                    Approve
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() => rejectPost(post.id)}
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {posts.length === 0 && (
                <p className="text-gray-500">No posts to display.</p>
            )}
        </div>
    );
};

export default Posts;
