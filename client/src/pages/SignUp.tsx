import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../redux/endPoints/user';


const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters')
        .required('Name is required')
        .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain uppercase, lowercase, and numbers'
        )
        .required('Password is required'),
});

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [registerUser, { isLoading, error }] = useRegisterUserMutation();

    const formik = useFormik<ISignUpFormValues>({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await registerUser(values).unwrap() as ISignUpResponse;
                if (response.success) {
                    // Store token if needed
                    if (response.token) {
                        localStorage.setItem('authToken', response.token);
                    }
                    navigate('/');
                }
            } catch (err) {
                console.error('Registration failed:', err);
            }
        },
    });

    const getFieldError = (fieldName: keyof ISignUpFormValues): string | undefined => {
        return formik.touched[fieldName] && formik.errors[fieldName]
            ? formik.errors[fieldName]
            : undefined;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-gray-600 text-sm mt-2">Join us and enjoy delicious food</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                        {typeof error === 'object' && 'data' in error
                            ? (error.data as any)?.message || 'Registration failed. Please try again.'
                            : 'Registration failed. Please try again.'}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            {...formik.getFieldProps('name')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${getFieldError('name')
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {getFieldError('name') && (
                            <p className="text-red-500 text-sm mt-1">{getFieldError('name')}</p>
                        )}
                    </div>

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
                        {/* Password Requirements */}
                        <div className="mt-2 text-xs text-gray-600 space-y-1">
                            <p>Password must contain:</p>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`w-2 h-2 rounded-full ${/[a-z]/.test(formik.values.password) ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                ></span>
                                <span>Lowercase letters</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formik.values.password) ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                ></span>
                                <span>Uppercase letters</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`w-2 h-2 rounded-full ${/\d/.test(formik.values.password) ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                ></span>
                                <span>Numbers</span>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 w-4 h-4 accent-orange-600 cursor-pointer"
                            required
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600">
                            I agree to the{' '}
                            <Link to="/terms" className="text-orange-600 hover:text-orange-700 font-medium">
                                Terms & Conditions
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !formik.isValid}
                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Sign In Link */}
                <p className="text-center text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-orange-600 hover:text-orange-700 font-semibold">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;