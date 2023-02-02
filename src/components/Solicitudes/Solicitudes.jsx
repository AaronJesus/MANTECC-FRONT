import { useEffect } from 'react';
import { useState } from 'react';
import { BsChevronDown, BsChevronUp, BsFillEraserFill } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import { TablaSolicitudes } from './TablaSolicitudes';
import { TablaTerminadas } from './TablaTerminadas';
import { Paginacion } from '../Extras/Paginacion';
import jwtDecode from 'jwt-decode';
import 'animate.css';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import { NotificationManager } from 'react-notifications';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { saveAs } from 'file-saver';

export const Solicitudes = () => {
	const [a, setA] = useState(1);
	const [mostrarQ, setMostrarQ] = useState(false);
	const [periodo, setPeriodo] = useState();
	const [users, setUsers] = useState();
	const [areas, setAreas] = useState();
	const [periodos, setPeriodos] = useState();
	const [solQuerys, setsolQuerys] = useState();
	const [solTerminadasQuerys, setSolTerminadasQuerys] = useState();
	const [q, setq] = useState(false);
	const [fecha1, setFecha1] = useState('');
	const [fecha2, setFecha2] = useState('');
	const [solicitudes, setSolicitudes] = useState([]);
	const [solicitudesTerm, setSolicitudesTerm] = useState();

	const [currentPage, setCurrentPage] = useState(1);
	const [currentPosts, setcurrentPosts] = useState();
	const [cargando, setCargando] = useState(false);

	const token = sessionStorage.getItem('token');
	const [role, setRole] = useState();
	const [RFC, setRFC] = useState();

	const handleId = () => {
		if (!!token) {
			const user = jwtDecode(token);

			if (!!user) {
				setRFC(user.RFC);
				setRole(user.id_Usuario);
			}
		}
	};

	const verQuery = () => {
		setMostrarQ(!mostrarQ);
	};

	const elimQuery = () => {
		setSolTerminadasQuerys();
		setsolQuerys();
		formik.setFieldValue('idPeriodo', '');
		formik.setFieldValue('RFC', '');
		formik.setFieldValue('Nombres', '');
		formik.setFieldValue('Clave_Area', '');
		formik.setFieldValue('Folio', '');
		formik.setFieldValue('Asignado_a', '');
		setFecha1('');
		setFecha2('');
		setq(false);
	};

	const formik = useFormik({
		initialValues: {
			idPeriodo: '',
			RFC: '',
			Nombres: '',
			Clave_Area: '',
			Folio: '',
			Asignado_a: '',
			Fechas: '',
			postPerPage: 10,
		},
		onSubmit: async (values) => {
			setCargando(true);
			if (
				!values.idPeriodo &&
				!values.RFC &&
				!values.Nombres &&
				!values.Clave_Area &&
				!values.Folio &&
				!values.Asignado_a
			) {
				setq(false);
			}

			if (!!fecha1) {
				if (!fecha2) {
					Swal.fire('Debe de seleccionar una fecha final');
					setCargando(false);
					return;
				}
			}

			if (!!fecha2) {
				if (!fecha1) {
					Swal.fire('Debe de seleccionar una fecha inicial');
					setCargando(false);
					return;
				}
			}

			if (!!fecha1) {
				if (!!fecha2) {
					if (fecha1 > fecha2) {
						Swal.fire('La fecha inicial no puede ser mayor que la final');
						setCargando(false);
						return;
					}
				}
			}

			if (!cargando) {
				try {
					if (a === 1) {
						const getSol = await fetch(
							process.env.REACT_APP_DEV + '/solicitudes/query',
							{
								method: 'PUT',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									idPeriodo: values.idPeriodo,
									RFC: values.RFC,
									Nombre_Solicitante: values.Nombres,
									Clave_Area: values.Clave_Area,
									Folio: values.Folio,
									Asignado_a: values.Asignado_a,
									Fecha1: !!fecha1
										? moment.utc(fecha1).format('YYYY-MM-DD')
										: '',
									Fecha2: !!fecha2
										? moment.utc(fecha2).format('YYYY-MM-DD')
										: '',
								}),
							}
						);
						const resSol = await getSol.json();
						setq(true);
						setsolQuerys(resSol);
					} else if (a === 2) {
						const getSolTerminadas = await fetch(
							process.env.REACT_APP_DEV + '/solicitudes/terminadas/query',
							{
								method: 'PUT',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									idPeriodo: values.idPeriodo,
									RFC: values.RFC,
									Nombre_Solicitante: values.Nombres,
									Clave_Area: values.Clave_Area,
									Folio: values.Folio,
									Asignado_a: values.Asignado_a,
									Fecha1: !!fecha1
										? moment.utc(fecha1).format('YYYY-MM-DD')
										: '',
									Fecha2: !!fecha2
										? moment.utc(fecha2).format('YYYY-MM-DD')
										: '',
								}),
							}
						);
						const resSolTerminadas = await getSolTerminadas.json();
						setq(true);
						setSolTerminadasQuerys(resSolTerminadas);
					}

					setCargando(false);
				} catch (error) {
					setCargando(false);
					Swal.fire('Hubo un error de conexion');
					console.log('No se pudieron cargar las solicitudes');
					console.log(error);
				}
			}
		},
	});

	const lastPost = currentPage * formik.values.postPerPage;
	const firstPost = lastPost - formik.values.postPerPage;

	const getPeriodos = async () => {
		try {
			const data = await fetch(process.env.REACT_APP_DEV + '/periodos');
			const res = await data.json();
			!!res && setPeriodos(res);
		} catch (error) {
			NotificationManager.warning(
				'No se pudieron cargar los periodos',
				'Filtrar',
				3000
			);
			console.log('Error al cargar periodos');
			console.log(error);
		}
	};

	const getAreas = async () => {
		try {
			const data = await fetch(process.env.REACT_APP_DEV + '/areas');
			const res = await data.json();
			!!res &&
				setAreas(
					res.sort(function (a, b) {
						if (a.Nombre.toLowerCase() < b.Nombre.toLowerCase()) {
							return -1;
						}
						if (a.Nombre.toLowerCase() > b.Nombre.toLowerCase()) {
							return 1;
						}
						return 0;
					})
				);
		} catch (error) {
			NotificationManager.warning(
				'No se pudieron cargar las areas',
				'Filtrar',
				3000
			);
			console.log('Error al cargar areas');
			console.log(error);
		}
	};

	const getUsers = async () => {
		try {
			const data = await fetch(process.env.REACT_APP_DEV + '/admins');
			const res = await data.json();
			!!res &&
				setUsers(
					res.sort(function (a, b) {
						if (a.Nombres.toLowerCase() < b.Nombres.toLowerCase()) {
							return -1;
						}
						if (a.Nombres.toLowerCase() > b.Nombres.toLowerCase()) {
							return 1;
						}
						return 0;
					})
				);
		} catch (error) {
			NotificationManager.warning(
				'No se pudieron cargar los tecnicos',
				'Filtrar',
				3000
			);
			console.log('Error al cargar usuarios');
			console.log(error);
		}
	};
	const getSolicitudes = async () => {
		setCargando(true);

		try {
			//get idPeriodo
			const dataConf = await fetch(process.env.REACT_APP_DEV + `/configs`);
			const resC = await dataConf.json();
			if (!!resC) {
				const dataPeriodo = await fetch(
					process.env.REACT_APP_DEV + `/periodo/${resC[0].Valor}`
				);
				const resP = await dataPeriodo.json();
				//get periodo
				!!resP && setPeriodo(resP[0].Periodo);
			}
			//getSolicitudes del periodo
			if (!!role) {
				//solicitudes del rfc del cliente
				if (role === 2) {
					if (a === 1) {
						const valid = await fetch(
							process.env.REACT_APP_DEV + `/solicitudRFC/${RFC}`
						);
						const res = await valid.json();
						setSolicitudes(res);
					} else if (a === 2) {
						const valid = await fetch(
							process.env.REACT_APP_DEV + `/solicitudRFC/term/${RFC}`
						);
						const res = await valid.json();
						setSolicitudesTerm(res);
					}
				} else {
					if (a === 1) {
						const getSol = await fetch(
							process.env.REACT_APP_DEV + '/solicitudes',
							{
								method: 'PUT',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									idPeriodo: !!resC && resC[0].Valor,
								}),
							}
						);
						const resSol = await getSol.json();
						setSolicitudes(resSol);
					} else if (a === 2) {
						const getSol = await fetch(
							process.env.REACT_APP_DEV + '/solicitudes/terminadas',
							{
								method: 'PUT',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									idPeriodo: !!resC && resC[0].Valor,
								}),
							}
						);
						const resSol = await getSol.json();
						setSolicitudesTerm(resSol);
					}
				}
			}
			setCargando(false);
		} catch (error) {
			setCargando(false);

			NotificationManager.warning(
				'No se pudieron cargar las solicitudes',
				'Error',
				3000
			);
			console.log('No se pudieron cargar las solicitudes');
			console.log(error);
		}
	};

	const descargarVarias = async () => {
		if (!fecha1) {
			if (!!fecha2) {
				Swal.fire('Debe de seleccionar una fecha inicial');
			} else if (!fecha2) {
				Swal.fire('Debe de seleccionar una fecha inicial y una fecha final');
			}
		} else if (!fecha2) {
			Swal.fire('Debe de seleccionar una fecha final');
		} else if (fecha1 > fecha2) {
			Swal.fire('La fecha inicial no puede ser mayor que la final');
		} else {
			if (a === 1) {
				if (!!solQuerys) {
					for (let index = 0; index < solQuerys.length; index++) {
						try {
							const data = await fetch(
								process.env.REACT_APP_DEV +
									`/pdfSol/${solQuerys[index].Folio_Completo}`,
								{
									method: 'GET',
									headers: { 'Content-Type': 'application/pdf' },
									responseType: 'blob',
								}
							);
							const res = await data.blob();
							saveAs(res, `Solicitud ${solQuerys[index].Folio_Completo}`);
						} catch (error) {
							console.log(error);
							console.log('PDF ni idea');
						}
					}
				}
			} else if (a === 2) {
				if (!!solTerminadasQuerys) {
					for (let index = 0; index < solTerminadasQuerys.length; index++) {
						try {
							const data = await fetch(
								process.env.REACT_APP_DEV +
									`/pdfSol/${solTerminadasQuerys[index].Folio_Completo}`,
								{
									method: 'GET',
									headers: { 'Content-Type': 'application/pdf' },
									responseType: 'blob',
								}
							);
							const res = await data.blob();
							saveAs(
								res,
								`Solicitud ${solTerminadasQuerys[index].Folio_Completo}`
							);
						} catch (error) {
							console.log(error);
							console.log('PDF ni idea');
						}
					}
				}
			}
		}
	};

	const descargarVariasOrd = async () => {
		if (!fecha1) {
			if (!!fecha2) {
				Swal.fire('Debe de seleccionar una fecha inicial');
			} else if (!fecha2) {
				Swal.fire('Debe de seleccionar una fecha inicial y una fecha final');
			}
		} else if (!fecha2) {
			Swal.fire('Debe de seleccionar una fecha final');
		} else if (fecha1 > fecha2) {
			Swal.fire('La fecha inicial no puede ser mayor que la final');
		} else {
			if (a === 1) {
				if (!!solQuerys) {
					for (let index = 0; index < solQuerys.length; index++) {
						try {
							const data = await fetch(
								process.env.REACT_APP_DEV +
									`/pdfOrden/${solQuerys[index].Folio_Completo}`,
								{
									method: 'GET',
									headers: { 'Content-Type': 'application/pdf' },
									responseType: 'blob',
								}
							);
							const res = await data.blob();
							saveAs(res, `Orden ${solQuerys[index].Folio_Completo}`);
						} catch (error) {
							console.log(error);
							console.log('PDF ni idea');
						}
					}
				}
			} else if (a === 2) {
				if (!!solTerminadasQuerys) {
					for (let index = 0; index < solTerminadasQuerys.length; index++) {
						try {
							const data = await fetch(
								process.env.REACT_APP_DEV +
									`/pdfOrden/${solTerminadasQuerys[index].Folio_Completo}`,
								{
									method: 'GET',
									headers: { 'Content-Type': 'application/pdf' },
									responseType: 'blob',
								}
							);
							const res = await data.blob();
							saveAs(res, `Orden ${solTerminadasQuerys[index].Folio_Completo}`);
						} catch (error) {
							console.log(error);
							console.log('PDF ni idea');
						}
					}
				}
			}
		}
	};

	const paginar = (pageNumber) => setCurrentPage(pageNumber);

	useEffect(() => {
		getSolicitudes();
		getAreas();
		getPeriodos();
		getUsers();
		handleId();
	}, [setCargando, setAreas, setPeriodos, setUsers, role, a]);

	useEffect(() => {
		if (a === 1) {
			if (!!q && !!solQuerys) {
				setcurrentPosts(solQuerys.slice(firstPost, lastPost));
			} else if (!!solicitudes) {
				setcurrentPosts(solicitudes.slice(firstPost, lastPost));
			}
		} else if (a === 2) {
			if (!!q && !!solTerminadasQuerys) {
				setcurrentPosts(solTerminadasQuerys.slice(firstPost, lastPost));
			} else if (!!solicitudesTerm) {
				setcurrentPosts(solicitudesTerm.slice(firstPost, lastPost));
			}
		}
	}, [
		solQuerys,
		solTerminadasQuerys,
		solicitudes,
		solicitudesTerm,
		currentPage,
		formik.values.postPerPage,
		a,
	]);

	useEffect(() => {
		setSolicitudes('');
		setSolicitudesTerm('');
		setSolTerminadasQuerys('');
		setsolQuerys('');
	}, [a]);

	useEffect(() => {
		setCurrentPage(1);
	}, [formik.values.postPerPage]);

	return (
		<>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Solicitudes</h1>
			</div>
			<div className='d-flex m-3 mx-5 justify-content-around'>
				<div>
					<h3 className=''>Periodo actual: {periodo}</h3>
				</div>

				<div>
					<button className='btn btn-primary mx-2' onClick={() => setA(1)}>
						En proceso
					</button>
					<button className='btn btn-primary mx-2' onClick={() => setA(2)}>
						Terminadas
					</button>
				</div>
			</div>
			{(role === 1 || role === 3) && (
				<>
					<div className='d-flex'>
						<div className='w-50'>
							<h4 className='mx-5'>
								<button
									className='border-0 bg-transparent m-2'
									onClick={() => verQuery()}
								>
									Filtrar
									{mostrarQ ? (
										<IconContext.Provider value={{ size: '30' }}>
											<BsChevronUp />
										</IconContext.Provider>
									) : (
										<IconContext.Provider value={{ size: '30' }}>
											<BsChevronDown />
										</IconContext.Provider>
									)}
								</button>
								<IconContext.Provider value={{ size: '30' }}>
									<button
										className='border-0 bg-transparent m-2'
										onClick={() => elimQuery()}
										title='Eliminar filtros'
									>
										<BsFillEraserFill />
									</button>
								</IconContext.Provider>
							</h4>
						</div>
						<div className='d-flex w-50 mx-5 justify-content-end align-items-center'>
							<label className='mx-2 align-content-center' for='postPerPage'>
								Filas a ver:
							</label>
							<select
								name='postPerPage'
								className='form-select w-auto '
								value={formik.values.postPerPage}
								onChange={formik.handleChange}
							>
								<option value={10}>10</option>
								<option value={20}>20</option>
								<option value={30}>30</option>
								<option value={40}>40</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
							</select>
						</div>
					</div>
					<form onSubmit={formik.handleSubmit}>
						{!!mostrarQ && (
							<div className='mx-5 p-1 rounded border bg-blue animate__animated animate__fadeIn'>
								<div className='m-3 row text-white'>
									<div className='m-2 col-sm'>
										<label className=''>Periodo:</label>
										<select
											className='form-control'
											name='idPeriodo'
											value={formik.values.idPeriodo}
											onChange={formik.handleChange}
										>
											<option value=''>---</option>
											{!!periodos &&
												periodos.map((p) => {
													return (
														<option key={p.idPeriodo} value={p.idPeriodo}>
															{p.Periodo}
														</option>
													);
												})}
										</select>
									</div>
									<div className='m-2 col-sm'>
										<label className=''>RFC:</label>
										<input
											className='form-control'
											name='RFC'
											value={formik.values.RFC}
											onChange={formik.handleChange}
										></input>
									</div>
									<div className='m-2 col-sm'>
										<label className=''>Nombres:</label>
										<input
											className='form-control'
											name='Nombres'
											value={formik.values.Nombres}
											onChange={formik.handleChange}
										></input>
									</div>
								</div>
								<div className='m-3 row text-white'>
									<div className='m-2 col-sm'>
										<label className=''>Area:</label>
										<select
											className='form-control'
											name='Clave_Area'
											value={formik.values.Clave_Area}
											onChange={formik.handleChange}
										>
											<option value=''>---</option>
											{!!areas &&
												areas.map((a) => {
													return (
														<option key={a.Clave_Area} value={a.Clave_Area}>
															{a.Nombre}
														</option>
													);
												})}
										</select>
									</div>
									<div className='m-2 col-sm'>
										<label className=''>Folio:</label>
										<input
											type='number'
											className='form-control'
											name='Folio'
											value={formik.values.Folio}
											onChange={formik.handleChange}
										></input>
									</div>
									<div className='m-2 col-sm'>
										<label className=''>Asignado a:</label>
										<select
											className='form-control'
											name='Asignado_a'
											value={formik.values.Asignado_a}
											onChange={formik.handleChange}
										>
											<option value=''>---</option>
											{!!users &&
												users.map((a) => {
													return (
														<option key={a.RFC} value={a.Nombres}>
															{a.Nombres}
														</option>
													);
												})}
										</select>
									</div>
								</div>
								<div className='m-3 row text-white'>
									<div className='m-2 col-sm'>
										<label className=''>Fecha Inicial:</label>
										<Datepicker
											className='form-control'
											selected={fecha1}
											onChange={(date) => setFecha1(date)}
											dateFormat='dd/MM/yyyy'
										/>
									</div>
									<div className='m-2 col-sm'>
										<label className=''>Fecha Final:</label>
										<Datepicker
											className='form-control'
											selected={fecha2}
											onChange={(date) => setFecha2(date)}
											dateFormat='dd/MM/yyyy'
										/>
									</div>
									<div className='m-2 col-sm'>
										<button type='submit' className='btn btn-primary m-2'>
											Buscar
										</button>
										<button
											type='button'
											className='btn btn-primary m-2'
											onClick={() => descargarVarias()}
										>
											Descargar Solicitudes
										</button>
										<button
											type='button'
											className='btn btn-primary m-2'
											onClick={() => descargarVariasOrd()}
										>
											Descargar Ordenes
										</button>
									</div>
								</div>
							</div>
						)}
					</form>
				</>
			)}
			{role === 2 && (
				<div className='d-flex mx-5 justify-content-end align-items-center'>
					<label className='mx-2 align-content-center' for='postPerPage'>
						Filas a ver:
					</label>
					<select
						name='postPerPage'
						className='form-select w-auto '
						value={formik.values.postPerPage}
						onChange={formik.handleChange}
					>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={30}>30</option>
						<option value={40}>40</option>
						<option value={50}>50</option>
						<option value={100}>100</option>
					</select>
				</div>
			)}

			{!!solicitudes && a === 1 && (
				<>
					<TablaSolicitudes solicitudes={currentPosts} cargando={cargando} />
					<Paginacion
						postPerPage={parseInt(formik.values.postPerPage)}
						totalPosts={!!q ? solQuerys.length : solicitudes.length}
						paginar={paginar}
					/>
				</>
			)}
			{!!solicitudesTerm && a === 2 && (
				<>
					<TablaTerminadas solicitudes={currentPosts} cargando={cargando} />
					<Paginacion
						postPerPage={parseInt(formik.values.postPerPage)}
						totalPosts={
							!q ? solicitudesTerm.length : solTerminadasQuerys.length
						}
						paginar={paginar}
					/>
				</>
			)}
		</>
	);
};
