import { useEffect } from 'react';
import { useState } from 'react';
import { Paginacion } from '../Extras/Paginacion';
import { TablaUsuarios } from './TablaUsuarios';
import { NavLink } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useFormik } from 'formik';
import { IconContext } from 'react-icons';
import { BsChevronDown, BsChevronUp, BsFillEraserFill } from 'react-icons/bs';
import { NotificationManager } from 'react-notifications';
import Swal from 'sweetalert2';

export const Usuarios = () => {
	const [users, setUsers] = useState([]);
	const [usersQuery, setUsersQuery] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [postPerPage] = useState(10);
	const [currentPosts, setcurrentPosts] = useState();
	const [cargando, setCargando] = useState(false);
	const [q, setq] = useState(false);
	const [mostrarQ, setMostrarQ] = useState(false);

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
		setUsersQuery();
		formik.setFieldValue('Nombres', '');
		formik.setFieldValue('RFC', '');
		formik.setFieldValue('id_Usuario', '');
		setq(false);
	};

	const formik = useFormik({
		initialValues: {
			RFC: '',
			Nombres: '',
			id_Usuario: '',
		},
		validate: (values) => {},
		onSubmit: async (values) => {
			setCargando(true);
			if (!values.RFC && !values.Nombres && !values.id_Usuario) {
				setq(false);
			}
			if (!cargando) {
				try {
					const getSol = await fetch('http://localhost:4000/usuario/query', {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							RFC: values.RFC,
							Nombres: values.Nombres,
							id_Usuario: values.id_Usuario,
						}),
					});
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

	const getUsers = async () => {
		setCargando(true);
		try {
			const data = await fetch('http://localhost:4000/usuarios');
			const res = await data.json();
			!!res && setUsers(res);
			setCargando(false);
		} catch (error) {
			setCargando(false);
			NotificationManager.warning(
				'Hubo un error al descargar los usuarios',
				'Error',
				3000
			);
			console.log('trono users');
			console.log(error);
		}
	};

	const paginar = (pageNumber) => setCurrentPage(pageNumber);

	useEffect(() => {
		getUsers();
		handleId();
	}, [setCargando]);

	useEffect(() => {
		if (!!q && !!usersQuery) {
			setcurrentPosts(usersQuery.slice(firstPost, lastPost));
		} else if (!!users) {
			setcurrentPosts(users.slice(firstPost, lastPost));
		}
	}, [users, usersQuery, currentPage]);

	return (
		<>
			<div className='m-3'>
				<NavLink
					className='btn btn-primary btn-lg mx-5 float-end'
					to='/nuevo_usuario'
				>
					Nuevo
				</NavLink>
				<h1 className='d-flex justify-content-center'>Usuarios</h1>
			</div>

			{(role === 1 || role === 3) && (
				<>
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
											onBlur={formik.handleBlur}
										></input>
									</div>
									<div className='m-2 col-sm'>
										<label className=''>Nombres:</label>
										<input
											className='form-control'
											name='Nombres'
											value={formik.values.Nombres}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										></input>
									</div>
									<div className='m-2 col-sm'>
										<label className=''>Tipo de Usuario:</label>
										<select
											className='form-control'
											name='id_Usuario'
											value={formik.values.id_Usuario}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										>
											<option value={''}>---</option>
											<option value={1}>Admin</option>
											<option value={2}>Cliente</option>
										</select>
									</div>
								</div>
								<div className='m-3 row text-white'></div>
								<div className='m-3 row text-white'>
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

			<TablaUsuarios users={currentPosts} cargando={cargando} />
			<Paginacion
				postPerPage={postPerPage}
				totalPosts={!!q ? usersQuery.length : users.length}
				paginar={paginar}
			/>
		</>
	);
};
