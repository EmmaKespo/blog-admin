// this component expects a function called 'onLoginSucces' from App.jsx 
// so it can pass the token backup once you sucessfully login
import { useState } from "react";

export default function Login({ onLoginSuccess }) {
    // to capture what is been type
    const  [email, setEmail] = useState("");
    const  [password, setPassword] = useState("");

    // track system status to display helper notes or block double-clicks
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // handles forms submission
    const handleSubmit = async (e) => {
        //stop browser not to do a full page refresh
        e.preventDefault();
        //clears every error  text from prev attempt
        setErrorMessage("")
        //lock button to avoid doble submit while waiting for server
        setIsLoading(true)
        try{
          const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          })
          const data = await response.json();
          // check server error
          if (!response.ok){
            throw new Error(data.error || 'login failed check your credentials.');
          }
          // if success pass the 'Bearer eyj......' token back to App.jsx
          onLoginSuccess(data.token);
        }  
          // catch error and display them in a red text container
        catch (error) {
        setErrorMessage(error.message)
    } 
    // re-enable the submit button regardless of success or failure
    finally {
        setIsLoading(false);
    }
} ;
  return(
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center">

{/* container card */}
<div className="bg-slate-800 border border-slate-600 p-8 rounded-2xl w-full max-w-md shadow-2xl">

   {/* Header Branding Block */}
   <h2 className="text-4xl mb-2">Author Panel</h2>
   <p className="text-slate-400 text-sm mt-1"> Provide Credentials to manage publication</p>
</div>

{/* error container */}
{errorMessage && (
    <div className="bg-rose-900 border border-rose-500 text-rose-400 p-3 rounded-2xl text-sm mb-6 text-center">
</div>
)}
<form onSubmit={handleSubmit} className="space-y-5">
    {/* email required field */}
    <div>
   <label className="block text-sm font-medium text-slate-400 mb-1.5"  >Email Address</label>
    <input
    onChange={(e) => setEmail(e.target.value)}
    value={email}
    type='email'
    placeholder="author@myblog.com"
    className="w-full bg-slate-800 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-indigo-500 transition-colors"
    required
    disabled={isLoading}
    />

    </div>
     {/* pasword required field */}
     <div>
     <label className="block text-sm font-medium text-slate-400 mb-1.5"  >Author Password</label>
    <input
    onChange={(e) => setPassword(e.target.value)}
    value={password}
    type='password'
    placeholder="author@myblog.com"
    className="w-full bg-slate-800 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-indigo-500 transition-colors"
    required
    disabled={isLoading}
    />
    </div>
    
    <button
    type="submit"
    disabled={isLoading}
    className="w-full bg-indigo-400 hover:bg-indigo-200 disabled:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-700 mt-3"
    >
        {isLoading ? 'Authenticating....' : 'Admin sign in to dashboard' }
    </button>

</form>
 {/*helpfull full note reminders*/}
 <p className="text-xs text-slate-600 mt-6 text-center max-w-xs">
    This administration dashboard is restricted. unauthorized configuration access is monitored.
 </p>



    </div>
  )

    
   








}