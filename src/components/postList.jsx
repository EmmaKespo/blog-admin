import React from "react";
export default function postList({ posts, onTogglePublish, onEdit, onDelete }) {
    if (!posts || posts.length === 0) {
        return <p className="text-gray-500">No posts available. Create your first post!</p>;
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <div key={post.id} className="border border-gray-300 rounded-md p-4">
                    <h3 className="text-lg font-bold">{post.title}</h3>
                    <p className="text-gray-600">{post.content}</p>
                    <div className="flex justify-end space-x-2 mt-4">
                        <span className={`px-2 py-1 rounded text-sm ${post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {post.published ? "Published" : "Draft"}
                        </span>
                        <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-800">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span> </div>
                        {/* dashboard control action */}
                        <div className="flex justify-end space-x-2 mt-4">
                        <button
                            onClick={() => onTogglePublish(post.id, !post.published)}
                            className={"px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
                            + (post.published ? " bg-yellow-500 text-white hover:bg-yellow-600" : " bg-green-500 text-white hover:bg-green-600")}>
                            {post.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                            onClick={() => onEdit(post)}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(post)}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}