import { NavLink } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { GrDocumentPdf } from 'react-icons/gr';
import '../styles/NavbarStyles.css';
import { FcCheckmark, FcCancel } from 'react-icons/fc';
import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import jwtDecode from 'jwt-decode';

export const TablaSolicitudes = ({ solicitudes, cargando }) => {
	const [role, setRole] = useState();
	const [estado, setEstado] = useState([]);
	const [dptos, setDptos] = useState();
	const token = sessionStorage.getItem('token');

	const handleId = () => {
		if (!!token) {
			const user = jwtDecode(token);

			if (!!user) {
				setRole(user.id_Usuario);
			}
		}
	};

	const getData = async () => {
		try {
			const getEst = await fetch('http://localhost:4000/estados');
			const resEst = await getEst.json();
			setEstado(resEst);
			const getAreas = await fetch(`http://localhost:4000/areas`);
			const resAreas = await getAreas.json();
			setDptos(resAreas);
		} catch (error) {
			console.log('No se pudieron cargar estados y areas');
			console.log(error);
		}
	};

	const downloadSol = async () => {
		try {
			const data = await fetch('http://localhost:4000/pdfSol', {
				method: 'GET',
				headers: { 'Content-Type': 'application/pdf' },
				responseType: 'blob',
			});
			const res = await data.blob();
			saveAs(res, `Solicitud`);
			console.log(res);
		} catch (error) {
			console.log(error);
			console.log('PDF ni idea');
		}
	};

	useEffect(() => {
		getData();
		handleId();
	}, [setEstado, setDptos]);

	if (cargando) {
		return <h1>Cargando solicitudes...</h1>;
	}

	return (
		<>
			<div className='d-flex m-3 mx-5  justify-content-center '>
				{!!solicitudes && solicitudes.length !== 0 ? (
					<table className='table table-sm table-hover text-center align-middle'>
						<thead className='bg-blue text-white align-middle'>
							<tr>
								<th scope='col'>Solicitud</th>
								{(role === 1 || role === 3) && <th scope='col'>Orden</th>}
								<th scope='col'>Departamento</th>
								<th scope='col'>Folio</th>
								<th scope='col'>Aceptado</th>
								<th scope='col'>Rechazado</th>
								<th scope='col'>En proceso</th>
								<th scope='col'>Terminado por tecnico</th>
								<th scope='col'>Aprobado por admin.</th>
								<th scope='col'>Aprobado por cliente</th>
								{(role === 1 || role === 3) && <th scope='col'>Editar</th>}
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
													onClick={() => downloadSol()}
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
													<button className='border-0 bg-transparent m-2'>
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
													return <td key={d.Clave_Area}>{d.Nombre}</td>;
												})}
										<td>{sol.Folio_Completo}</td>
										{estado
											.filter((est) => est.idEstatus === sol.idEstatus)
											.map((e) => {
												return (
													<>
														<td>
															{e.Aceptado ? <FcCheckmark /> : <FcCancel />}
														</td>
														<td>
															{e.Rechazado ? <FcCheckmark /> : <FcCancel />}
														</td>
														<td>
															{e.En_proceso ? <FcCheckmark /> : <FcCancel />}
														</td>
														<td>
															{e.Terminado_tecnico ? (
																<FcCheckmark />
															) : (
																<FcCancel />
															)}
														</td>
														<td>
															{e.Aprobado_admin ? (
																<FcCheckmark />
															) : (
																<FcCancel />
															)}
														</td>
														<td>
															{role === 2 && e.Aprobado_admin ? (
																<NavLink
																	className='btn btn-success'
																	to={`/calificar_orden/${sol.Folio_Completo}`}
																>
																	Calificar
																</NavLink>
															) : e.Aprobado_cliente ? (
																<FcCheckmark />
															) : (
																<FcCancel />
															)}
														</td>
														{(role === 1 || role === 3) && (
															<td>
																<NavLink
																	className='btn btn-success mx-3'
																	to={`/editar_solicitud/${sol.Folio_Completo}`}
																>
																	Editar
																</NavLink>
															</td>
														)}
													</>
												);
											})}
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
