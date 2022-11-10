import { NavLink } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { GrDocumentPdf } from 'react-icons/gr';
import '../styles/NavbarStyles.css';
import { useState, useEffect } from 'react';

export const TablaTerminadas = () => {
	const permisos = localStorage.getItem('role');
	const [solicitudes, setSolicitudes] = useState([]);
	const [dptos, setDptos] = useState();

	const getSolicitudesTerminadas = async () => {
		try {
			const getSol = await fetch(
				'http://localhost:4000/solicitudes/terminadas'
			);
			const resSol = await getSol.json();
			setSolicitudes(resSol);
			const getAreas = await fetch(`http://localhost:4000/areas`);
			const resAreas = await getAreas.json();
			setDptos(resAreas);
		} catch (error) {
			console.log('No se pudieron cargar las solicitudes');
			console.log(error);
		}
	};

	useEffect(() => {
		getSolicitudesTerminadas();
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
