import { useState, useEffect, useCallback } from 'react';
import Footer from './components/footer';
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Login from './components/login'
 const API_BASE_URL = "http://localhost:3000/api/posts"; // Adjust the URL based on your backend setup

export default function App() {
 
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  
  //track session token
  //checks local storage immediately to see if yu previously login
  const [token, setToken] = useState(localStorage.getItem('token') || "Bearer YOUR_COPIED_TOKEN_HERE");
//The setTimeout(..., 0) forces the browser to wait until React is completely finished rendering before it runs your API call.
const fetchPosts = useCallback(async () => {
  try {
    const response = await fetch(API_BASE_URL);
    const data = await response.json();
    setPosts(data);
  } catch (error) {
    console.error("error loading posts:", error);
  }
}, []);

useEffect(() => {
  // Only query your publications database if a valid token is active
  if (token) {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 0);

    return () => clearTimeout(timer);
  }
}, [token, fetchPosts]); // fetchPosts is safe here because it uses useCallback


//useEffect(() => {
  // Defers the execution by 0ms, breaking the synchronous link
 // const timer = setTimeout(() => {
 //   fetchPosts();
 // }, 0);

 // return () => clearTimeout(timer);
//}, [fetchPosts]); 


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

// SUCCES STEP
const handleLoginSucces = (receivedToken) => {
  //store it inside the state variable to unlock the dashboard layout view
  setToken(receivedToken);
  // Write it directly to your browser memory so you dont logout when refresh browser
  localStorage.setItem('token', receivedToken);
};
// EXIT STEP: clears out tracking variables instantly
const handleLogout = () => {
  setToken('');
  localStorage.removeItem('token');
  setPosts([]); // wipe visible dashboard data arrays for data sanitation
};

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
      // CONDITIONAL INTERCEPT ROUTE BLOCKER:
      // If token is missing, break standard dashboard loading pipeline and render login component
      if (!token){
        return <Login onLoginSuccess={handleLoginSucces} />;
      }

      return(
        <div className='min-h-screen bg-slate-950 text-slate-100 font-sans'>
          <Navbar />
          <main className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          {/* Header section */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
            <h2 className='text-2xl font-extrabold text-white'>Your Publications</h2>
            <p className='text-slate-400 text-sm'>Manage drafts, edit articles, and publish content</p>
          </div>
           
           {/* dashbord control buttons group */}
           <div className='flex gap-3'>
            <button
            onClick={handleLogout}
            className='bg-slate-600 border border-slate-500 hover:bg-slate-600 text-slate-300 font-medium px-4 py-2.5 rounded-lg transition-colors'>
                LogOut
            </button>

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