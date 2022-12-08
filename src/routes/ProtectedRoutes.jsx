import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
	const user = sessionStorage.getItem('token');
	return user && !!user;
};

export const ProtectedRoutes = () => {
	const isAuth = useAuth();
	return isAuth ? <Outlet /> : <Navigate to='/login' />;
};
