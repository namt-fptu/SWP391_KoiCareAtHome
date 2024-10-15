import { useState } from "react";

// Dummy data for posts
const initialPosts = [
    { id: 1, title: "Post 1", content: "This is the content of post 1", status: "pending" },
    { id: 2, title: "Post 2", content: "This is the content of post 2", status: "pending" },
    { id: 3, title: "Post 3", content: "This is the content of post 3", status: "pending" },
];

const Posts = () => {
    const [posts, setPosts] = useState(initialPosts);

    // Function to approve a post
    const approvePost = (id) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === id ? { ...post, status: "approved" } : post
            )
        );
    };

    // Function to reject a post
    const rejectPost = (id) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === id ? { ...post, status: "rejected" } : post
            )
        );
    };

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold mb-4">Posts Management</h1>

            {posts.map((post) => (
                <div key={post.id} className="p-4 border mb-4 rounded shadow-md">
                    <h2 className="text-lg font-bold">{post.title}</h2>
                    <p className="text-gray-700">{post.content}</p>
                    <div className="mt-2">
                        <span
                            className={`text-sm font-bold mr-4 ${post.status === "pending"
                                    ? "text-yellow-600"
                                    : post.status === "approved"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                        >
                            Status: {post.status}
                        </span>

                        {post.status === "pending" && (
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
