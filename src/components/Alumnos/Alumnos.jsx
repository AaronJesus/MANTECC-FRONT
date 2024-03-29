import { useEffect } from 'react';
import { useState } from 'react';
import { Paginacion } from '../Extras/Paginacion';
import { TablaAlumnos } from './TablaAlumnos';
import { NavLink } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useFormik } from 'formik';
import { IconContext } from 'react-icons';
import { BsChevronDown, BsChevronUp, BsFillEraserFill } from 'react-icons/bs';
import Swal from 'sweetalert2';
import { NotificationManager } from 'react-notifications';

export const Alumnos = () => {
	const [users, setUsers] = useState([]);
	const [usersQuery, setUsersQuery] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPosts, setcurrentPosts] = useState();
	const [cargando, setCargando] = useState(false);
	const [q, setq] = useState(false);
	const [mostrarQ, setMostrarQ] = useState(false);
	const [carreras, setCarreras] = useState();

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

	const verQuery = () => {
		setMostrarQ(!mostrarQ);
	};

	const elimQuery = () => {
		setUsersQuery();
		formik.setFieldValue('Clave_Carrera', '');
		formik.setFieldValue('RFC', '');
		formik.setFieldValue('Nombres', '');
		formik.setFieldValue('No_Control', '');
		setq(false);
	};

	const formik = useFormik({
		initialValues: {
			RFC: '',
			Nombres: '',
			Clave_Carrera: '',
			No_Control: '',
			postPerPage: 10,
		},
		validate: (values) => {
			let errors;

			return errors;
		},
		onSubmit: async (values) => {
			setCargando(true);
			if (
				!values.RFC &&
				!values.Nombres &&
				!values.Clave_Carrera &&
				!values.No_Control
			) {
				setq(false);
			}
			if (!cargando) {
				try {
					const getSol = await fetch(
						process.env.REACT_APP_DEV + '/alumnos/query',
						{
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								RFC: values.RFC,
								Nombres: values.Nombres,
								Clave_Carrera: values.Clave_Carrera,
								No_Control: values.No_Control,
							}),
						}
					);
					const resSol = await getSol.json();
					setUsersQuery(resSol);
					setq(true);
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

	const getData = async () => {
		setCargando(true);
		try {
			const data = await fetch(process.env.REACT_APP_DEV + '/alumnos');
			const res = await data.json();
			const info = await fetch(process.env.REACT_APP_DEV + '/carreras');
			const resInfo = await info.json();
			!!resInfo && setCarreras(resInfo);
			!!res &&
				setUsers(
					res[0].sort(function (a, b) {
						if (a.Nombres.toLowerCase() < b.Nombres.toLowerCase()) {
							return -1;
						}
						if (a.Nombres.toLowerCase() > b.Nombres.toLowerCase()) {
							return 1;
						}
						return 0;
					})
				);
			setCargando(false);
		} catch (error) {
			NotificationManager.warning(
				'Hubo un error al descargar los alumnos o areas para filtrar',
				'Error',
				3000
			);
			setCargando(false);
			console.log('Trono get');
			console.log(error);
		}
	};

	const paginar = (pageNumber) => setCurrentPage(pageNumber);

	useEffect(() => {
		getData();
		handleId();
	}, [setCargando]);

	useEffect(() => {
		if (!!q && !!usersQuery) {
			setcurrentPosts(usersQuery.slice(firstPost, lastPost));
		} else if (!!users) {
			setcurrentPosts(users.slice(firstPost, lastPost));
		}
	}, [users, usersQuery, currentPage, formik.values.postPerPage]);

	useEffect(() => {
		setCurrentPage(1);
	}, [formik.values.postPerPage]);

	return (
		<>
			<div className='m-3'>
				<NavLink
					className='btn btn-primary btn-lg mx-5 float-end'
					to='/nuevo_alumno'
				>
					Nuevo
				</NavLink>
				<h1 className='d-flex justify-content-center'>Alumnos</h1>
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
										<label className=''>RFC:</label>
										<input
											className='form-control'
											name='RFC'
											value={formik.values.RFC}
											onChange={formik.handleChange}
										></input>
									</div>
									<div className='m-2 col-sm'>
										<label className=''># Control:</label>
										<input
											className='form-control'
											name='No_Control'
											value={formik.values.No_Control}
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
								<div className='m-3 row text-white'></div>
								<div className='m-3 row text-white'>
									<div className='m-2 col-sm'>
										<label className=''>Carrera:</label>
										<select
											className='form-control'
											name='Clave_Carrera'
											value={formik.values.Clave_Carrera}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										>
											<option value=''>---</option>
											{!!carreras &&
												carreras.map((a) => {
													return (
														<option
															key={a.Clave_Carrera}
															value={a.Clave_Carrera}
														>
															{a.Nombre}
														</option>
													);
												})}
										</select>
									</div>
									<div className='m-2 col-sm'>
										<button type='submit' className='btn btn-primary m-2'>
											Buscar
										</button>
									</div>
								</div>
							</div>
						)}
					</form>
				</>
			)}

			<TablaAlumnos users={currentPosts} cargando={cargando} />
			<Paginacion
				postPerPage={parseInt(formik.values.postPerPage)}
				totalPosts={!!q ? usersQuery.length : users.length}
				paginar={paginar}
			/>
		</>
	);
};
