import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import Swal from 'sweetalert2';

export const EditarUsuario = () => {
	const [submit, setsubmit] = useState(false);
	const nav = useNavigate();
	const { rfc } = useParams();
	const formik = useFormik({
		initialValues: {
			Nombres: '',
			Contraseña: '',
			Contraseña2: '',
			id_Usuario: '',
			RFC2: '',
		},
		validate: (values) => {
			const errors = {};

			if (!values.Nombres) {
				errors.Nombres = 'Debe de ingresar sus nombres';
			}
			if (values.id_Usuario === '') {
				errors.id_Usuario = 'Debe de seleccionar algun tipo de usuario';
			}

			if (!!values.Contraseña) {
				if (!values.Contraseña2) {
					errors.Contraseña2 = 'Debe de confirmar la contraseña';
				} else if (values.Contraseña !== values.Contraseña2) {
					errors.Contraseña2 = 'Las contraseñas deben de coincidir';
				}
			}
			return errors;
		},
		onSubmit: async (values) => {
			setsubmit(true);

			if (!submit) {
				try {
					if (!!values.Contraseña) {
						const data = await fetch(
							process.env.REACT_APP_DEV + `/usuario/${rfc}`,
							{
								method: 'PUT',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									RFC: rfc,
									RFC2: values.RFC2,
									Contraseña: values.Contraseña,
									Nombres: values.Nombres,
									id_Usuario: values.id_Usuario,
								}),
							}
						);
						await data.json();
					} else {
						const data = await fetch(
							process.env.REACT_APP_DEV + `/usuario/${rfc}`,
							{
								method: 'PUT',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									RFC: rfc,
									RFC2: values.RFC2,
									Nombres: values.Nombres,
									id_Usuario: values.id_Usuario,
								}),
							}
						);
						await data.json();
					}
					setsubmit(false);

					Swal.fire('Usuario actualizado!');
					nav('/usuarios');
				} catch (error) {
					setsubmit(false);
					Swal.fire('Hubo un error de conexion');
					console.log(error);
					console.log('Trono edit user');
				}
			}
		},
	});

	const getDatos = async () => {
		try {
			const data = await fetch(process.env.REACT_APP_DEV + `/usuario/${rfc}`);
			const res = await data.json();
			!!res[0] && formik.setFieldValue('Nombres', res[0].Nombres);
			formik.setFieldValue('id_Usuario', res[0].id_Usuario);
			formik.setFieldValue('RFC2', rfc);
		} catch (error) {
			NotificationManager.warning(
				'Hubo un error al recuperar la informacion',
				'Error',
				3000
			);
			console.log('Trono get datos');
			console.log(error);
		}
	};

	useEffect(() => {
		getDatos();
	}, []);

	return (
		<div className='container'>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Editar Usuario</h1>
			</div>
			<div>
				<form onSubmit={formik.handleSubmit}>
					<div className='d-flex my-3'>
						<label className='col-2 col-form-label'>RFC:</label>
						<input
							type='text'
							className='form-control w-50'
							name='RFC2'
							value={formik.values.RFC2}
							disabled
						/>

						<label className='mx-3 col-form-label w-25'>Tipo de usuario:</label>
						<select
							className='form-control w-50'
							name='id_Usuario'
							value={formik.values.id_Usuario}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						>
							<option value={1}>Admin</option>
							<option value={2}>Cliente</option>
						</select>
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
						<div className='text-danger d-flex'>*{formik.errors.Nombres}</div>
					)}
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
						<NavLink className='btn btn-primary m-2' to='/usuarios'>
							Regresar
						</NavLink>
					</div>
				</form>
			</div>
		</div>
	);
};
