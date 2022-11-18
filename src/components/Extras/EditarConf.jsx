import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

export const EditarConf = () => {
	const { id } = useParams();
	const [configs, setConfigs] = useState();
	const [users, setUsers] = useState();

	const formik = useFormik({
		initialValues: {
			Valor: '',
		},
		validate: (values) => {
			const errors = {};

			if (!values.Valor) {
				errors.Valor = 'Debe de ingresar un valor';
			}

			return errors;
		},
		onSubmit: async (values) => {
			try {
				const data = await fetch(`http://localhost:4000/config/${id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						idConfig: id,
						Valor: values.Valor,
					}),
				});
				await data.json();
				window.location.reload(false);
			} catch (error) {
				console.log(error);
				console.log('Trono submit');
			}
		},
	});

	const getData = async () => {
		try {
			const dataConf = await fetch(`http://localhost:4000/config/${id}`);
			const resC = await dataConf.json();
			setConfigs(resC);
			!!resC && formik.setFieldValue('Valor', resC[0].Valor);
		} catch (error) {
			console.log(error);
			console.log('Trono get Data');
		}
	};

	const getUser = async () => {
		if (id === '4' || id === '5') {
			try {
				const dataU = await fetch(`http://localhost:4000/admins`);
				const resU = await dataU.json();
				setUsers(resU);
			} catch (error) {
				console.log(error);
				console.log('Trono get Data');
			}
		}
	};

	useEffect(() => {
		getData();
		getUser();
	}, [setConfigs, setUsers]);

	return (
		<>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Configuraciones</h1>
			</div>
			<div className='container'>
				<form onSubmit={formik.handleSubmit}>
					<div className='d-flex m-3'>
						{!!configs &&
							configs.map((c) => {
								return (
									<label key={c.idConfig} className='col-4 col-form-label'>
										{c.Nombre_Campo}:
									</label>
								);
							})}
						{!!users ? (
							<select
								className='form-control'
								name='Valor'
								value={formik.values.Valor}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							>
								<option value={''}>---</option>
								{users.map((u) => {
									return (
										<option key={u.RFC} value={u.Nombres}>
											{u.Nombres}
										</option>
									);
								})}
							</select>
						) : (
							<input
								type='text'
								className='form-control w-25'
								name='Valor'
								value={formik.values.Valor}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						)}
						<button type='submit' className='btn btn-warning mx-5'>
							Guardar
						</button>
					</div>

					<div className='d-flex justify-content-center'>
						<NavLink className='btn btn-primary m-3' to={'/configuraciones'}>
							Regresar
						</NavLink>
					</div>
				</form>
			</div>
		</>
	);
};
