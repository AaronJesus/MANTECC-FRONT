import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { NotificationManager } from 'react-notifications';

export const EditarConf = () => {
	const { id } = useParams();
	const [submit, setsubmit] = useState(false);
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
			setsubmit(true);

			if (!submit) {
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
					setsubmit(false);
					Swal.fire('Configuracion actualizada!');
				} catch (error) {
					setsubmit(false);
					Swal.fire('Hubo un error de conexion');
					console.log(error);
					console.log('Trono submit');
				}
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
			setsubmit(true);

			if (!submit) {
				try {
					const data = await fetch(`http://localhost:4000/periodos`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							Periodo: values.Nuevo_P,
						}),
					});
					await data.json();
					setsubmit(false);
					Swal.fire('Nuevo periodo!');
					window.location.reload(false);
				} catch (error) {
					console.log(error);
					Swal.fire('Hubo un error de conexion');
					setsubmit(false);
					console.log('Trono submit');
				}
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
			NotificationManager.warning(
				'Hubo un error al descargar la informacion',
				'Error',
				3000
			);
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
				NotificationManager.warning(
					'Hubo un error al descargar los usuarios',
					'Error',
					3000
				);
				console.log(error);
				console.log('Trono get Data');
			}
		} else if (id === '2') {
			try {
				const dataP = await fetch(`http://localhost:4000/periodos`);
				const resP = await dataP.json();
				setUsers(resP);
			} catch (error) {
				NotificationManager.warning(
					'Hubo un error al descargar los usuarios',
					'Error',
					3000
				);
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
				setsubmit(true);

				if (!submit) {
					try {
						const dataPeriodo = await fetch(
							`http://localhost:4000/solicitudes/periodo/${idP}`
						);
						const resPer = await dataPeriodo.json();
						if (!!resPer && resPer.length > 0) {
							Swal.fire(
								'No se puede eliminar un periodo que tenga solicitudes'
							);
							setsubmit(false);
							return;
						}

						if (idP === configs[0]?.Valor) {
							Swal.fire(
								'No de debe eliminar el periodo que esta seleccionado actualmente'
							);
							setsubmit(false);
							return;
						}
						const data = await fetch(`http://localhost:4000/periodo/${idP}`, {
							method: 'DELETE',
						});
						await data.json();
						Swal.fire('Periodo eliminado');
						setsubmit(false);
						window.location.reload(false);
					} catch (error) {
						Swal.fire('Hubo un error de conexion');
						console.log(error);
						console.log('trono delete');
						setsubmit(false);
					}
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
				{!!formik.touched.Valor && !!formik.errors.Valor && (
					<label className='text-danger mx-3 mb-2 w-50'>
						*{formik.errors.Valor}
					</label>
				)}
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
