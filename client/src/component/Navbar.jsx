import React,{useState} from 'react'
import { useNavigate ,useLocation } from 'react-router-dom';


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); 
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  
  const handleLogout = () => {
   
    localStorage.removeItem('token');
    
    navigate('/auth'); 
  };

  return (
    <nav className="relative z-50 flex items-center border mx-4 backdrop-blur-md bg-black max-md:w-full max-md:justify-between border-slate-700 px-6 py-4 rounded-full text-white text-sm relative">

      {/* Logo */}
      <a href="#">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="4.706" cy="16" r="4.706" fill="#D9D9D9" />
          <circle cx="16.001" cy="4.706" r="4.706" fill="#D9D9D9" />
          <circle cx="16.001" cy="27.294" r="4.706" fill="#D9D9D9" />
          <circle cx="27.294" cy="16" r="4.706" fill="#D9D9D9" />
        </svg>
      </a>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 ml-7">
        {["Home", "About", "Contact"].map((item) => (
            <a key={item} href="#" className="relative overflow-hidden h-6 group">
            
            <span className="block transition-transform duration-300 group-hover:-translate-y-6">
                {item}
            </span>

            <span className="absolute left-0 top-6 transition-transform duration-300 group-hover:-translate-y-6">
                {item}
            </span>

            </a>
        ))}
        </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center gap-6 ml-auto">
        {isAuthenticated && (
        <button onClick={handleLogout} className="bg-white hover:shadow-[0px_0px_30px_14px] shadow-[0px_0px_30px_7px] hover:shadow-white/50 shadow-white/50 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-100 transition duration-300">
          LogOut
        </button>)}
        <button className="bg-white hover:shadow-[0px_0px_30px_14px] shadow-[0px_0px_30px_7px] hover:shadow-white/50 shadow-white/50 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-100 transition duration-300">
          Get Started
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-gray-600"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-48 left-0 bg-black w-full flex-col items-center gap-4 text-base ${
          menuOpen ? "flex" : "hidden"
        }`}
      >
        <a className="hover:text-indigo-600" href="#">Home</a>
        <a className="hover:text-indigo-600" href="#">About</a>
        <a className="hover:text-indigo-600" href="#">Contact</a>

        


        {isAuthenticated && (
        <button onClick={handleLogout} className="bg-white hover:shadow-[0px_0px_30px_14px] shadow-[0px_0px_30px_7px] hover:shadow-white/50 shadow-white/50 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-100 transition duration-300">
          LogOut
        </button>)}

        <button className="bg-white hover:shadow-[0px_0px_30px_14px] shadow-[0px_0px_30px_7px] hover:shadow-white/50 shadow-white/50 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-100 transition duration-300">
          Get Started
        </button>
      </div>

    </nav>
  );
}

export default Navbar
