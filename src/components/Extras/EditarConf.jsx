import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

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

	const formikNuevo = useFormik({
		initialValues: {
			Nuevo_P: '',
		},
		validate: (values) => {
			const errors = {};

			if (!values.Nuevo_P) {
				errors.Nuevo_P = 'Debe de ingresar un nuevo periodo';
			}

			return errors;
		},
		onSubmit: async (values) => {
			try {
				const data = await fetch(`http://localhost:4000/periodos`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						Periodo: values.Nuevo_P,
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

	const getExtras = async () => {
		if (id === '4' || id === '5') {
			try {
				const dataU = await fetch(`http://localhost:4000/admins`);
				const resU = await dataU.json();
				setUsers(resU);
			} catch (error) {
				console.log(error);
				console.log('Trono get Data');
			}
		} else if (id === '2') {
			try {
				const dataP = await fetch(`http://localhost:4000/periodos`);
				const resP = await dataP.json();
				setUsers(resP);
			} catch (error) {
				console.log(error);
				console.log('Trono get Data');
			}
		}
	};

	const handleDel = async (idP) => {
		Swal.fire({
			title: 'Seguro que desea eliminar el periodo?',
			showDenyButton: true,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			denyButtonText: `Eliminar`,
		}).then(async (result) => {
			if (result.isDenied) {
				try {
					if (idP === configs[0]?.Valor) {
						Swal.fire(
							'No de debe eliminar el periodo que esta seleccionado actualmente'
						);
						return;
					}
					const data = await fetch(`http://localhost:4000/periodo/${idP}`, {
						method: 'DELETE',
					});
					await data.json();
					window.location.reload(false);
				} catch (error) {
					console.log(error);
					console.log('trono delete');
				}
			}
		});
	};

	useEffect(() => {
		getData();
		getExtras();
	}, [setConfigs, setUsers]);

	return (
		<>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Configuraciones</h1>
			</div>
			<div className='container'>
				<div className='d-flex m-3'>
					{!!configs &&
						configs.map((c) => {
							return (
								<label key={c.idConfig} className='col-4 col-form-label'>
									{c.Nombre_Campo}:
								</label>
							);
						})}
					<form className='d-flex w-50' onSubmit={formik.handleSubmit}>
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
										<option
											key={u.RFC ? u.RFC : u.idPeriodo}
											value={u.Nombres ? u.Nombres : u.idPeriodo}
										>
											{u.Nombres ? u.Nombres : u.Periodo}
										</option>
									);
								})}
							</select>
						) : (
							<input
								type='text'
								className='form-control w-50'
								name='Valor'
								value={formik.values.Valor}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						)}
						<button type='submit' className='btn btn-warning ms-2'>
							Guardar
						</button>
					</form>
					{id === '2' && (
						<button
							className='btn btn-danger mx-2'
							onClick={() => handleDel(formik.values.Valor)}
						>
							Eliminar
						</button>
					)}
				</div>

				{id === '2' && (
					<form onSubmit={formikNuevo.handleSubmit}>
						<div className='d-flex m-3'>
							<label className='col-4 col-form-label'>Nuevo Periodo:</label>
							<input
								type='text'
								className='form-control w-25'
								name='Nuevo_P'
								value={formikNuevo.values.Nuevo_P}
								onChange={formikNuevo.handleChange}
								onBlur={formikNuevo.handleBlur}
							/>

							<button type='submit' className='btn btn-success ms-2'>
								Agregar
							</button>
							{!!formikNuevo.errors.Nuevo_P && (
								<label className='text-danger mx-2'>
									*{formikNuevo.errors.Nuevo_P}
								</label>
							)}
						</div>
					</form>
				)}

				<div className='d-flex justify-content-center'>
					<NavLink className='btn btn-primary m-3' to={'/configuraciones'}>
						Regresar
					</NavLink>
				</div>
			</div>
		</>
	);
};
