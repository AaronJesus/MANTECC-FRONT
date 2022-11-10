import { NavLink } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { GrDocumentPdf } from 'react-icons/gr';
import '../styles/NavbarStyles.css';
import { FcCheckmark, FcCancel } from 'react-icons/fc';
import { useState, useEffect } from 'react';

export const TablaSolicitudes = () => {
	const permisos = localStorage.getItem('role');
	const [solicitudes, setSolicitudes] = useState([]);
	const [estado, setEstado] = useState([]);
	const [dptos, setDptos] = useState();

	const getSolicitudes = async () => {
		try {
			const getSol = await fetch('http://localhost:4000/solicitudes');
			const resSol = await getSol.json();
			setSolicitudes(resSol);
			const getEst = await fetch('http://localhost:4000/estados');
			const resEst = await getEst.json();
			setEstado(resEst);
			const getAreas = await fetch(`http://localhost:4000/areas`);
			const resAreas = await getAreas.json();
			setDptos(resAreas);
		} catch (error) {
			console.log('No se pudieron cargar las solicitudes');
			console.log(error);
		}
	};

	useEffect(() => {
		getSolicitudes();
	}, []);

	return (
		<>
			<div className='d-flex m-3 mx-5  justify-content-center '>
				{!solicitudes ? (
					<h1>No hay solicitudes por mostrar</h1>
				) : (
					<table className='table table-hover text-center align-middle'>
						<thead className='bg-blue text-white'>
							<tr>
								<th scope='col'>Solicitud</th>
								{permisos === ('1' || '3') && <th scope='col'>Orden</th>}
								<th scope='col'>Departamento</th>
								<th scope='col'>Folio</th>
								<th scope='col'>Aceptado</th>
								<th scope='col'>Rechazado</th>
								<th scope='col'>En proceso</th>
								<th scope='col'>Terminado por tecnico</th>
								<th scope='col'>Aprobado por admin.</th>
								<th scope='col'>Aprobado por cliente</th>
								{permisos === ('1' || '3') && <th scope='col'>Editar</th>}
							</tr>
						</thead>
						<tbody className='bg-white'>
							{solicitudes.map((sol) => {
								return (
									<tr key={sol.Folio_Solicitud}>
										<td>
											<IconContext.Provider value={{ size: '40' }}>
												<button className='border-0 bg-transparent m-2'>
													<GrDocumentPdf />
												</button>
											</IconContext.Provider>
											<NavLink
												className='btn btn-primary m-2'
												to={`/solicitudes/${sol.Folio_Solicitud}`}
											>
												Ver
											</NavLink>
										</td>
										{permisos === ('1' || '3') && (
											<td>
												<IconContext.Provider value={{ size: '40' }}>
													<button className='border-0 bg-transparent m-2'>
														<GrDocumentPdf />
													</button>
												</IconContext.Provider>
												<NavLink
													className='btn btn-primary m-2'
													to={`/ordenes/${sol.Folio_Solicitud}`}
												>
													Ver
												</NavLink>
											</td>
										)}

										<td>
											{!!dptos &&
												dptos
													.filter((dpt) => dpt.Clave_Area === sol.Clave_Area)
													.map((d) => {
														return d.Nombre;
													})}
										</td>
										<td>{sol.Folio_Solicitud}</td>
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
															{permisos === '2' && e.Aprobado_admin ? (
																<NavLink
																	className='btn btn-success'
																	to={`/calificar_orden/${sol.Folio_Solicitud}`}
																>
																	Calificar
																</NavLink>
															) : e.Aprobado_cliente ? (
																<FcCheckmark />
															) : (
																<FcCancel />
															)}
														</td>
														{permisos === ('1' || '3') && (
															<td>
																<NavLink
																	className='btn btn-success'
																	to={`/editar_solicitud/${sol.Folio_Solicitud}`}
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
				)}
			</div>
		</>
	);
};
