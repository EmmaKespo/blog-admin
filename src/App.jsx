import { useState, useEffect } from 'react';
import Footer from './components/footer';
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
 const API_BASE_URL = "http://localhost:3000/api/posts"; // Adjust the URL based on your backend setup

export default function App() {
 
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  //const [token, setToken] = useState("Bearer YOUR_TOKEN_HERE");
  const token = localStorage.getItem('token') || "Bearer YOUR_COPIED_TOKEN_HERE";
  //const savedToken = localStorage.getItem('token');
   // if (savedToken) setToken('Bearer ${savedToken}');

// ... inside your component:

useEffect(() => {
  // 1. Create a controller instance
  const controller = new AbortController();
  const signal = controller.signal;

  const fetchPosts = async () => {
    try {
      // 2. Pass the signal to the fetch call
      const response = await fetch(API_BASE_URL, { signal });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      // 3. Ignore errors caused by intentional cancellation
      if (error.name !== 'AbortError') {
        console.error("error loading posts:", error);
      }
    }
  };

  fetchPosts();

  // 4. Return the cleanup function to abort on unmount
  return () => {
    controller.abort();
  };
}, []); // Empty array ensures it only setups on mount


  //const fetchPosts = async () => {
   // try {
   //   const response = await fetch(API_BASE_URL);
   //   const data = await response.json();
   //   setPosts(data);
   // } catch (error) {
   //   console.error("error loading posts:", error);
  //  }
 // }; 
 // useEffect (() => {
  //  fetchPosts()
//  }, []);

// CREATE or UPDATE POST LOGIC
const handlesSavePost = async (formData) => {
  try {
    if (currentPost) {
      // UPDATE Existing post
      const res = await fetch('${API_BASE_URL}/${currentPost.id}', {
        method: 'PUT',
        headers: {
           'Content-type': 'application/json',
           'Authorization': token
        },
        body: JSON.stringify(formData)
      });
      if (res.ok)  fetchPosts();
    } else {
      // CREATE new post
      const res = await fetch(API_BASE_URL,{
        method: 'POST',
        headers: {
           'Content-type': 'application/json',
           'Authorization': token
        },
        body: JSON.stringify({ ...formData, authorId: 'YOUR_MASTER_AUTHOR_ID' })
      });
      if (res.ok) fetchPosts();
    }
  } catch (error) {
    console.error("Error saving post:",  error);
  }
  setCurrentPost(null)
};

// TOGGLE PUBLISH / UNPUBLISH LOGIC
const handleTogglePublish = async (id, targetStatus) => {
  try{
    const res = await fetch('${API_BASE_URL}/${id}/publish', {
      method: 'PATCH',
        headers: {
           'Content-type': 'application/json',
           'Authorization': token
        },
        body: JSON.stringify({ published: targetStatus })
      });
      if (res.ok) fetchPosts();
    } catch (error) {
       console.error("Error saving post:",  error);
  }
    }
  
  // DELETE POST LOGIC 
  const handleDelete = async () => {
    if (!window.comfirm("Are you sure you want to completely erase this post emma")) return;
    try {
      const res = await fetch('${API_BASE_URL}/${id}', {
          method: 'DELETE',
        headers: {
           'Authorization': 'token'
        },
      });
      if (res.ok) fetchPosts();
    } catch (error) {
       console.error("Error deleting post:",  error);
  }
      }

      return(
        <div className='min-h-screen bg-slate-950 text-slate-100 font-sans'>
          <Navbar />
          <main className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          {/* Header section */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
            <div>
            <h2 className='text-2xl font-extrabold text-white'>Your Publications</h2>
            <p className='text-slate-400 text-sm'>Manage drafts, edit articles, and publish content</p>
          </div>
          <button 
          onClick={() => { setCurrentPost(null); setIsModalOpen(true);  }  }
          className='bg-indigo-600 hover:bg-indigo-800 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-600'>
            Create New Post
          </button>
         </div>
         {/* cContent Board */}
         <PostList
          posts={posts}
          onTogglePublish={handleTogglePublish}
          onEdit={(post) => { setCurrentPost(post); setIsModalOpen(true); }}
          onDelete={handleDelete}
          />
          </main>
          {/* Pop-up Overlay Validation Form*/}
          <PostForm 
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setCurrentPost(null); }}
          onSave={handlesSavePost}
          postToEdit={currentPost}
          />

  <Footer />

        </div>
      )
};