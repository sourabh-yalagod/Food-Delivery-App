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
        accessToken?: string;
    }
}

interface INavLink {
    label: string;
    href: string;
    icon: React.ReactNode;
}

interface IUserMenuOption {
    label: string;
    href: string;
    icon: React.ReactNode;
}
interface IFoodItem {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    rating: number;
    votes: number;
    cartItemId: string | null;
    veg: boolean;
}

interface IMenusResponse {
    success: boolean;
    data: IFoodItem[];
    message?: string;
}
interface IRestaurant {
    id: string;
    name: string;
    location: string;
    rating: number;
    image: string;
    cost: string;
    distance: number | null;
    duration: number | null;
    description: string | null;
}

interface IRestaurantsResponse {
    success: boolean;
    data: IRestaurant[];
    message?: string;
}

interface CartItem {
    id: string;
    cartItemId: string;
    name: string;
    price: string;
    image: string;
    description: string;
    rating: number;
    votes: number;
    veg: boolean;
    quantity?: number;
}