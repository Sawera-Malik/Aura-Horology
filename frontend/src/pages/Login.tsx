import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/login';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await loginUser(username, password);
            await login(response.access, response.refresh);
            navigate('/');
        } catch (err: any) {
            setError('Invalid username or password');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 card p-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-text">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px ">
                        <div className="mb-4">
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                required
                                className="input-field text-slate-900"
                                placeholder="Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="input-field text-slate-900"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="btn-primary w-full"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-text/70">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-accent hover:text-accent/80">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
