import { NavLink } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { IconContext } from 'react-icons';
import { FcCheckmark, FcCancel } from 'react-icons/fc';
import { useState } from 'react';
import '../styles/NavbarStyles.css';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

export const TablaAlumnos = ({ users, cargando }) => {
	const [alum, setAlum] = useState();
	const [carr, setCarr] = useState();
	const [estcheck, setEstchek] = useState(true);

	const getData = async () => {
		try {
			const data = await fetch('http://localhost:4000/alumnos');
			const info = await fetch('http://localhost:4000/carreras');
			const resInfo = await info.json();
			const res = await data.json();
			setCarr(resInfo);
			setAlum(res[1]);
		} catch (error) {
			console.log('Trono get');
			console.log(error);
		}
	};

	const handleEst = async (rfc, est) => {
		Swal.fire({
			title: 'Cambiar el estado del alumno?',
			showConfirmButton: true,
			showCancelButton: true,
			confirmButtonText: 'Confirmar',
			cancelButtonText: `Calcelar`,
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const data = await fetch(
						`http://localhost:4000/usuarioEstado/${rfc}`,
						{
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								Estatus: est,
							}),
						}
					);
					setEstchek(!estcheck);
					await data.json();

					window.location.reload(false);
				} catch (error) {
					console.log(error);
					console.log('trono estado');
				}
			}
		});
	};

	const handleDel = async (rfc) => {
		Swal.fire({
			title: 'Seguro que desea eliminar el alumno?',
			showDenyButton: true,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			denyButtonText: `Eliminar`,
		}).then(async (result) => {
			if (result.isDenied) {
				try {
					const data = await fetch(`http://localhost:4000/alumno/${rfc}`, {
						method: 'DELETE',
					});
					await data.json();
					setEstchek(!estcheck);

					window.location.reload(false);
				} catch (error) {
					console.log(error);
					console.log('trono delete');
				}
			}
		});
	};

	useEffect(() => {
		getData();
	}, [setAlum, setCarr, estcheck]);

	return (
		<>
			<div className='d-flex m-5 my-0 justify-content-center '>
				<table className='table table-sm table-hover text-center align-middle'>
					<thead className='bg-blue text-white align-middle'>
						<tr>
							<th scope='col'>RFC</th>
							<th scope='col'>Nombre completo</th>
							<th scope='col'>Numero de control</th>
							<th scope='col'>Nombre de carrera</th>
							<th scope='col'>Estado</th>
							<th scope='col'>Opciones</th>
						</tr>
					</thead>
					<tbody className='bg-white'>
						{!!users &&
							!!alum &&
							users.map((user) => {
								return (
									<tr key={user.RFC}>
										<td>{user.RFC}</td>
										<td>{user.Nombres}</td>
										<td>
											{alum
												.filter((al) => al.RFC === user.RFC)
												.map((a) => {
													return a.No_Control;
												})}
										</td>
										<td>
											{alum
												.filter((al) => al.RFC === user.RFC)
												.map((a) => {
													return (
														!!carr &&
														carr
															.filter(
																(car) => car.Clave_Carrera === a.Clave_Carrera
															)
															.map((c) => {
																return c.Nombre_Reducido;
															})
													);
												})}
										</td>
										<td>
											{user.Estatus === true ? (
												<div>
													<label>Activo</label>
													<IconContext.Provider value={{ size: '40' }}>
														<button
															className='border-0 bg-transparent m-2'
															onClick={() => handleEst(user.RFC, false)}
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
															onClick={() => handleEst(user.RFC, true)}
														>
															<FcCancel />
														</button>
													</IconContext.Provider>
												</div>
											)}
										</td>
										<td>
											<NavLink
												className='btn btn-sm btn-success m-2'
												to={`/editar_alumno/${user.RFC}`}
											>
												Editar
											</NavLink>
											<button
												className='btn btn-sm btn-danger m-2'
												onClick={() => handleDel(user.RFC)}
											>
												Eliminar
											</button>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		</>
	);
};
