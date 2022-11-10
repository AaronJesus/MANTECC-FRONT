import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
	const nav = useNavigate();
	const formik = useFormik({
		initialValues: {
			user: '',
		},
		validateOnChange: false,
		validateOnBlur: false,
		onSubmit: (values) => {
			if (values.user === '') {
				return;
			}
			values.user === 'admin' && localStorage.setItem('role', '1');
			values.user === 'cliente' && localStorage.setItem('role', '2');
			values.user === 'alumno' && localStorage.setItem('role', '3');
			localStorage.setItem('user', 'Aaron');
			nav('/');
		},
		validate: (values) => {
			let errors = {};
			if (values.user === '') {
				errors = 'No ingreso usuario';
			} else if (values.user === 'admin') {
				return;
			} else if (values.user === 'cliente') {
				return;
			} else if (values.user === 'alumno') {
				return;
			} else {
				errors = 'Usuario no valido';
			}
			window.alert(errors);
			if (errors === {}) {
				return;
			}
		},
	});
	return (
		<>
			<h1>Login</h1>
			<div className='container'>
				<form onSubmit={formik.handleSubmit}>
					<input
						type={'text'}
						placeholder='usuario'
						name='user'
						onChange={formik.handleChange}
						value={formik.values.user}
					/>
					<button className='btn-primary m-3' type='submit'>
						Entrar
					</button>
				</form>
			</div>
		</>
	);
};
