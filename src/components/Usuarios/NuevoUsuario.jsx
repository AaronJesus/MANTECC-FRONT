import { useFormik } from 'formik';
import { NavLink } from 'react-router-dom';

export const NuevoUsuario = () => {
	const formik = useFormik({
		initialValues: {
			RFC: '',
			Nombres: '',
			Contraseña: '',
			Contraseña2: '',
			id_Usuario: '',
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
			if (values.id_Usuario === '') {
				errors.id_Usuario = 'Debe de seleccionar algun tipo de usuario';
			}

			if (!values.Contraseña) {
				errors.Contraseña = 'Debe de ingresar una contraseña';
			} else if (!values.Contraseña2) {
				errors.Contraseña2 = 'Debe de confirmar la contraseña';
			} else if (values.Contraseña !== values.Contraseña2) {
				errors.Contraseña2 = 'Las contraseñas deben de coincidir';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				const data = await fetch('http://localhost:4000/usuarios', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						RFC: values.RFC,
						Contraseña: values.Contraseña,
						Nombres: values.Nombres,
						id_Usuario: values.id_Usuario,
					}),
				});
				await data.json();
				window.location.reload(false);
			} catch (error) {
				console.log(error);
				console.log('Trono new user');
			}
		},
	});

	return (
		<div className='container'>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Nuevo Usuario</h1>
			</div>
			<div>
				<form onSubmit={formik.handleSubmit}>
					<div className='d-flex my-3'>
						<label className='col-2 col-form-label'>RFC:</label>
						<input
							type='text'
							className='form-control w-50'
							name='RFC'
							maxLength={13}
							value={formik.values.RFC}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>

						<label className='mx-3 col-form-label w-25'>Tipo de usuario:</label>
						<select
							className='form-control w-50'
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
					<div className='d-flex my-3'>
						{!!formik.touched.RFC && !!formik.errors.RFC && (
							<label className='col-form-label text-danger w-50'>
								*{formik.errors.RFC}
							</label>
						)}
						{!!formik.touched.id_Usuario && !!formik.errors.id_Usuario && (
							<label className='mx-3 col-form-label w-50 text-danger'>
								*{formik.errors.id_Usuario}
							</label>
						)}
					</div>

					<div className='d-flex my-3'>
						<label className='col-2 col-form-label'>Nombre completo:</label>
						<input
							type='text'
							className='form-control'
							name='Nombres'
							value={formik.values.Nombres}
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
						/>
					</div>
					{!!formik.touched.Nombres && !!formik.errors.Nombres && (
						<div className='text-danger d-flex'>*{formik.errors.Nombres}</div>
					)}
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
