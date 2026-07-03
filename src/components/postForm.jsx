import { useState } from "react";

export default function PostForm({ isOpen, onClose, onSave, postToEdit }) {
 // const [title, setTitle] = useState("");
 // const [content, setContent] = useState("");
const [title, setTitle] = useState(postToEdit ? postToEdit.title : "");
const [content, setContent] = useState(postToEdit ? postToEdit.content : "");

// 1. Return early if not open (move this to the very top)
if (!isOpen) return null;
  // Update form fields when postToEdit changes
  //useEffect(() => {
    //if (postToEdit) {
     // setTitle(postToEdit.title);
     // setContent(postToEdit.content);
    //} else {
     // setTitle("");
    //  setContent("");
    //}
  //}, [postToEdit, isOpen]);
 // if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }
    // pass the title and content back to the parent component
    onSave({ title, content });
    onClose();
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4"> {postToEdit ? "Edit blog post" : "Write new post"} </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
            placeholder="Enter the title of your post"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
         
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}