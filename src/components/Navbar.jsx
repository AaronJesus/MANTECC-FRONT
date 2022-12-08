import { useNavigate, NavLink } from 'react-router-dom';
import './styles/NavbarStyles.css';
import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
import { useState } from 'react';

export const Navbar = () => {
	const nav = useNavigate();
	const [role, setRole] = useState();
	const [nombres, setNombres] = useState();
	const token = sessionStorage.getItem('token');

	const handleId = () => {
		if (!!token) {
			const user = jwtDecode(token);

			if (!!user) {
				setNombres(user.Nombres);
				setRole(user.id_Usuario);
			}
		}
	};

	useEffect(() => {
		handleId();
	}, []);

	const handleLogout = () => {
		sessionStorage.removeItem('token');
		nav('/');
	};

	return (
		<nav className='navbar navbar-expand-md navbar-dark bg-blue mb-5'>
			<NavLink className='navbar-brand mx-3' to='/'>
				MANTECC
			</NavLink>
			<div className='collapse navbar-collapse' id='navbarCollapse'>
				<div className='navbar-nav me-auto m-2'>
					{role === 1 && (
						<>
							<NavLink
								className={({ isActive }) =>
									'nav-item nav-link ' + (isActive ? 'active' : '')
								}
								to='/nueva_solicitud'
							>
								Nueva Solicitud
							</NavLink>
							<NavLink
								className={({ isActive }) =>
									'nav-item nav-link ' + (isActive ? 'active' : '')
								}
								to='/solicitudes'
							>
								Revisar Solicitudes
							</NavLink>
							<NavLink
								className={({ isActive }) =>
									'nav-item nav-link ' + (isActive ? 'active' : '')
								}
								to='/usuarios'
							>
								Usuarios
							</NavLink>
							<NavLink
								className={({ isActive }) =>
									'nav-item nav-link ' + (isActive ? 'active' : '')
								}
								to='/alumnos'
							>
								Alumnos
							</NavLink>
							<NavLink
								className={({ isActive }) =>
									'nav-item nav-link ' + (isActive ? 'active' : '')
								}
								to='/problemas'
							>
								Catalogo de problemas
							</NavLink>
							<NavLink
								className={({ isActive }) =>
									'nav-item nav-link ' + (isActive ? 'active' : '')
								}
								to='/configuraciones'
							>
								Configuraciones
							</NavLink>
						</>
					)}
					{role === 2 && (
						<>
							<NavLink
								className={({ isActive }) =>
									'nav-item nav-link ' + (isActive ? 'active' : '')
								}
								to='/nueva_solicitud'
							>
								Nueva Solicitud
							</NavLink>
							<NavLink
								className={({ isActive }) =>
									'nav-item nav-link ' + (isActive ? 'active' : '')
								}
								to='/solicitudes'
							>
								Revisar Solicitudes
							</NavLink>
						</>
					)}
					{role === 3 && (
						<>
							<NavLink
								className={({ isActive }) =>
									'nav-item nav-link ' + (isActive ? 'active' : '')
								}
								to='/solicitudes'
							>
								Revisar Solicitudes
							</NavLink>
						</>
					)}
				</div>
				<form>
					{!!nombres ? (
						<div className='d-flex'>
							<label className='mx-3 py-3 text-white'>{nombres}</label>
							<div className='mx-3 py-2'>
								<button
									className='btn btn-light'
									type='submit'
									onClick={() => {
										handleLogout();
									}}
								>
									Logout
								</button>
							</div>
						</div>
					) : (
						<NavLink className='d-flex btn btn-success mx-3' to='/login'>
							Login
						</NavLink>
					)}
				</form>
			</div>
		</nav>
	);
};
