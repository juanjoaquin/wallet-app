import axios, {AxiosError} from "axios";

interface UserData {
    id: number;
    email: string;
}

const authService = async (): Promise<UserData | null> => {
    const token = localStorage.getItem('tokenStorage');

    if(!token) {
        return null;
    }

    try {
        const response = await axios.get<UserData>(import.meta.env.VITE_ME, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch(error) {
        if (error instanceof AxiosError) {
            console.error("Auth service error:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error:", error);
        }
        localStorage.removeItem('tokenStorage'); 
        return null;
    }

}

export { authService };