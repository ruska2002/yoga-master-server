import React,{ useState } from 'react';
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { Link } from 'react-router'
import { useNavigate } from 'react-router-dom'; 
import api from '../lib/axios'
import { useAuth } from '../context/AuthContext'  

export default function Login() {
  const { login } = useAuth();  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/login', { email, password });

      login(response.data);  

      setError('');
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  return (
 <div className="flex flex-col min-h-screen">
  <NavBar />

  <main className="flex flex-col justify-center items-center flex-1 px-4">
     <h1 className="md:text-3xl text-[18px] font-bold mb-6 text-center text-[#712941]">
        Get Started Today
      </h1>
    <form onSubmit={handleSubmit}>
      <div className="md:w-[350px] shadow-xl p-6 rounded-lg w-[260px]">

      <div className="flex flex-col gap-4">
        <p className="md:text-lg text-[16px] font-medium text-center text-[#712941]">Sign In</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-[#c86989] placeholder-[#c86989] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#712941] text-[#c86989]"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="border border-[#c86989] placeholder-[#c86989] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#712941] text-[#c86989]"
        />
        {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
        <button className="bg-[#712941] text-white py-2 rounded-md hover:bg-[#c86989] transition text-[16px] md:text-lg">
          Sign In
        </button>

      </div>
     <div className='flex justify-center gap-1 mt-2'>
       <p className='text-[#712941]'>No account?</p>
       <Link to="/register"><button className='text-[#712941] font-bold hover:text-[#c86989]'>Sign Up</button></Link>
     </div>

    </div>
    </form>
  </main>

  <Footer />
</div>
  )
}