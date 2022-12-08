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

	const [solicitudes, setSolicitudes] = useState([]);
	const [solicitudesTerm, setSolicitudesTerm] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [postPerPage] = useState(10);
	const [currentPosts, setcurrentPosts] = useState();
	const [cargando, setCargando] = useState();
	const lastPost = currentPage * postPerPage;
	const firstPost = lastPost - postPerPage;

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
	};

	const formik = useFormik({
		initialValues: {
			idPeriodo: '',
			RFC: '',
			Nombres: '',
			Clave_Area: '',
			Folio_Completo: '',
			Asignado_a: '',
			Fecha_inicial: '',
			Fecha_final: '',
		},
		validate: (values) => {
			let errors;

			if (!!values.Fecha_inicial) {
				if (!values.Fecha_final) {
					errors.Fecha_final = 'Debe de seleccionar una fecha final';
				}
			}

			if (!!values.Fecha_final) {
				if (!values.Fecha_inicial) {
					errors.Fecha_inicial = 'Debe de seleccionar una fecha final';
				}
			}

			if (!!values.Fecha_inicial) {
				if (!!values.Fecha_final) {
					if (values.Fecha_inicial > values.Fecha_final) {
						errors.Fecha_final =
							'La fecha final no puede ser antes que la fecha inicial';
					}
				}
			}

			return errors;
		},
		onSubmit: async (values) => {
			setCargando(true);
			if (
				!values.idPeriodo &&
				!values.RFC &&
				!values.Nombres &&
				!values.Clave_Area &&
				!values.Folio_Completo &&
				!values.Asignado_a &&
				!values.Fecha_inicial &&
				!values.Fecha_final
			) {
				setq(false);
			}
			try {
				if (a === 1) {
					const getSol = await fetch(
						'http://localhost:4000/solicitudes/query',
						{
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								idPeriodo: values.idPeriodo,
								RFC: values.RFC,
								Nombre_Solicitante: values.Nombres,
								Clave_Area: values.Clave_Area,
								Folio_Completo: values.Folio_Completo,
								Asignado_a: values.Asignado_a,
								Fecha_inicial: values.Fecha_inicial,
								Fecha_final: values.Fecha_final,
							}),
						}
					);
					const resSol = await getSol.json();
					setq(true);
					setsolQuerys(resSol);
				} else if (a === 2) {
					const getSolTerminadas = await fetch(
						'http://localhost:4000/solicitudes/terminadas/query',
						{
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								idPeriodo: values.idPeriodo,
								RFC: values.RFC,
								Nombre_Solicitante: values.Nombres,
								Clave_Area: values.Clave_Area,
								Folio_Completo: values.Folio_Completo,
								Asignado_a: values.Asignado_a,
								Fecha_inicial: values.Fecha_inicial,
								Fecha_final: values.Fecha_final,
							}),
						}
					);
					const resSolTerminadas = await getSolTerminadas.json();
					setq(true);
					setSolTerminadasQuerys(resSolTerminadas);
				}

				setCargando(false);
			} catch (error) {
				console.log('No se pudieron cargar las solicitudes');
				console.log(error);
			}
		},
	});

	const getPeriodos = async () => {
		try {
			const data = await fetch('http://localhost:4000/periodos');
			const res = await data.json();
			!!res && setPeriodos(res);
		} catch (error) {
			console.log('Error al cargar periodos');
			console.log(error);
		}
	};

	const getAreas = async () => {
		try {
			const data = await fetch('http://localhost:4000/areas');
			const res = await data.json();
			!!res && setAreas(res);
		} catch (error) {
			console.log('Error al cargar areas');
			console.log(error);
		}
	};

	const getUsers = async () => {
		try {
			const data = await fetch('http://localhost:4000/admins');
			const res = await data.json();
			!!res && setUsers(res);
		} catch (error) {
			console.log('Error al cargar usuarios');
			console.log(error);
		}
	};
	const getSolicitudes = async () => {
		setCargando(true);
		try {
			//get idPeriodo
			const dataConf = await fetch(`http://localhost:4000/configs`);
			const resC = await dataConf.json();
			if (!!resC) {
				const dataPeriodo = await fetch(
					`http://localhost:4000/periodo/${resC[1].Valor}`
				);
				const resP = await dataPeriodo.json();
				//get periodo
				!!resP && setPeriodo(resP[0].Periodo);
			}
			//getSolicitudes del periodo
			if (!!role) {
				if (role == 2) {
					if (a === 1) {
						const valid = await fetch(
							`http://localhost:4000/solicitudRFC/${RFC}`
						);
						const res = await valid.json();
						setSolicitudes(res);
					} else if (a === 2) {
						////////////////////////////////////////////////////////////
						//poner las terminadas por rfc para clientes
						const valid = await fetch(
							`http://localhost:4000/solicitudRFC/term/${RFC}`
						);
						const res = await valid.json();
						setSolicitudesTerm(res);
					}
				} else {
					if (a === 1) {
						const getSol = await fetch('http://localhost:4000/solicitudes', {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								idPeriodo: !!resC && resC[1].Valor,
							}),
						});
						const resSol = await getSol.json();
						setSolicitudes(resSol);
					} else if (a === 2) {
						const getSol = await fetch(
							'http://localhost:4000/solicitudes/terminadas',
							{
								method: 'PUT',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									idPeriodo: !!resC && resC[1].Valor,
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
			console.log('No se pudieron cargar las solicitudes');
			console.log(error);
		}
	};

	const paginar = (pageNumber) => setCurrentPage(pageNumber);

	useEffect(() => {
		getSolicitudes();
		getAreas();
		getPeriodos();
		getUsers();
		handleId();
	}, [setCargando, setAreas, setPeriodos, setUsers, role]);

	useEffect(() => {
		if (a === 1) {
			if (q && !!solQuerys) {
				setcurrentPosts(solQuerys.slice(firstPost, lastPost));
			} else if (!!solicitudes) {
				setcurrentPosts(solicitudes.slice(firstPost, lastPost));
			}
		} else if (a === 2) {
			if (q && !!solTerminadasQuerys) {
				setcurrentPosts(solTerminadasQuerys.slice(firstPost, lastPost));
			} else if (!!solicitudesTerm) {
				setcurrentPosts(solicitudesTerm.slice(firstPost, lastPost));
			}
		}
	}, [solQuerys, solTerminadasQuerys, solicitudes, currentPage]);

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
					<h4 className='mx-5'>
						Filtrar
						{mostrarQ ? (
							<IconContext.Provider value={{ size: '30' }}>
								<button
									className='border-0 bg-transparent m-2'
									onClick={() => verQuery()}
								>
									<BsChevronUp />
								</button>
							</IconContext.Provider>
						) : (
							<IconContext.Provider value={{ size: '30' }}>
								<button
									className='border-0 bg-transparent m-2'
									onClick={() => verQuery()}
								>
									<BsChevronDown />
								</button>
							</IconContext.Provider>
						)}
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
											className='form-control'
											name='Folio_Completo'
											value={formik.values.Folio_Completo}
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
										<input className='form-control'></input>
									</div>
									<div className='m-2 col-sm'>
										<label className=''>Fecha Final:</label>
										<input className='form-control'></input>
									</div>
									<div className='m-2 col-sm'>
										<button type='submit' className='btn btn-primary m-2'>
											Buscar
										</button>
										<button type='button' className='btn btn-primary m-2'>
											Descargar Solicitudes
										</button>
									</div>
								</div>
							</div>
						)}
					</form>
				</>
			)}

			{!!solicitudes && a === 1 ? (
				<>
					<TablaSolicitudes solicitudes={currentPosts} cargando={cargando} />
					<Paginacion
						postPerPage={postPerPage}
						totalPosts={solicitudes.length}
						paginar={paginar}
					/>
				</>
			) : (
				<>
					<TablaTerminadas solicitudes={currentPosts} cargando={cargando} />
					<Paginacion
						postPerPage={postPerPage}
						totalPosts={solicitudes.length}
						paginar={paginar}
					/>
				</>
			)}
		</>
	);
};
