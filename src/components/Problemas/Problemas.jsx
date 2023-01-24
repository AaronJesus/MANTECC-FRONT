import { useEffect } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Paginacion } from '../Extras/Paginacion';
import { TablaProblemas } from './TablaProblemas';
import jwtDecode from 'jwt-decode';
import { useFormik } from 'formik';
import { IconContext } from 'react-icons';
import { BsChevronDown, BsChevronUp, BsFillEraserFill } from 'react-icons/bs';
import Swal from 'sweetalert2';
import { NotificationManager } from 'react-notifications';

export const Problemas = () => {
	const [prob, setProb] = useState([]);
	const [probQuery, setProbQuery] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPosts, setcurrentPosts] = useState();
	const [cargando, setCargando] = useState(false);
	const [q, setq] = useState(false);
	const [mostrarQ, setMostrarQ] = useState(false);

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
		setProbQuery();
		formik.setFieldValue('Descripcion', '');
		formik.setFieldValue('Tipo', '');
		setq(false);
	};

	const formik = useFormik({
		initialValues: {
			Descripcion: '',
			Tipo: '',
			postPerPage: 10,
		},
		validate: (values) => {
			let errors;

			return errors;
		},
		onSubmit: async (values) => {
			setCargando(true);
			if (!values.Descripcion && !values.Tipo) {
				setq(false);
			}
			if (!cargando) {
				try {
					const getSol = await fetch('http://localhost:4000/problema/query', {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							Descripcion: values.Descripcion,
							Tipo: values.Tipo,
						}),
					});
					const resSol = await getSol.json();
					setProbQuery(resSol);
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
			const data = await fetch('http://localhost:4000/problemas');
			const res = await data.json();
			setProb(res);
			setCargando(false);
		} catch (error) {
			NotificationManager.warning(
				'Hubo un error al descargar los problemas',
				'Error',
				3000
			);
			setCargando(false);
			console.log(error);
			console.log('Cant get data');
		}
	};

	const paginar = (pageNumber) => setCurrentPage(pageNumber);

	useEffect(() => {
		getData();
		handleId();
	}, [setCargando]);

	useEffect(() => {
		if (!!q && !!probQuery) {
			setcurrentPosts(probQuery.slice(firstPost, lastPost));
		} else if (!!prob) {
			setcurrentPosts(prob.slice(firstPost, lastPost));
		}
	}, [prob, probQuery, currentPage, formik.values.postPerPage]);

	return (
		<>
			<div className='m-3'>
				<NavLink
					className='btn btn-primary btn-lg mx-5 float-end'
					to='/editar_problemas'
				>
					Nuevo
				</NavLink>
				<h1 className='d-flex justify-content-center'>Problemas</h1>
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
										<label className=''>Descripcion:</label>
										<input
											className='form-control'
											name='Descripcion'
											value={formik.values.Descripcion}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										></input>
									</div>
									<div className='m-2 col-sm'>
										<label className=''>Tipo de Problema:</label>
										<select
											className='form-control'
											name='Tipo'
											value={formik.values.Tipo}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										>
											<option value={''}>---</option>
											<option value={'Admin'}>Admin</option>
											<option value={'Cliente'}>Cliente</option>
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

			<TablaProblemas prob={currentPosts} cargando={cargando} />
			<Paginacion
				postPerPage={parseInt(formik.values.postPerPage)}
				totalPosts={!!q ? probQuery.length : prob.length}
				paginar={paginar}
			/>
		</>
	);
};
