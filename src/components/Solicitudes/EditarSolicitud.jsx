import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import '../styles/NavbarStyles.css';
import { FcCheckmark, FcCancel } from 'react-icons/fc';
import Swal from 'sweetalert2';
import jwtDecode from 'jwt-decode';
import Moment from 'moment';

export const EditarSolicitud = () => {
	const nav = useNavigate();
	const [estado, setEstado] = useState([]);
	const [aprob, setAprob] = useState();
	const [rech, setRech] = useState();
	const [proc, setProc] = useState();
	const [termTec, setTermTec] = useState();
	const [aprobAdmin, setAprobAdmin] = useState();
	const [NoControl, setNoControl] = useState(false);
	const [datOrd, setDatOrd] = useState();
	const [periodo, setPeriodo] = useState();

	const [submit, setsubmit] = useState(false);
	const { id } = useParams();

	const token = sessionStorage.getItem('token');
	const [role, setRole] = useState();

	const handleId = () => {
		if (!!token) {
			const user = jwtDecode(token);

			if (!!user) {
				setRole(user.id_Usuario);
			}
		}
	};

	const getPeriodo = async () => {
		try {
			const getEst = await fetch(`http://localhost:4000/configs`);
			const res = await getEst.json();
			setPeriodo(res[0].Valor);
		} catch (error) {
			console.log('trono en ver los estados');
			console.error(error);
		}
	};

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

	const getOrden = async () => {
		try {
			const getEst = await fetch(`http://localhost:4000/orden/${id}`);
			const resEst = await getEst.json();
			!!resEst && resEst[0].No_Control && setNoControl(true);
			!!resEst && setDatOrd(resEst[0]);
		} catch (error) {
			console.log('trono en ver los estados');
			console.error(error);
		}
	};

	const handleAprob = () => {
		setAprob(!aprob);
		setRech(false);
		setTermTec(false);
		setProc(false);
		setAprobAdmin(false);
	};

	const handleRech = () => {
		Swal.fire({
			title:
				'Al rechazar la soliciutd se dara por terminada, esta seguro que desea continuar?',
			showDenyButton: true,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			denyButtonText: `Continuar`,
		}).then(async (result) => {
			if (result.isDenied) {
				const { value: motivo } = await Swal.fire({
					title: 'Describa el motivo del rechazo',
					input: 'textarea',
					showCancelButton: true,
					inputValidator: (value) => {
						if (!value) {
							return 'Necesita poner algun motivo';
						}
					},
				});
				if (motivo) {
					try {
						const ord = await fetch(`http://localhost:4000/orden/${id}`, {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								Trabajo_Realizado: 'Solicitud rechazada: ' + motivo,
								Fecha_Realizacion: Moment().format('YYYY-MM-DD'),
								Mantenimiento_Interno: datOrd.Mantenimiento_Interno,
								Tipo_Servicio: datOrd.Tipo_Servicio,
								Asignado_a: datOrd.Asignado_a,
								idPeriodo: periodo,
							}),
						});
						await ord.json();
						const estado = await fetch(`http://localhost:4000/estado/${id}`, {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								Aceptado: false,
								Rechazado: true,
								En_proceso: false,
								Terminado_tecnico: false,
								Aprobado_admin: false,
							}),
						});
						await estado.json();
						Swal.fire('Guardado');
						nav('/solicitudes');
					} catch (error) {
						Swal.fire('Hubo un error con la conexion');
						console.log('trono en guardar');
						console.error(error);
					}
				}
			}
		});
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
		if (!!NoControl) {
			if (role == 1) {
				setTermTec(true);
				setProc(true);
				setAprob(true);
				setRech(false);
				setAprobAdmin(!aprobAdmin);
			} else {
				Swal.fire(
					'Solo los administradores pueden aprobar este campo',
					'',
					'error'
				);
			}
		} else {
			Swal.fire('La orden no esta completa, favor de llenarla', '', 'error');
		}
	};

	const handleSave = async () => {
		setsubmit(true);
		if (!submit) {
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
				Swal.fire('Guardado');
				nav('/solicitudes');
				setsubmit(false);
			} catch (error) {
				setsubmit(false);
				Swal.fire('Hubo un error con la conexion');
				console.log('trono en guardar');
				console.error(error);
			}
		}
	};

	useEffect(() => {
		getEstado();
		getOrden();
		handleId();
		getPeriodo();
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
