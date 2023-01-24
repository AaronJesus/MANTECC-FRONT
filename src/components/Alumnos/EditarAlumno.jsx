import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { NotificationManager } from 'react-notifications';

export const EditarAlumno = () => {
	const nav = useNavigate();
	const { rfc } = useParams();
	const [submit, setsubmit] = useState(false);
	const [carr, setCarr] = useState();

	const formik = useFormik({
		initialValues: {
			Contraseña: '',
			Contraseña2: '',
			Nombres: '',
			No_Control: '',
			Clave_Carrera: '',
			RFC2: '',
		},
		validate: (values) => {
			const errors = {};

			if (!values.Nombres) {
				errors.Nombres = 'Debe de ingresar sus nombres';
			}

			if (!!values.Contraseña) {
				if (!values.Contraseña2) {
					errors.Contraseña2 = 'Debe de confirmar la contraseña';
				} else if (values.Contraseña !== values.Contraseña2) {
					errors.Contraseña2 = 'Las contraseñas deben de coincidir';
				}
			}

			if (!values.No_Control) {
				errors.No_Control = 'Debe de ingresar su numero de control';
			}

			if (!values.Clave_Carrera) {
				errors.Clave_Carrera = 'Debe de seleccionar una carrera';
			}

			return errors;
		},
		onSubmit: async (values) => {
			setsubmit(true);

			if (!submit) {
				try {
					if (!!values.Contraseña) {
						const data = await fetch(`http://localhost:4000/alumno/${rfc}`, {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								Contraseña: values.Contraseña,
								Nombres: values.Nombres,
								No_Control: values.No_Control.toString(),
								Clave_Carrera: values.Clave_Carrera,
							}),
						});
						await data.json();
					} else {
						const data = await fetch(`http://localhost:4000/alumno/${rfc}`, {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								Nombres: values.Nombres,
								No_Control: values.No_Control.toString(),
								Clave_Carrera: values.Clave_Carrera,
							}),
						});
						await data.json();
					}
					setsubmit(false);
					Swal.fire('Alumno actualizado!');
					nav('/alumnos');
				} catch (error) {
					setsubmit(false);
					Swal.fire('Hubo un error de conexion');
					console.log('Trono submit');
					console.log(error);
				}
			}
		},
	});

	const getData = async () => {
		try {
			const data = await fetch(`http://localhost:4000/alumno/${rfc}`);
			const info = await fetch(`http://localhost:4000/carreras`);
			const res = await data.json();
			const resInfo = await info.json();
			!!resInfo &&
				setCarr(
					resInfo.sort(function (a, b) {
						if (a.Nombre.toLowerCase() < b.Nombre.toLowerCase()) {
							return -1;
						}
						if (a.Nombre.toLowerCase() > b.Nombre.toLowerCase()) {
							return 1;
						}
						return 0;
					})
				);
			!!res && formik.setFieldValue('Nombres', res[0][0].Nombres);
			formik.setFieldValue('No_Control', res[0][0].No_Control);
			formik.setFieldValue('Clave_Carrera', res[0][0].Clave_Carrera);
			formik.setFieldValue('RFC2', rfc);
		} catch (error) {
			NotificationManager.warning(
				'Hubo un error al descargar la informacion',
				'Error',
				3000
			);
			console.log('Trono get');
			console.log(error);
		}
	};

	useEffect(() => {
		getData();
	}, [setCarr]);

	return (
		<div className='container'>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Editar Alumno</h1>
			</div>
			<div>
				<form onSubmit={formik.handleSubmit}>
					<div className='d-flex my-3'>
						<label className='col-2 col-form-label'>RFC:</label>
						<input
							type='text'
							className='form-control w-50'
							disabled
							value={rfc}
						/>
					</div>
					<div className='d-flex my-3'>
						<label className='col-2 col-form-label'>Nombre completo:</label>
						<input
							type='text'
							className='form-control'
							name='Nombres'
							maxLength='100'
							value={formik.values.Nombres}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</div>
					{!!formik.touched.Nombres && !!formik.errors.Nombres && (
						<label className='text-danger'>*{formik.errors.Nombres}</label>
					)}
					<div className='d-flex my-3'>
						<label className='col-2 col-form-label'>Numero de control:</label>
						<input
							type='text'
							className='form-control w-25'
							name='No_Control'
							value={formik.values.No_Control}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<label className='mx-3 col-form-label w-25'>
							Nombre de la carrera:
						</label>
						<select
							className='form-control w-50'
							name='Clave_Carrera'
							value={formik.values.Clave_Carrera}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						>
							<option value={''}>---</option>
							{!!carr &&
								carr.map((car) => {
									return (
										<option key={car.Clave_Carrera} value={car.Clave_Carrera}>
											{car.Nombre}
										</option>
									);
								})}
						</select>
					</div>
					<div className='d-flex my-3'>
						{!!formik.touched.No_Control && !!formik.errors.No_Control && (
							<label className='text-danger w-50'>
								*{formik.errors.No_Control}
							</label>
						)}
						{!!formik.touched.Clave_Carrera &&
							!!formik.errors.Clave_Carrera && (
								<label className='text-danger w-50'>
									*{formik.errors.Clave_Carrera}
								</label>
							)}
					</div>
					<div className='my-3'>
						<label className='col-form-label'>Cambiar contraseña</label>
					</div>
					<div>
						<label className='col-2 col-form-label'>Contraseña:</label>
						<input
							type='password'
							className='form-control w-25 mx-3'
							name='Contraseña'
							value={formik.values.Contraseña}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{!!formik.touched.Contraseña && !!formik.errors.Contraseña && (
							<div className='text-danger d-flex'>
								*{formik.errors.Contraseña}
							</div>
						)}
						<label className='col-2 col-form-label'>Repetir contraseña:</label>
						<input
							type='password'
							className='form-control w-25 mx-3'
							name='Contraseña2'
							value={formik.values.Contraseña2}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{!!formik.touched.Contraseña2 && !!formik.errors.Contraseña2 && (
							<div className='text-danger d-flex'>
								*{formik.errors.Contraseña2}
							</div>
						)}
					</div>
					<div className='d-flex justify-content-end'>
						<button className='btn btn-warning m-2' type='submit'>
							Guardar
						</button>
						<NavLink className='btn btn-primary m-2' to='/alumnos'>
							Regresar
						</NavLink>
					</div>
				</form>
			</div>
		</div>
	);
};
