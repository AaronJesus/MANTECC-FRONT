import { useFormik } from 'formik';
import { useState } from 'react';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { NotificationManager } from 'react-notifications';

export const NuevoAlumno = () => {
	const [submit, setsubmit] = useState(false);
	const [carreras, setCarreras] = useState();

	const formik = useFormik({
		initialValues: {
			RFC: '',
			Contraseña: '',
			Contraseña2: '',
			Nombres: '',
			No_Control: '',
			Clave_Carrera: '',
		},
		validate: (values) => {
			const errors = {};
			if (!values.RFC) {
				errors.RFC = 'Debe de ingresar algun metodo de identificacion';
			} else if (values.RFC.length < 13) {
				errors.RFC = 'El RFC debe de ser 13 caracteres de largo';
			}

			if (!values.Nombres) {
				errors.Nombres = 'Debe de ingresar sus nombres';
			}

			if (!values.Contraseña) {
				errors.Contraseña = 'Debe de ingresar una contraseña';
			} else if (!values.Contraseña2) {
				errors.Contraseña2 = 'Debe de confirmar la contraseña';
			} else if (values.Contraseña !== values.Contraseña2) {
				errors.Contraseña2 = 'Las contraseñas deben de coincidir';
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
					const data = await fetch(process.env.REACT_APP_DEV + '/alumnos', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							RFC: values.RFC,
							Contraseña: values.Contraseña,
							Nombres: values.Nombres,
							No_Control: values.No_Control,
							Clave_Carrera: values.Clave_Carrera,
						}),
					});
					const res = await data.json();
					setsubmit(false);
					if (!!res.msg) {
						Swal.fire(res.msg);
					} else {
						Swal.fire('Nuevo alumno!');
						window.location.reload(false);
					}
				} catch (error) {
					setsubmit(false);
					Swal.fire('Hubo un error de conexion');
					console.log('Trono submit');
					console.log(error);
				}
			}
		},
	});

	const getCarreras = async () => {
		try {
			const data = await fetch(process.env.REACT_APP_DEV + '/carreras');
			const res = await data.json();
			!!res &&
				setCarreras(
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
				'Hubo un error al descargar las carreras',
				'Error',
				3000
			);
			console.log('trono carr');
			console.log(error);
		}
	};

	useEffect(() => {
		getCarreras();
	}, [setCarreras]);

	return (
		<div className='container'>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Nuevo Alumno</h1>
			</div>
			<div>
				<form onSubmit={formik.handleSubmit}>
					<div className='d-flex my-3'>
						<label className='col-2 col-form-label'>RFC:</label>
						<input
							type='text'
							className='form-control w-50'
							name='RFC'
							value={formik.values.RFC}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</div>
					{!!formik.touched.RFC && !!formik.errors.RFC && (
						<label className='text-danger'>*{formik.errors.RFC}</label>
					)}
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
							{!!carreras &&
								carreras.map((carrera) => {
									return (
										<option
											value={carrera.Clave_Carrera}
											key={carrera.Clave_Carrera}
										>
											{carrera.Nombre}
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
