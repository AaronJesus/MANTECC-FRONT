import { NavLink } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { IconContext } from 'react-icons';
import { FcCheckmark, FcCancel } from 'react-icons/fc';
import '../styles/NavbarStyles.css';
import Swal from 'sweetalert2';

export const TablaUsuarios = ({ users, cargando }) => {
	const handleEst = async (rfc, est) => {
		Swal.fire({
			title: 'Cambiar el estado del usuario?',
			showConfirmButton: true,
			showCancelButton: true,
			confirmButtonText: 'Confirmar',
			cancelButtonText: `Calcelar`,
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const data = await fetch(
						process.env.REACT_APP_DEV + `/usuarioEstado/${rfc}`,
						{
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								Estatus: est,
							}),
						}
					);
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
			title: 'Seguro que desea eliminar el usuario?',
			showDenyButton: true,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			denyButtonText: `Eliminar`,
		}).then(async (result) => {
			if (result.isDenied) {
				try {
					const data = await fetch(
						process.env.REACT_APP_DEV + `/usuario/${rfc}`,
						{
							method: 'DELETE',
						}
					);
					await data.json();

					window.location.reload(false);
				} catch (error) {
					console.log(error);
					console.log('trono delete');
				}
			}
		});
	};

	if (cargando) {
		return (
			<h1 className='d-flex justify-content-center'>Cargando usuarios...</h1>
		);
	}

	return (
		<>
			<div className='d-flex mx-5 m-3 justify-content-center '>
				{!!users && users.length ? (
					<table className='table table-sm table-hover text-center align-middle'>
						<thead className='bg-blue text-white'>
							<tr>
								<th scope='col'>RFC</th>
								<th scope='col'>Nombre Completo</th>
								<th scope='col'>Tipo de usuario</th>
								{/* <th scope='col'>Estado</th> */}
								<th scope='col'>Opciones</th>
							</tr>
						</thead>
						<tbody className='bg-white'>
							{users.map((user) => {
								return (
									<tr key={user.RFC}>
										<td>{user.RFC}</td>
										<td>{user.Nombres}</td>
										<td>{user.id_Usuario === 1 ? 'Admin' : 'Cliente'}</td>
										{/* <td>
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
										</td> */}
										<td>
											<NavLink
												className='btn btn-sm btn-success m-2'
												to={`/editar_usuario/${user.RFC}`}
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
				) : (
					<h1>No hay usuarios para mostrar</h1>
				)}
			</div>
		</>
	);
};
