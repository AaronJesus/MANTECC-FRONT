import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Moment from 'moment';
import ith_logo from '../../assets/ith_logo.jpg';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IconContext } from 'react-icons';
import { useFormik } from 'formik';

export const VerOrden = () => {
	const [date, setDate] = useState('');
	const [vals, setVals] = useState();
	const [verEdit, setVerEdit] = useState(false);
	const [verSug, setVerSug] = useState(false);
	const [numC, setNumC] = useState();
	const [nuevoC, setNuevoC] = useState();
	const [prob, setProb] = useState();
	const [rev, setRev] = useState();

	const { id } = useParams();

	const getRev = async () => {
		try {
			//3 es el numero de la revision
			const dataConf = await fetch(`http://localhost:4000/configs`);
			const resC = await dataConf.json();
			!!resC && setRev(resC[2]);
			!!resC && setNumC(resC[0].Valor);
			!!resC && setNuevoC(parseInt(resC[0].Valor) + 1);
		} catch (error) {
			console.log(error);
			console.log('Trono get Data');
		}
	};

	const getProb = async () => {
		try {
			const data = await fetch('http://localhost:4000/problemasAdmin');
			const res = await data.json();
			!!res && setProb(res);
		} catch (error) {
			console.error('Cant get prob ' + error);
		}
	};

	const getDatos = async () => {
		try {
			const data = await fetch(`http://localhost:4000/orden/${id}`);
			const res = await data.json();
			if (!!res[0]) {
				setVals(res[0]);
				res[0].Fecha_Realizacion &&
					setDate(
						new Date(
							res[0].Fecha_Realizacion.replace(/-/g, '/').replace(/T.+/, '')
						)
					);
				formik.setFieldValue('Asignado_a', res[0].Asignado_a);
				if (res[0].Mantenimiento_Interno === true) {
					formik.setFieldValue('Mantenimiento_Interno', 1);
				} else {
					formik.setFieldValue('Mantenimiento_Interno', 0);
				}

				formik.setFieldValue('Trabajo_Realizado', res[0].Trabajo_Realizado);
				formik.setFieldValue('Tipo_Servicio', res[0].Tipo_Servicio);
				formik.setFieldValue('No_Control', res[0].No_Control);
			}
		} catch (error) {
			console.error('Cant get data ' + error);
		}
	};

	const handleVerSug = () => {
		setVerSug(!verSug);
	};

	const handleVerEdit = () => {
		setVerEdit(!verEdit);
	};

	const handleCancel = () => {
		setVerEdit(!verEdit);
		setDate('');
	};

	const formik = useFormik({
		initialValues: {
			Asignado_a: '',
			Mantenimiento_Interno: '',
			Tipo_Servicio: '',
			Trabajo_Realizado: '',
			Fecha_Realizacion: '',
			No_Control: '',
			ProblemaCheck: '',
		},
		validate: (values) => {
			const errors = {};
			//si ponen una fecha deben de poner el trabajo
			if (!!date) {
				//revisa si eligieron de las sugerencias , si escribieron el problema o ambas
				if (!!values.ProblemaCheck || !!values.Trabajo_Realizado) {
					if (
						!!values.ProblemaCheck &&
						values.ProblemaCheck.length === 0 &&
						!values.Trabajo_Realizado
					) {
						errors.Trabajo_Realizado = 'Debe de ingresar el trabajo realizado';
					}
				} else {
					errors.Trabajo_Realizado = 'Debe de ingresar el trabajo realizado';
				}
			}

			if (!!values.Trabajo_Realizado || !!values.ProblemaCheck) {
				if (!!values.ProblemaCheck) {
					if (values.ProblemaCheck.length !== 0) {
						if (!date) {
							errors.Fecha_Realizacion =
								'Debe de ingresar la fecha del trabajo';
						}
					} else if (values.ProblemaCheck.length === 0) {
						if (!!values.Trabajo_Realizado) {
							if (!date) {
								errors.Fecha_Realizacion =
									'Debe de ingresar la fecha del trabajo';
							}
						}
					}
				} else {
					if (!date) {
						errors.Fecha_Realizacion = 'Debe de ingresar la fecha del trabajo';
					}
				}
			}

			if (!values.Asignado_a) {
				errors.Asignado_a = 'La orden debe de estar asignada a alguien';
			}

			if (!values.Tipo_Servicio) {
				errors.Tipo_Servicio = 'La orden debe de tener un tipo de servicio';
			}
			return errors;
		},
		onSubmit: async (values) => {
			let req;
			if (!!values.ProblemaCheck) {
				if (!!values.ProblemaCheck.length === 0) {
					req = formik.values.Trabajo_Realizado;
				} else if (!!values.Trabajo_Realizado) {
					req =
						formik.values.ProblemaCheck.join(', ') +
						' ' +
						formik.values.Trabajo_Realizado;
				} else {
					req = formik.values.ProblemaCheck.join(', ');
				}
			} else if (!!values.Trabajo_Realizado) {
				req = formik.values.Trabajo_Realizado;
			}
			try {
				if (!formik.values.No_Control) {
					const data = await fetch(`http://localhost:4000/orden/${id}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							Trabajo_Realizado: req,
							Mantenimiento_Interno: parseInt(
								formik.values.Mantenimiento_Interno
							),
							Tipo_Servicio: formik.values.Tipo_Servicio,
							Asignado_a: formik.values.Asignado_a,
							Fecha_Realizacion: date,
							No_Control: !!numC && numC,
						}),
					});
					await data.json();
					const NumC = await fetch(`http://localhost:4000/config/1`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							idConfig: '1',
							Valor: !!nuevoC && nuevoC.toString(),
						}),
					});
					await NumC.json();
				} else {
					const data = await fetch(`http://localhost:4000/orden/${id}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							Trabajo_Realizado: req,
							Mantenimiento_Interno: parseInt(
								formik.values.Mantenimiento_Interno
							),
							Tipo_Servicio: formik.values.Tipo_Servicio,
							Asignado_a: formik.values.Asignado_a,
							Fecha_Realizacion: date,
							No_Control: formik.values.No_Control,
						}),
					});
					await data.json();
				}
				setVerEdit(!verEdit);
				window.alert('Liston');
			} catch (error) {
				window.alert('Trono krnal');
				setVerEdit(!verEdit);
				console.log(error);
			}
		},
	});

	useEffect(() => {
		getDatos();
		getRev();
		getProb();
	}, [setRev, setNumC, setNuevoC]);

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<div className='d-flex m-3 justify-content-center'>
					<h1>Ver Orden</h1>
				</div>
				<div className='container bg-white pb-5 border border-dark'>
					<div className='container'>
						<table className='table text-center table-bordered border-dark align-middle m-3'>
							<thead></thead>
							<tbody>
								<tr>
									<th scope='col' rowSpan={2}>
										<img
											src={ith_logo}
											style={{ width: 80, height: 80 }}
											alt='Logo'
										/>
									</th>
									<th scope='col'>
										Formato para Orden de Trabajo de Mantenimiento
									</th>
									<th scope='col'>Codigo: ITH-AD-PO-001-04</th>
								</tr>
								<tr>
									<th scope='col'>
										Referencia al punto de la norma ISO 9001:2015 7.1.3, 8.4
									</th>
									<th scope='col'>Revision: {!!rev && rev.Valor}</th>
								</tr>
							</tbody>
						</table>
						<div className='d-flex m-3 justify-content-center'>
							<h4>ORDEN DE TRABAJO DE MANTENIMIENTO</h4>
						</div>
						<div className='d-flex justify-content-end m-3 my-0'>
							<label>Numero de control:</label>
							<div className='d-flex px-3 mx-0 border-bottom border-dark'>
								{!!formik.values.No_Control && formik.values.No_Control}
							</div>
						</div>
						<div>
							<div className='d-flex m-3 mb-0 border border-dark'>
								<label className='col-4 m-3 col-form-label'>
									Mantenimiento:
								</label>
								<div className='d-flex' onChange={formik.handleChange}>
									<div className='form-check m-3'>
										<input
											className='form-check-input'
											type='radio'
											name='Mantenimiento_Interno'
											checked={formik.values.Mantenimiento_Interno == 1}
											value={1}
											disabled={!verEdit}
										/>
										<label
											className='form-check-label'
											htmlFor='flexRadioDefault1'
										>
											Interno
										</label>
									</div>
									<div className='form-check m-3'>
										<input
											className='form-check-input'
											type='radio'
											name='Mantenimiento_Interno'
											checked={formik.values.Mantenimiento_Interno == 0}
											value={0}
											disabled={!verEdit}
										/>
										<label
											className='form-check-label'
											htmlFor='flexRadioDefault2'
										>
											Externo
										</label>
									</div>
								</div>
							</div>
							<div className='d-flex m-3 my-0 border-top-0 border border-dark'>
								<label className=' col-4 m-3 mb-0 col-form-label'>
									Tipo de servicio:
								</label>
								<input
									type='text'
									className=' form-control m-3 w-75'
									name='Tipo_Servicio'
									value={formik.values.Tipo_Servicio}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!verEdit}
								/>
								{!!formik.touched.Tipo_Servicio &&
									!!formik.errors.Tipo_Servicio && (
										<label className='text-danger mx-3 w-50'>
											*{formik.errors.Tipo_Servicio}
										</label>
									)}
							</div>
							<div className='d-flex m-3 my-0 border-top-0 border border-dark'>
								<label className='col-4 m-3 col-form-label'>Asignado a:</label>
								<input
									className='w-25 m-3 form-control'
									disabled={!verEdit}
									name='Asignado_a'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.Asignado_a}
								/>
								{/* <select className='w-25 m-3 form-control' disabled={!verEdit}>
								<option>Ray Nuztas</option>
								<option>Alumno Servicio 1</option>
								<option>Alumno Servicio 2</option>
							</select> */}
								{!!formik.touched.Asignado_a && !!formik.errors.Asignado_a && (
									<label className='text-danger mx-3 w-50'>
										*{formik.errors.Asignado_a}
									</label>
								)}
							</div>
							<div className='d-flex m-3 mb-0 border border-dark'>
								<label className='col-4 m-3 col-form-label'>
									Fecha de realizacion:
								</label>
								{verEdit ? (
									<Datepicker
										className='col-2 m-3 form-control w-50'
										selected={date}
										onChange={(date) => setDate(date)}
										dateFormat='dd/MM/yyyy'
									/>
								) : (
									<label className='col-4 m-3 col-form-label'>
										{!!date ? Moment(date).format('DD/MM/YYYY') : '---'}
									</label>
								)}
								{!!formik.errors.Fecha_Realizacion && (
									<label className='text-danger mx-3 w-50'>
										*{formik.errors.Fecha_Realizacion}
									</label>
								)}
							</div>
							<div className='m-3 my-0 border-top-0 border border-dark'>
								<label className='m-3 mb-0 col-form-label'>
									Trabajo Realizado:
								</label>
								<div></div>
								{verEdit && (
									<>
										<div className='m-3 my-0'>
											<button
												className='border-0 bg-transparent my-2'
												type='button'
												onClick={() => handleVerSug()}
											>
												Sugerencias
												{verSug ? (
													<IconContext.Provider value={{ size: '20' }}>
														<IoIosArrowUp />
													</IconContext.Provider>
												) : (
													<IconContext.Provider value={{ size: '20' }}>
														<IoIosArrowDown />
													</IconContext.Provider>
												)}
												<label className='mx-2 text-secondary'>
													(Opcional)
												</label>
											</button>
										</div>
										{verSug && (
											<>
												{!!prob &&
													prob.map((p) => {
														return (
															<div
																className='mx-3 w-25 form-check form-check-inline'
																key={p.idProblema}
															>
																<input
																	className='form-check-input'
																	type='checkbox'
																	name='ProblemaCheck'
																	value={p.Descripcion}
																	checked={formik.values.ProblemaCheck.includes(
																		p.Descripcion
																	)}
																	onChange={formik.handleChange}
																	onBlur={formik.handleBlur}
																/>
																<label className='form-check-label'>
																	{p.Descripcion}
																</label>
															</div>
														);
													})}
											</>
										)}
										<label className='my-0 m-3'>
											Especifique o escriba el trabajo.
										</label>
									</>
								)}
								<textarea
									className='form-control m-3 w-75'
									readOnly={!verEdit}
									name='Trabajo_Realizado'
									value={
										!!formik.values.Trabajo_Realizado
											? formik.values.Trabajo_Realizado
											: ''
									}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								></textarea>
								{!!formik.errors.Trabajo_Realizado && (
									<label className='text-danger mx-3 w-50'>
										*{formik.errors.Trabajo_Realizado}
									</label>
								)}
							</div>
						</div>
						<div className='m-3 my-0 border border-top-0 border-bottom-0 border-dark'>
							<label className='col-4 m-3 mb-0 col-form-label'>
								Calificacion del servicio:
							</label>
							<div className='d-flex ms-5'>
								<div className='form-check m-3'>
									<input
										className='form-check-input'
										type='radio'
										name='Calificacion_Servicio'
										value={10}
										checked={!!vals && vals.Calificacion_Servicio === 10}
										disabled
										id='flexRadioDefault1'
									/>
									<label
										className='form-check-label'
										htmlFor='flexRadioDefault1'
									>
										Excelente
									</label>
								</div>
								<div className='form-check m-3'>
									<input
										className='form-check-input'
										type='radio'
										name='Calificacion_Servicio'
										value={9}
										checked={!!vals && vals.Calificacion_Servicio === 9}
										disabled
										id='flexRadioDefault2'
									/>
									<label
										className='form-check-label'
										htmlFor='flexRadioDefault2'
									>
										Muy bien
									</label>
								</div>
								<div className='form-check m-3'>
									<input
										className='form-check-input'
										type='radio'
										name='Calificacion_Servicio'
										checked={!!vals && vals.Calificacion_Servicio === 8}
										value={8}
										disabled
										id='flexRadioDefault2'
									/>
									<label
										className='form-check-label'
										htmlFor='flexRadioDefault2'
									>
										Bueno
									</label>
								</div>
								<div className='form-check m-3'>
									<input
										className='form-check-input'
										type='radio'
										value={7}
										checked={!!vals && vals.Calificacion_Servicio === 7}
										disabled
										name='Calificacion_Servicio'
										id='flexRadioDefault2'
									/>
									<label
										className='form-check-label'
										htmlFor='flexRadioDefault2'
									>
										Regular
									</label>
								</div>
								<div className='form-check m-3'>
									<input
										className='form-check-input'
										type='radio'
										name='Calificacion_Servicio'
										value={6}
										checked={!!vals && vals.Calificacion_Servicio === 6}
										disabled
										id='flexRadioDefault2'
									/>
									<label
										className='form-check-label'
										htmlFor='flexRadioDefault2'
									>
										Malo
									</label>
								</div>
							</div>
						</div>
						<div className='m-3 my-0 border-top-0 border border-dark'>
							<label className='mb-0 m-3'>Comentarios del servicio:</label>
							<textarea
								className='form-control m-3 w-75'
								name='Comentario_Servicio'
								disabled
								value={
									!!vals && vals.Comentario_Servicio
										? vals.Comentario_Servicio
										: ''
								}
							></textarea>
						</div>
						<div className='d-inline-flex w-100'>
							<div className='d-flex ms-3 my-0 border-top-0 border border-dark w-50'>
								<label className='w-50 m-3 col-form-label'>
									Verificado y Liberado Por:
								</label>
								<label className='w-75 m-3 form-control'>
									{!!vals && vals.Liberado_Por}
								</label>
							</div>
							<div className='d-flex me-3 border-top-0 border border-dark w-50'>
								<label className='w-25 m-3 col-form-label'>
									Fecha y Firma:
								</label>
								<label className='w-75 m-3 form-control'>
									{!!date && Moment(date).format('DD/MM/YYYY')}
								</label>
							</div>
						</div>
						<div></div>
						<div className='d-inline-flex w-100'>
							<div className='d-flex ms-3 my-0 border-top-0 border border-dark w-50'>
								<label className='w-50 m-3 col-form-label'>Aprobado por:</label>
								<label className='w-75 m-3 form-control'>
									{!!vals && vals.Aprobado_Por}
								</label>
							</div>
							<div className='d-flex me-3 border-top-0 border border-dark w-50'>
								<label className='w-25 m-3 col-form-label'>
									Fecha y Firma:
								</label>
								<label className='w-75 m-3 form-control'>
									{!!date && Moment(date).format('DD/MM/YYYY')}
								</label>
							</div>
						</div>
					</div>
				</div>
				{(!!vals && vals.Calificacion_Servicio) ||
				!!formik.values.No_Control ? (
					''
				) : (
					<div className='container d-flex justify-content-center my-3'>
						{verEdit ? (
							<>
								<button
									className='btn btn-danger btn-lg m-2'
									onClick={() => handleCancel()}
									type='button'
								>
									Cancelar
								</button>
								<button className='btn btn-warning btn-lg m-2' type='submit'>
									Guardar
								</button>
							</>
						) : (
							<button
								className='btn btn-success btn-lg m-2'
								onClick={() => handleVerEdit()}
								type='button'
							>
								Editar
							</button>
						)}
					</div>
				)}
			</form>
		</>
	);
};
