import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IconContext } from 'react-icons';
import { useState, useEffect } from 'react';
import Moment from 'moment';
import ith_logo from '../../assets/ith_logo.jpg';
import { useFormik } from 'formik';
import jwtDecode from 'jwt-decode';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const NuevaSolicitud = () => {
	const [verSug, setVerSug] = useState(false);
	const formatDate = Moment().format('DD/MM/YYYY');
	const [areas, setAreas] = useState();
	const [prob, setProb] = useState();
	const [rev, setRev] = useState();

	const nav = useNavigate();
	const token = sessionStorage.getItem('token');

	const handleId = () => {
		if (!!token) {
			const user = jwtDecode(token);

			if (!!user) {
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
			const data = await fetch('http://localhost:4000/areas');
			const res = await data.json();
			setAreas(res);
		} catch (error) {
			console.error('Get Areas ' + error);
		}
	};

	const getProb = async () => {
		try {
			const data = await fetch('http://localhost:4000/problemasCliente');
			const res = await data.json();
			!!res && setProb(res);
		} catch (error) {
			console.error('Cant get prob ' + error);
		}
	};

	const getRev = async () => {
		try {
			const dataConf = await fetch(`http://localhost:4000/configs`);
			const resC = await dataConf.json();
			!!resC && formik.setFieldValue('idPeriodo', resC[1].Valor);
			!!resC && setRev(resC[2]); //el 3er campo es la revision
			!!resC && formik.setFieldValue('Asignado_a', resC[3].Valor); //el 4to es de asignado a
			!!resC && formik.setFieldValue('Aprobado_Por', resC[4].Valor); //el 5to es de Aprobado por
		} catch (error) {
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
			try {
				const valid = await fetch(
					`http://localhost:4000/solicitudRFC/${values.RFC}`
				);
				const res = await valid.json();
				if (res.length > 0) {
					Swal.fire('Tiene una solicitud pendiente');
					return;
				}
				const data = await fetch('http://localhost:4000/solicitudes', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						idPeriodo: values.idPeriodo,
						RFC: values.RFC,
						Clave_Area: values.Clave_Area,
						Nombre_Solicitante: values.Nombres,
						Descripcion_Servicio_Falla: req,
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
			} catch (error) {
				console.error('Send solicitud ' + error);
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
														className='mx-3 w-25 form-check form-check-inline'
														key={p.idProblema}
													>
														<input
															className='form-check-input'
															type='checkbox'
															name='ProblemaCheck'
															value={p.Descripcion}
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															checked={formik.values.ProblemaCheck.includes(
																p.Descripcion
															)}
														/>
														<label className='form-check-label'>
															{p.Descripcion}
														</label>
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

				<div className='container d-flex justify-content-center my-3'>
					<button className='btn btn-warning btn-lg m-2' type='submit'>
						Enviar
					</button>
				</div>
			</form>
		</>
	);
};
