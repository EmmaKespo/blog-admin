import { useState } from "react";

// COMPONENT TO LAZY-LOAD POST-SPECIFIC COMMENTS PANEL FOR YOUR SAFETY
export default function AdminCommentDropdown({ postId }) {
    const [comments, setComments] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const toggleComments = async () => {
        // Toggle the open/closed view first
        setIsOpen(!isOpen);

        // Only fetch data if we are opening it and don't have comments yet
        if (!isOpen && comments.length === 0) {
            try {
                const res = await fetch(`http://localhost:3000/api/posts/${postId}/comments`);
                const data = await res.json();
                setComments(data);
            } catch (error) {
                console.error("Error loading comments:", error);
            }
        }
    }; // <--- CLOSING THE FUNCTION HERE FIXES THE ERROR!

    // The return statement must belong to the component, not the function
    return (
        <div className="mt-4 pt-3 border border-slate-700">
            <button
                onClick={toggleComments}
                className="px-4 py-2 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 flex items-center gap-1 bg-slate-100 hover:bg-slate-200"
            >
                {isOpen ? "Hide Comments" : "Show Comments"}
            </button>
            
            {isOpen && (
                <div className="mt-3 space-y-2 bg-slate-900 p-3 rounded-lg border border-slate-600">
                    {comments.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No comments recorded on this post.</p>
                    ) : (
                        <div className="mt-2">
                            <h4 className="text-md font-semibold text-white">Comments</h4>
                            <ul className="list-disc pl-5">
                                {comments.map((comment) => (
                                    <li key={comment.id} className="text-sm text-gray-300">
                                        {comment.content}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
