import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Placeholder Components
const Layout = ({ children }) => (
  <div className="app-layout">
    <header className="app-header container flex justify-between items-center">
      <h1 className="text-xl" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PriceDrop</h1>
      <nav className="flex gap-md">
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/login" className="btn btn-secondary">Login</a>
      </nav>
    </header>
    <main className="container mt-lg">
      {children}
    </main>
  </div>
);

const Home = () => (
  <div className="text-center flex flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Never Miss a Price Drop</h1>
    <p className="text-secondary" style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '2rem' }}>
      Track prices from your favorite stores and get notified instantly when they drop. Smart, fast, and free.
    </p>
    <div className="flex gap-md">
      <a href="/signup" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>Get Started Free</a>
      <a href="#features" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>Learn More</a>
    </div>
  </div>
);

const Dashboard = () => (
  <div>
    <h2 className="text-xl">Your Dashboard</h2>
    <div className="card mt-lg">
      <p className="text-secondary">You are not tracking any products yet.</p>
      <button className="btn btn-primary mt-lg">Add First Product</button>
    </div>
  </div>
);

const Login = () => (
  <div className="flex justify-center items-center" style={{ minHeight: '50vh' }}>
    <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
      <h2 className="text-center text-xl" style={{ marginBottom: '1.5rem' }}>Welcome Back</h2>
      <form className="flex flex-col gap-md">
        <input type="email" placeholder="Email" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        <input type="password" placeholder="Password" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} /> {/* Reusing Login for now */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
