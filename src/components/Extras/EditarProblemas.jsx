import { useParams } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/NavbarStyles.css';
import { useFormik } from 'formik';
import { useEffect } from 'react';

export const EditarProblemas = () => {
	const { id } = useParams();

	const formik = useFormik({
		initialValues: {
			Descripcion: '',
			Tipo: '',
		},
		validate: (values) => {
			const errors = {};

			if (!values.Descripcion) {
				errors.Descripcion = 'Debe ingresar una descripcion';
			}

			if (!values.Tipo) {
				errors.Tipo = 'Debe seleccionar el tipo de problema';
			} else if (values.Tipo === '') {
				errors.Tipo = 'Debe seleccionar el tipo de problema';
			}

			return errors;
		},
		onSubmit: async (values) => {
			if (!!id) {
				try {
					const data = await fetch(`http://localhost:4000/problema/${id}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							Tipo: values.Tipo,
							Descripcion: values.Descripcion,
						}),
					});
					await data.json();
					window.location.reload(false);
				} catch (error) {
					console.log('Trono update');
					console.log(error);
				}
			} else {
				try {
					const data = await fetch(`http://localhost:4000/problemas`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							Tipo: values.Tipo,
							Descripcion: values.Descripcion,
						}),
					});
					await data.json();
					window.location.reload(false);
				} catch (error) {
					console.log('Trono submit');
					console.log(error);
				}
			}
		},
	});

	const getData = async () => {
		if (!!id) {
			try {
				const data = await fetch(`http://localhost:4000/problema/${id}`);
				const res = await data.json();
				!!res && formik.setFieldValue('Descripcion', res[0].Descripcion);
				formik.setFieldValue('Tipo', res[0].Tipo);
				formik.setFieldValue('idProblema', res[0].idProblema);
			} catch (error) {
				console.log('Trono get');
				console.log(error);
			}
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Problemas</h1>
			</div>
			<form onSubmit={formik.handleSubmit}>
				<div className='d-flex m-5 my-0 justify-content-center '>
					<table className='table table-hover text-center align-middle'>
						<thead className='bg-blue text-white'>
							<tr>
								<th scope='col'>Descripcion</th>
								<th scope='col'>Tipo de problema</th>
								<th scope='col'>Opciones</th>
							</tr>
						</thead>
						<tbody className='bg-white'>
							<tr>
								<td>
									<input
										className='form-control'
										name='Descripcion'
										value={formik.values.Descripcion}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
									{!!formik.touched.Descripcion &&
										!!formik.errors.Descripcion && (
											<label className='text-danger w-50'>
												*{formik.errors.Descripcion}
											</label>
										)}
								</td>
								<td>
									<select
										className='form-control'
										name='Tipo'
										value={formik.values.Tipo}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									>
										<option value={''}>---</option>
										<option value={'Admin'}>Admin</option>
										<option value={'Cliente'}>Cliente</option>
									</select>
									{!!formik.touched.Tipo && !!formik.errors.Tipo && (
										<label className='text-danger w-50'>
											*{formik.errors.Tipo}
										</label>
									)}
								</td>
								<td>
									<button className='btn btn-warning m-2' type='submit'>
										Guardar
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</form>
		</>
	);
};
