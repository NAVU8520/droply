import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { login, register, getProducts, addProduct, deleteProduct } from './api';
import './App.css';

// Placeholder Components
const Layout = ({ children, user, onLogout }) => (
  <div className="app-layout">
    <header className="app-header container flex justify-between items-center">
      <h1 className="text-xl" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PriceDrop</h1>
      <nav className="flex gap-md items-center">
        <a href="/">Home</a>
        {user ? (
          <>
            <a href="/dashboard">Dashboard</a>
            <span className="text-secondary">Hi, {user.name}</span>
            <button onClick={onLogout} className="btn btn-secondary">Logout</button>
          </>
        ) : (
          <a href="/login" className="btn btn-secondary">Login</a>
        )}
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

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addProduct(newUrl);
      setNewUrl('');
      loadProducts();
    } catch (err) {
      setError('Failed to add product. Ensure URL is valid.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Stop tracking this product?')) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl">Your Dashboard</h2>
      </div>

      <div className="card mt-lg">
        <form onSubmit={handleAddProduct} className="flex gap-md">
          <input
            type="url"
            placeholder="Paste product URL here..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            required
            style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
          />
          <button disabled={loading} className="btn btn-primary">
            {loading ? 'Scanning...' : 'Track Price'}
          </button>
        </form>
        {error && <p style={{ color: 'var(--color-danger)', marginTop: '0.5rem' }}>{error}</p>}
      </div>

      <div className="mt-lg grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {products.map(product => (
          <div key={product.id} className="card flex flex-col gap-md">
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem' }} />}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{product.name}</h3>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
                  {product.currency === 'USD' ? '$' : product.currency} {product.currentPrice}
                </span>
                <button onClick={() => handleDelete(product.id)} className="text-secondary" style={{ background: 'none', border: 'none', fontSize: '0.875rem' }}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center mt-lg text-secondary">
          <p>You are not tracking any products yet.</p>
        </div>
      )}
    </div>
  );
};

const Login = ({ setUser }) => {
  const [isSignup, setIsSignup] = useState(window.location.pathname === '/signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let data;
      if (isSignup) {
        data = await register(email, password, name);
      } else {
        data = await login(email, password);
      }
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '50vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center text-xl" style={{ marginBottom: '1.5rem' }}>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          {isSignup && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
          />
          {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
          <button className="btn btn-primary">{isSignup ? 'Sign Up' : 'Login'}</button>
        </form>
        <p className="text-center mt-lg text-secondary" style={{ fontSize: '0.875rem' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"} <a href={isSignup ? '/login' : '/signup'} onClick={(e) => { e.preventDefault(); setIsSignup(!isSignup); window.history.pushState({}, '', isSignup ? '/login' : '/signup'); }}>{isSignup ? 'Login' : 'Sign Up'}</a>
        </p>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Login setUser={setUser} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
