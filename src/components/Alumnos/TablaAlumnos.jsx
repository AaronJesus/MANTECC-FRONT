import { NavLink } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { IconContext } from 'react-icons';
import { FcCheckmark, FcCancel } from 'react-icons/fc';
import { useState } from 'react';
import '../styles/NavbarStyles.css';
const nombreU = ['Alumno 1', 'Alumno 2', 'Alumno 3', 'Alumno 4'];

export const TablaAlumnos = () => {
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
							<th scope='col'>Nombre de usuario</th>
							<th scope='col'>Nombre completo</th>
							<th scope='col'>Numero de control</th>
							<th scope='col'>Clave y nombre de carrera</th>
							<th scope='col'>Estado</th>
							<th scope='col'>Opciones</th>
						</tr>
					</thead>
					<tbody className='bg-white'>
						{nombreU.map((folio) => {
							return (
								<tr key={folio}>
									<td>{folio}</td>
									<td>Alumno Completo</td>
									<td>99999999</td>
									<td>Clave-Nombre</td>
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
											to='/editar_alumno'
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
				<NavLink className='btn btn-primary btn-lg m-2' to='/nuevo_alumno'>
					Nuevo
				</NavLink>
			</div>
		</>
	);
};
