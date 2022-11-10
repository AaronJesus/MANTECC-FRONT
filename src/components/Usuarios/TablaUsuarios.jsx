import { NavLink } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { IconContext } from 'react-icons';
import { FcCheckmark, FcCancel } from 'react-icons/fc';
import { useState } from 'react';
import '../styles/NavbarStyles.css';
const nombreU = ['Usuario 1', 'Usuario 2', 'Usuario 3', 'Usuario 4'];

export const TablaUsuarios = () => {
	const [estado, setEstado] = useState(true);
	const handleEstado = () => {
		setEstado(!estado);
	};
	return (
		<>
			<div className='d-flex m-5 my-0 justify-content-center '>
				<table className='table table-hover text-center align-middle'>
					<thead className='bg-blue text-white'>
						<tr>
							<th scope='col'>Nombre de Usuario</th>
							<th scope='col'>Nombre Completo</th>
							<th scope='col'>Tipo de usuario</th>
							<th scope='col'>Estado</th>
							<th scope='col'>Opciones</th>
						</tr>
					</thead>
					<tbody className='bg-white'>
						{nombreU.map((folio) => {
							return (
								<tr key={folio}>
									<td>{folio}</td>
									<td>Usuario Completo</td>
									<td>Admin</td>
									<td>
										{estado ? (
											<div>
												<label>Activo</label>
												<IconContext.Provider value={{ size: '40' }}>
													<button
														className='border-0 bg-transparent m-2'
														onClick={() => handleEstado()}
													>
														<FcCheckmark />
													</button>
												</IconContext.Provider>
											</div>
										) : (
											<div>
												<label>Inactivo</label>
												<IconContext.Provider value={{ size: '40' }}>
													<button
														className='border-0 bg-transparent m-2'
														onClick={() => handleEstado()}
													>
														<FcCancel />
													</button>
												</IconContext.Provider>
											</div>
										)}
									</td>
									<td>
										<NavLink
											className='btn btn-success m-2'
											to='/editar_usuario'
										>
											Editar
										</NavLink>
										<button className='btn btn-danger m-2'>Eliminar</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className='d-flex justify-content-center'>
				<NavLink className='btn btn-primary btn-lg m-2' to='/nuevo_usuario'>
					Nuevo
				</NavLink>
			</div>
		</>
	);
};
