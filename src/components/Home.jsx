import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-green-900 via-black to-green-900 text-white flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-20">
      {/* Left: Text Content */}
      <div className="md:w-1/2 space-y-6 text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Crack Interviews Confidently with <br />
          <span className="text-lime-400">AI-Powered Practice</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300">
          Prepare for technical interviews with smart feedback, real-time voice input, and detailed suggestions.
        </p>
        <Link
          to="/practice"
          className="inline-block bg-lime-400 text-black font-semibold px-6 py-3 rounded-md shadow-md hover:bg-lime-300 transition"
        >
          Start Practicing
        </Link>
      </div>

      {/* Right: Image */}
      <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
        <img
          alt="Interview Illustration"
          className="w-72 sm:w-96 md:w-[400px] rounded-xl"
        />
      </div>
    </section>
  );
};

export default Home;
