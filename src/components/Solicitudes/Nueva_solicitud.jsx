import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IconContext } from 'react-icons';
import { useState, useEffect } from 'react';
import Moment from 'moment';
import ith_logo from '../../assets/ith_logo.jpg';
import { useFormik } from 'formik';
import jwtDecode from 'jwt-decode';
import Swal from 'sweetalert2';
import { NotificationManager } from 'react-notifications';
import { useNavigate } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';

export const NuevaSolicitud = () => {
	const [verSug, setVerSug] = useState(false);
	const formatDate = Moment().format('DD/MM/YYYY');
	const [areas, setAreas] = useState();
	const [prob, setProb] = useState();
	const [rev, setRev] = useState();
	const [submit, setsubmit] = useState(false);
	const [role, setrole] = useState();
	const nav = useNavigate();
	const token = sessionStorage.getItem('token');

	const handleId = () => {
		if (!!token) {
			const user = jwtDecode(token);

			if (!!user) {
				setrole(user.id_Usuario);
				formik.setFieldValue('RFC', user.RFC);
				formik.setFieldValue('Nombres', user.Nombres);
			}
		}
	};

	useEffect(() => {
		handleId();
	}, []);

	const handleVerSug = () => {
		setVerSug(!verSug);
	};

	const getAreas = async () => {
		try {
			const data = await fetch(process.env.REACT_APP_DEV + '/areas');
			const res = await data.json();
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
				'Error',
				3000
			);
			console.error('Get Areas ' + error);
		}
	};

	const getProb = async () => {
		try {
			const data = await fetch(process.env.REACT_APP_DEV + '/problemasCliente');
			const res = await data.json();
			!!res && setProb(res);
		} catch (error) {
			NotificationManager.warning(
				'No se pudieron cargar las sugerencias',
				'Error',
				3000
			);
			console.error('Cant get prob ' + error);
		}
	};
	const getRev = async () => {
		try {
			const dataConf = await fetch(process.env.REACT_APP_DEV + `/configs`);
			const resC = await dataConf.json();
			!!resC && formik.setFieldValue('idPeriodo', resC[0].Valor);
			!!resC && setRev(resC[1]); //el 3er campo es la revision
			!!resC && formik.setFieldValue('Asignado_a', resC[2].Valor); //el 4to es de asignado a
			!!resC && formik.setFieldValue('Aprobado_Por', resC[3].Valor); //el 5to es de Aprobado por
		} catch (error) {
			NotificationManager.warning(
				'Hubo un error al cargar ciertos campos',
				'Error',
				3000
			);
			console.log(error);
			console.log('Trono get Data');
		}
	};

	const formik = useFormik({
		initialValues: {
			idPeriodo: '',
			Nombres: '',
			RFC: '',
			Clave_Area: '',
			Fecha_Elaboracion: Moment().format('MM/DD/YYYY'),
			Descripcion_Servicio_Falla: '',
			Lugar_Especifico: '',
			Horario_Atencion: '',
			Asignado_a: '',
			Aprobado_Por: '',
			ProblemaCheck: '',
		},
		validate: (values) => {
			const errors = {};

			if (!values.ProblemaCheck) {
				if (!values.Descripcion_Servicio_Falla) {
					errors.Descripcion_Servicio_Falla =
						'Debe ingresar algun servicio a solicitar';
				}
			} else if (!!values.ProblemaCheck && values.ProblemaCheck.length === 0) {
				if (!values.Descripcion_Servicio_Falla) {
					errors.Descripcion_Servicio_Falla =
						'Debe ingresar algun servicio a solicitar';
				}
			}
			if (!values.Descripcion_Servicio_Falla) {
				if (!values.ProblemaCheck) {
					errors.Descripcion_Servicio_Falla =
						'Debe ingresar algun servicio a solicitar';
				} else if (
					!!values.ProblemaCheck &&
					values.ProblemaCheck.length === 0
				) {
					errors.Descripcion_Servicio_Falla =
						'Debe ingresar algun servicio a solicitar';
				}
			}

			if (!values.Clave_Area) {
				errors.Clave_Area = 'Debe de seleccionar una area';
			}

			if (!values.Lugar_Especifico) {
				errors.Lugar_Especifico =
					'Debe de poner un lugar especifico para encontrarlo';
			}

			if (!values.Horario_Atencion) {
				errors.Horario_Atencion = 'Debe de poner un horario de atencion';
			}

			return errors;
		},
		onSubmit: async (values) => {
			setsubmit(true);
			let req;
			if (!!values.ProblemaCheck) {
				if (!!values.ProblemaCheck.length === 0) {
					req = formik.values.Descripcion_Servicio_Falla;
				} else if (!!values.Descripcion_Servicio_Falla) {
					req =
						formik.values.ProblemaCheck.join(', ') +
						' ' +
						formik.values.Descripcion_Servicio_Falla;
				} else {
					req = formik.values.ProblemaCheck.join(', ');
				}
			} else if (!!values.Descripcion_Servicio_Falla) {
				req = formik.values.Descripcion_Servicio_Falla;
			}
			let work = req.slice(0, 200);
			if (!submit) {
				try {
					const data = await fetch(process.env.REACT_APP_DEV + '/solicitudes', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							idPeriodo: values.idPeriodo,
							RFC: values.RFC,
							Clave_Area: values.Clave_Area,
							Nombre_Solicitante: values.Nombres,
							Descripcion_Servicio_Falla: work,
							Fecha_Elaboracion: values.Fecha_Elaboracion,
							Lugar_Especifico: values.Lugar_Especifico,
							Horario_Atencion: values.Horario_Atencion,
							Asignado_a: values.Asignado_a,
							Aprobado_Por: values.Aprobado_Por,
						}),
					});
					await data.json();
					Swal.fire('Solicitud Enviada!');
					nav('/solicitudes');
					setsubmit(false);
				} catch (error) {
					setsubmit(false);
					Swal.fire('Hubo un error con la conexion al enviar la solicitud');
					console.error('Send solicitud ' + error);
				}
			}
		},
	});

	useEffect(() => {
		getAreas();
		getProb();
		getRev();
	}, [setRev, setProb]);

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<div className='container bg-white pb-5 border border-dark'>
					<div className='container'>
						<table className='table text-center table-bordered border-dark align-middle m-3 mx-0'>
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
										Formato para Solicitud de Mantenimiento Correctivo
									</th>
									<th scope='col'>Codigo: ITH-AD-PO-001-02</th>
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
							<h4>SOLICITUD DE MANTENIMIENTO CORRECTIVO</h4>
						</div>
						<div className='d-flex justify-content-end m-3'>
							<div className='d-flex m-3 mx-0 border border-dark'>
								<label className='px-3'>Centro de computo</label>
							</div>
							<div className='d-flex px-3 m-3 mx-0 border border-start-0 border-dark'>
								X
							</div>
						</div>
						<div className='d-flex justify-content-end m-3 my-0'>
							<label>Folio</label>
							<div className='d-flex px-3 m-3 mx-0 border-bottom border-dark'></div>
						</div>
						<div>
							<div className='d-flex m-3 border border-dark'>
								<label className='col-4 m-3 col-form-label'>
									Area Solicitante:
								</label>
								<select
									className='w-25 m-3 form-control'
									name='Clave_Area'
									id='Clave_Area'
									value={formik.values.Clave_Area}
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
								>
									<option value=''>Elegir Area</option>
									{!!areas &&
										areas.map((area) => {
											return (
												<option key={area.Clave_Area} value={area.Clave_Area}>
													{area.Nombre}
												</option>
											);
										})}
								</select>
							</div>
							{!!formik.touched.Clave_Area && !!formik.errors.Clave_Area && (
								<label className='text-danger mx-3 w-50'>
									*{formik.errors.Clave_Area}
								</label>
							)}
							<div className='d-flex m-3 mb-0 border border-dark'>
								<label className='col-4 m-3 col-form-label'>
									Nombre del solicitante:
								</label>
								<input
									className='w-50 m-3 col-form-label form-control'
									readOnly
									value={formik.values.Nombres}
								/>
							</div>
							<div className='d-flex m-3 my-0 border-top-0 border border-dark'>
								<label className='col-4 m-3 col-form-label'>
									Fecha de elaboracion:
								</label>
								<label className='col-2 m-3 col-form-label'>{formatDate}</label>
							</div>
							<div className='m-3 my-0 border-top-0 border border-dark'>
								<label className='m-3 mb-0 col-form-label'>
									Descripcion del servicio solicitado o falla a reparar:
								</label>
								<label className='mx-2 text-secondary'>
									*Maximo 200 Caracteres
								</label>
								<div></div>
								<div className='m-3 my-0'>
									<button
										className='border-0 bg-transparent my-2'
										onClick={() => handleVerSug()}
										type='button'
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
										<label className='mx-2 text-secondary'>(Opcional)</label>
									</button>
								</div>
								{verSug && (
									<>
										{!!prob &&
											prob.map((p) => {
												return (
													<div
														className='d-inline-block w-50 input-group mb-3'
														key={p.idProblema}
													>
														<div className='input-group-prepend'>
															<div className='input-group mx-3'>
																<input
																	type='checkbox'
																	name='ProblemaCheck'
																	value={p.Descripcion}
																	checked={formik.values.ProblemaCheck.includes(
																		p.Descripcion
																	)}
																	onChange={formik.handleChange}
																	onBlur={formik.handleBlur}
																/>
																<label className='form-check-label mx-1'>
																	{p.Descripcion}
																</label>
															</div>
														</div>
													</div>
												);
											})}
									</>
								)}
								<div></div>
								<label className='my-0 m-3'>
									Especifique o escriba su problema.
								</label>
								<textarea
									className='form-control m-3 w-75'
									name='Descripcion_Servicio_Falla'
									id='Descripcion_Servicio_Falla'
									maxLength='200'
									value={formik.values.Descripcion_Servicio_Falla}
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
								></textarea>
								{!!formik.touched.Descripcion_Servicio_Falla &&
									!!formik.errors.Descripcion_Servicio_Falla && (
										<label className='text-danger mx-3 mb-2 w-50'>
											*{formik.errors.Descripcion_Servicio_Falla}
										</label>
									)}
							</div>
							<div className='m-3 my-0 border-top-0 border border-dark'>
								<label className='m-3 my-0 col-form-label'>
									Lugar especifico donde debe de acudir tecnico a dar
									mantenimiento.
								</label>
								<textarea
									className='form-control m-3 w-75 mt-0'
									name='Lugar_Especifico'
									id='Lugar_Especifico'
									maxLength='200'
									value={formik.values.Lugar_Especifico}
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
								></textarea>
								{!!formik.touched.Lugar_Especifico &&
									!!formik.errors.Lugar_Especifico && (
										<label className='text-danger mx-3 mb-2 w-50'>
											*{formik.errors.Lugar_Especifico}
										</label>
									)}
							</div>
							<div className='m-3 my-0 border-top-0 border border-dark'>
								<label className='m-3 my-0 col-form-label'>
									Horario en el que puede ser atendido el tecnico.
								</label>
								<textarea
									className='form-control m-3 w-75 mt-0'
									name='Horario_Atencion'
									id='Horario_Atencion'
									maxLength='100'
									value={formik.values.Horario_Atencion}
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
								></textarea>
								{!!formik.touched.Horario_Atencion &&
									!!formik.errors.Horario_Atencion && (
										<label className='text-danger mx-3 mb-2 w-50'>
											*{formik.errors.Horario_Atencion}
										</label>
									)}
							</div>
						</div>
					</div>
				</div>
				{role === 2 && (
					<div className='container d-flex justify-content-center my-3'>
						<button className='btn btn-warning btn-lg m-2' type='submit'>
							Enviar
						</button>
					</div>
				)}
			</form>
		</>
	);
};
