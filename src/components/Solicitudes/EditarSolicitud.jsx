import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { NavLink, useParams } from 'react-router-dom';
import '../styles/NavbarStyles.css';
import { FcCheckmark, FcCancel } from 'react-icons/fc';

export const EditarSolicitud = () => {
	const [estado, setEstado] = useState([]);
	const [aprob, setAprob] = useState();
	const [rech, setRech] = useState();
	const [proc, setProc] = useState();
	const [termTec, setTermTec] = useState();
	const [aprobAdmin, setAprobAdmin] = useState();
	const { id } = useParams();

	const getEstado = async () => {
		try {
			const getEst = await fetch(`http://localhost:4000/estado/${id}`);
			const resEst = await getEst.json();
			setEstado(resEst);
			setAprob(resEst[0].Aceptado);
			setRech(resEst[0].Rechazado);
			setProc(resEst[0].En_proceso);
			setTermTec(resEst[0].Terminado_tecnico);
			setAprobAdmin(resEst[0].Aprobado_admin);
		} catch (error) {
			console.log('trono en ver los estados');
			console.error(error);
		}
	};

	const handleAprob = () => {
		setAprob(!aprob);
		setRech(false);
	};
	const handleRech = () => {
		setTermTec(false);
		setProc(false);
		setAprob(false);
		setAprobAdmin(false);
		setRech(!rech);
	};
	const handleProc = () => {
		setProc(!proc);
		setAprob(true);
		setRech(false);
		setAprobAdmin(false);
		setTermTec(false);
	};
	const handleTermTec = () => {
		setProc(true);
		setAprob(true);
		setRech(false);
		setTermTec(!termTec);
		setAprobAdmin(false);
	};
	const handleAprobAdmin = () => {
		setTermTec(true);
		setProc(true);
		setAprob(true);
		setRech(false);
		setAprobAdmin(!aprobAdmin);
	};

	const handleSave = async () => {
		try {
			const estado = await fetch(`http://localhost:4000/estado/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					Aceptado: aprob,
					Rechazado: rech,
					En_proceso: proc,
					Terminado_tecnico: termTec,
					Aprobado_admin: aprobAdmin,
				}),
			});
			await estado.json();
			window.alert('Guardado!');
		} catch (error) {
			console.log('trono en guardar');
			console.error(error);
		}
	};

	useEffect(() => {
		getEstado();
	}, []);

	return (
		<>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Estado de la soliciutd</h1>
			</div>
			<div className='d-flex m-3  justify-content-center '>
				<table className='table table-hover text-center align-middle'>
					<thead className='bg-blue text-white'>
						<tr>
							<th scope='col'>Folio</th>
							<th scope='col'>Aprobado</th>
							<th scope='col'>Rechazado</th>
							<th scope='col'>En proceso</th>
							<th scope='col'>Terminado por tecnico</th>
							<th scope='col'>Aprobado por admin.</th>
						</tr>
					</thead>
					<tbody className='bg-white'>
						{estado.map((est) => {
							return (
								<tr key={est.idEstatus}>
									<td>{id}</td>
									<td>
										{aprob ? (
											<button
												className='border-0 bg-transparent'
												onClick={() => handleAprob()}
											>
												<FcCheckmark />
											</button>
										) : (
											<button
												className='border-0 bg-transparent'
												onClick={() => handleAprob()}
											>
												<FcCancel />
											</button>
										)}
									</td>
									<td>
										{rech ? (
											<button
												className='border-0 bg-transparent'
												onClick={() => handleRech()}
											>
												<FcCheckmark />
											</button>
										) : (
											<button
												className='border-0 bg-transparent'
												onClick={() => handleRech()}
											>
												<FcCancel />
											</button>
										)}
									</td>
									<td>
										{proc ? (
											<button
												className='border-0 bg-transparent'
												onClick={() => handleProc()}
											>
												<FcCheckmark />{' '}
											</button>
										) : (
											<button
												className='border-0 bg-transparent'
												onClick={() => handleProc()}
											>
												<FcCancel />
											</button>
										)}
									</td>
									<td>
										{termTec ? (
											<button
												className='border-0 bg-transparent'
												onClick={() => handleTermTec()}
											>
												<FcCheckmark />
											</button>
										) : (
											<button
												className='border-0 bg-transparent'
												onClick={() => handleTermTec()}
											>
												<FcCancel />
											</button>
										)}
									</td>
									<td>
										{aprobAdmin ? (
											<button
												className='border-0 bg-transparent'
												onClick={() => handleAprobAdmin()}
											>
												<FcCheckmark />
											</button>
										) : (
											<button
												className='border-0 bg-transparent'
												onClick={() => handleAprobAdmin()}
											>
												<FcCancel />
											</button>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className='d-flex justify-content-end m-5'>
				<button className='btn btn-warning mx-3' onClick={() => handleSave()}>
					Guardar
				</button>
				<NavLink className='btn btn-primary' to='/solicitudes'>
					Regresar
				</NavLink>
			</div>
		</>
	);
};
