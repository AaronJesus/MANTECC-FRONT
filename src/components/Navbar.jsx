import { useNavigate, NavLink } from 'react-router-dom';
import './styles/NavbarStyles.css';

export const Navbar = () => {
	const role = localStorage.getItem('role');
	const user = localStorage.getItem('user');
	const nav = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('role');
		nav('/');
	};
	return (
		<nav className='navbar navbar-expand-md navbar-dark bg-blue mb-5'>
			<NavLink className='navbar-brand mx-3' to='/'>
				MANTECC
			</NavLink>
			<div className='collapse navbar-collapse' id='navbarCollapse'>
				<div className='navbar-nav me-auto m-2'>
					{role === '1' && (
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
					{role === ('2' || '3') && (
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
				</div>
				<form>
					{!!user ? (
						<button
							className='d-flex btn btn-light mx-3'
							type='submit'
							onClick={() => {
								handleLogout();
							}}
						>
							Logout
						</button>
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
