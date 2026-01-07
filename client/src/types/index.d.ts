interface ISignUpFormValues {
    name: string;
    email: string;
    password: string;
}

interface ISignUpResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

interface ILoginFormValues {
    email: string;
    password: string;
}

interface ILoginResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        email: string;
        name: string;
    },
    data: {
        token?: string;
    }
}