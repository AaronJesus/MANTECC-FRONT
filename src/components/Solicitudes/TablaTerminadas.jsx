import { NavLink } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { GrDocumentPdf } from 'react-icons/gr';
import '../styles/NavbarStyles.css';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

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
			const getAreas = await fetch(`http://localhost:4000/areas`);
			const resAreas = await getAreas.json();
			setDptos(resAreas);
		} catch (error) {
			console.log('No se pudieron cargar las solicitudes');
			console.log(error);
		}
	};

	useEffect(() => {
		getAreas();
		handleId();
	}, []);

	if (cargando) {
		return <h1>Cargando solicitudes...</h1>;
	}

	return (
		<>
			<div className='d-flex m-3 mx-5  justify-content-center '>
				{!!solicitudes && solicitudes.length !== 0 ? (
					<table className='table table-sm table-hover text-center align-middle'>
						<thead className='bg-blue text-white'>
							<tr>
								<th scope='col'>Solicitud</th>
								{(role === 1 || role === 3) && <th scope='col'>Orden</th>}
								<th scope='col'>Departamento</th>
								<th scope='col'>Folio</th>
							</tr>
						</thead>
						<tbody className='bg-white'>
							{solicitudes.map((sol) => {
								return (
									<tr key={sol.Folio_Completo}>
										<td>
											<IconContext.Provider value={{ size: '40' }}>
												<button className='border-0 bg-transparent m-2'>
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
													return <td key={d.Clave_Area}>{d.Nombre} </td>;
												})}

										<td>{sol.Folio_Completo}</td>
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
