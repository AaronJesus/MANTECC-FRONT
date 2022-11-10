import { Navigate, Routes, Route } from 'react-router-dom';
import { Login } from '../components/Login';
import { Inicio } from '../Inicio';
import { DashboardRoutes } from './DashboardRoutes';
import { ProtectedRoutes } from './ProtectedRoutes';

export const AppRouter = () => {
	return (
		<>
			<Routes>
				<Route path='/' element={<Inicio />} />
				<Route path='/login' element={<Login />} />
				<Route element={<ProtectedRoutes />}>
					<Route path='/*' element={<DashboardRoutes />} />
					<Route path='/login' element={<Navigate to='/' />} />
				</Route>
			</Routes>
		</>
	);
};
