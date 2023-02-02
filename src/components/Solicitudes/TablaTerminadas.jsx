import { NavLink } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { GrDocumentPdf } from 'react-icons/gr';
import '../styles/NavbarStyles.css';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

export const TablaTerminadas = ({ solicitudes, cargando }) => {
	const [dptos, setDptos] = useState();
	const [role, setRole] = useState();
	const token = sessionStorage.getItem('token');

	const handleId = () => {
		if (!!token) {
			const user = jwtDecode(token);

			if (!!user) {
				setRole(user.id_Usuario);
			}
		}
	};

	const getAreas = async () => {
		try {
			const getAreas = await fetch(process.env.REACT_APP_DEV + `/areas`);
			const resAreas = await getAreas.json();
			setDptos(resAreas);
		} catch (error) {
			console.log('No se pudieron cargar las solicitudes');
			console.log(error);
		}
	};

	const handleDel = async (idP) => {
		Swal.fire({
			title: 'Seguro que desea eliminar la solicitud?',
			showDenyButton: true,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			denyButtonText: `Eliminar`,
		}).then(async (result) => {
			if (result.isDenied) {
				try {
					const data = await fetch(
						process.env.REACT_APP_DEV + `/solicitud/${idP}`,
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

	const downloadSol = async (Folio) => {
		try {
			const data = await fetch(process.env.REACT_APP_DEV + `/pdfSol/${Folio}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/pdf' },
				responseType: 'blob',
			});
			const res = await data.blob();
			saveAs(res, `Solicitud ${Folio}`);
		} catch (error) {
			console.log(error);
			console.log('PDF ni idea');
		}
	};

	const downloadOrden = async (Folio) => {
		try {
			const data = await fetch(
				process.env.REACT_APP_DEV + `/pdfOrden/${Folio}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/pdf' },
					responseType: 'blob',
				}
			);
			const res = await data.blob();
			saveAs(res, `Orden ${Folio}`);
		} catch (error) {
			console.log(error);
			console.log('PDF ni idea');
		}
	};

	useEffect(() => {
		getAreas();
		handleId();
	}, [setDptos]);

	if (cargando) {
		return (
			<h1 className='d-flex justify-content-center'>Cargando solicitudes...</h1>
		);
	}

	return (
		<>
			<div className='d-flex m-3 mx-5  justify-content-center '>
				{!!solicitudes && solicitudes.length > 0 ? (
					<table className='table table-sm table-hover text-center align-middle'>
						<thead className='bg-blue text-white'>
							<tr>
								<th scope='col'>Solicitud</th>
								{(role === 1 || role === 3) && <th scope='col'>Orden</th>}
								<th scope='col'>Departamento</th>
								<th scope='col'>Folio</th>
								{(role === 1 || role === 3) && <th scope='col'>Eliminar</th>}
							</tr>
						</thead>
						<tbody className='bg-white'>
							{solicitudes.map((sol) => {
								return (
									<tr key={sol.Folio_Completo}>
										<td>
											<IconContext.Provider value={{ size: '40' }}>
												<button
													className='border-0 bg-transparent m-2'
													onClick={() => downloadSol(sol.Folio_Completo)}
												>
													<GrDocumentPdf />
												</button>
											</IconContext.Provider>
											<NavLink
												className='btn btn-sm btn-primary m-2'
												to={`/solicitudes/${sol.Folio_Completo}`}
											>
												Ver
											</NavLink>
										</td>
										{(role === 1 || role === 3) && (
											<td>
												<IconContext.Provider value={{ size: '40' }}>
													<button
														className='border-0 bg-transparent m-2'
														onClick={() => downloadOrden(sol.Folio_Completo)}
													>
														<GrDocumentPdf />
													</button>
												</IconContext.Provider>
												<NavLink
													className='btn btn-sm btn-primary m-2'
													to={`/ordenes/${sol.Folio_Completo}`}
												>
													Ver
												</NavLink>
											</td>
										)}

										{!!dptos &&
											dptos
												.filter((dpt) => dpt.Clave_Area === sol.Clave_Area)
												.map((d) => {
													return <td key={d.Clave_Area}>{d.Nombre} </td>;
												})}

										<td>{sol.Folio_Completo}</td>
										{(role === 1 || role === 3) && (
											<td>
												<button
													className='btn btn-danger mx-3'
													onClick={() => handleDel(sol.Folio_Completo)}
												>
													Eliminar
												</button>
											</td>
										)}
									</tr>
								);
							})}
						</tbody>
					</table>
				) : (
					<h1>No hay solicitudes por mostrar</h1>
				)}
			</div>
		</>
	);
};
