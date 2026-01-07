import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/login';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        setError('');
        try {
            await registerUser(formData);
            navigate('/login');
        } catch (err: any) {
            if (err.response && err.response.data) {
                setError(JSON.stringify(err.response.data));
            } else {
                setError('Registration failed. Please try again.');
            }
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 card p-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-text">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="input-field text-slate-900"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="input-field text-slate-900"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label htmlFor="first_name" className="sr-only">First Name</label>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    required
                                    className="input-field text-slate-900"
                                    placeholder="First Name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="last_name" className="sr-only">Last Name</label>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    required
                                    className="input-field text-slate-900"
                                    placeholder="Last Name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
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
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="input-field text-slate-900"
                                placeholder="Confirm_Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center break-words">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="btn-primary w-full"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-accent hover:text-accent/80">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
