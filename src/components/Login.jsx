import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
	const nav = useNavigate();
	const formik = useFormik({
		initialValues: {
			RFC: '',
			Contraseña: '',
		},
		validate: (values) => {
			let errors = {};
			if (!values.RFC) {
				errors.RFC = 'No ingreso usuario';
			}
			if (!values.Contraseña) {
				errors.Contraseña = 'No ingreso Contraseña';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				const data = await fetch('http://localhost:4000/usuarios/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						RFC: values.RFC,
						Contraseña: values.Contraseña,
					}),
				});
				const res = await data.json();
				if (!!res.accessToken) {
					sessionStorage.setItem('token', res.accessToken);
					if (res.user.id_Usuario === 1 || res.user.id_Usuario === 3) {
						nav('/solicitudes');
					} else {
						nav('/nueva_solicitud');
					}
				} else {
					window.alert(res.msg);
				}
			} catch (error) {
				console.log(error);
				console.log('No se pudo validar');
			}
		},
	});
	return (
		<>
			<div className='contanier m-5 justify-content-center d-flex'>
				<div className='bg-white m-5 p-5 border rounded '>
					<form onSubmit={formik.handleSubmit}>
						<h1 className='h3 mb-3 fw-normal d-flex'>Ingresar MANTECC</h1>

						<div className='m-3'>
							<label>RFC</label>
							<input
								type='text'
								className='form-control'
								name='RFC'
								value={formik.values.RFC}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</div>
						{!!formik.touched.RFC && !!formik.errors.RFC && (
							<label className='text-danger'>*{formik.errors.RFC}</label>
						)}
						<div className='m-3'>
							<label>Contraseña</label>
							<input
								type='password'
								className='form-control'
								name='Contraseña'
								value={formik.values.Contraseña}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</div>
						{!!formik.touched.Contraseña && !!formik.errors.Contraseña && (
							<label className='text-danger'>*{formik.errors.Contraseña}</label>
						)}
						<button className='w-100 btn btn-lg btn-primary m-3' type='submit'>
							Entrar
						</button>
					</form>
				</div>
			</div>
		</>
	);
};
