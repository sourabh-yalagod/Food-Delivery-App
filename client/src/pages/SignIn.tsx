import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../redux/endPoints/user';


const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const [loginUser, { isLoading, error }] = useLoginUserMutation();

    const formik = useFormik<ILoginFormValues>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await loginUser(values).unwrap() as ILoginResponse;
                if (response.success) {
                    // Store token if needed
                    if (response.token) {
                        localStorage.setItem('authToken', response.token);
                    }
                    navigate('/');
                }
            } catch (err) {
                console.error('Login failed:', err);
            }
        },
    });

    const getFieldError = (fieldName: keyof ILoginFormValues): string | undefined => {
        return formik.touched[fieldName] && formik.errors[fieldName]
            ? formik.errors[fieldName]
            : undefined;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-600 text-sm mt-2">Sign in to your account to continue</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                        {typeof error === 'object' && 'data' in error
                            ? (error.data as any)?.message || 'Login failed. Please try again.'
                            : 'Login failed. Please try again.'}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...formik.getFieldProps('email')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${getFieldError('email')
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {getFieldError('email') && (
                            <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...formik.getFieldProps('password')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${getFieldError('password')
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {getFieldError('password') && (
                            <p className="text-red-500 text-sm mt-1">{getFieldError('password')}</p>
                        )}
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex justify-end">
                        <a href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                            Forgot Password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !formik.isValid}
                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-orange-600 hover:text-orange-700 font-semibold">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;