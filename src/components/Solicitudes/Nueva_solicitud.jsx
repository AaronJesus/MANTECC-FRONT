import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IconContext } from 'react-icons';
import { useState, useEffect } from 'react';
import Moment from 'moment';
import ith_logo from '../../assets/ith_logo.jpg';
import { useFormik } from 'formik';

export const NuevaSolicitud = () => {
	const [verSug, setVerSug] = useState(false);
	const formatDate = Moment().format('DD/MM/YYYY');
	const [areas, setAreas] = useState();

	const handleVerSug = () => {
		setVerSug(!verSug);
	};

	const formik = useFormik({
		initialValues: {
			Clave_Area: '',
			Nombre_Solicitante: 'Valentin Elizalde Valencia',
			Fecha_Elaboracion: Moment().format('MM/DD/YYYY'),
			Descripcion_Servicio_Falla: '',
			Lugar_Especifico: '',
			Horario_Atencion: '',
			Asignado_a: 'Raymur Nuztas',
		},
	});

	const getAreas = async () => {
		try {
			const data = await fetch('http://localhost:4000/areas');
			const res = await data.json();
			setAreas(res);
		} catch (error) {
			console.error('Get Areas ' + error);
		}
	};

	const handleSend = async () => {
		try {
			const data = await fetch('http://localhost:4000/solicitudes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					Clave_Area: formik.values.Clave_Area,
					Nombre_Solicitante: formik.values.Nombre_Solicitante,
					Descripcion_Servicio_Falla: formik.values.Descripcion_Servicio_Falla,
					Fecha_Elaboracion: formik.values.Fecha_Elaboracion,
					Lugar_Especifico: formik.values.Lugar_Especifico,
					Horario_Atencion: formik.values.Horario_Atencion,
				}),
			});
			await data.json();
			window.alert('Jalo');
		} catch (error) {
			console.error('Send solicitud ' + error);
		}
	};
	useEffect(() => {
		getAreas();
	}, []);

	return (
		<>
			<div className='container bg-white pb-5 border border-dark'>
				<div className='container'>
					<table className='table text-center table-bordered border-dark align-middle m-3 mx-0'>
						<thead></thead>
						<tbody>
							<tr>
								<th scope='col' rowSpan={2}>
									<img
										src={ith_logo}
										style={{ width: 80, height: 80 }}
										alt='Logo'
									/>
								</th>
								<th scope='col'>
									Formato para Solicitud de Mantenimiento Correctivo
								</th>
								<th scope='col'>Codigo: ITH-AD-PO-001-02</th>
							</tr>
							<tr>
								<th scope='col'>
									Referencia al punto de la norma ISO 9001:2015 7.1.3, 8.4
								</th>
								<th scope='col'>Revision: 5</th>
							</tr>
						</tbody>
					</table>
					<div className='d-flex m-3 justify-content-center'>
						<h4>SOLICITUD DE MANTENIMIENTO CORRECTIVO</h4>
					</div>
					<div className='d-flex justify-content-end m-3'>
						<div className='d-flex m-3 mx-0 border border-dark'>
							<label className='px-3'>Centro de computo</label>
						</div>
						<div className='d-flex px-3 m-3 mx-0 border border-start-0 border-dark'>
							X
						</div>
					</div>
					<div className='d-flex justify-content-end m-3 my-0'>
						<label>Folio</label>
						<div className='d-flex px-3 m-3 mx-0 border-bottom border-dark'></div>
					</div>
					<div>
						<div className='d-flex m-3 border border-dark'>
							<label className='col-4 m-3 col-form-label'>
								Area Solicitante:
							</label>
							<select
								className='w-25 m-3 form-control'
								name='Clave_Area'
								id='Clave_Area'
								value={formik.values.Clave_Area}
								onChange={formik.handleChange}
							>
								<option value=''>Elegir Area</option>
								{!!areas &&
									areas.map((area) => {
										return (
											<option key={area.Clave_Area} value={area.Clave_Area}>
												{area.Nombre}
											</option>
										);
									})}
							</select>
						</div>
						<div className='d-flex m-3 mb-0 border border-dark'>
							<label className='col-4 m-3 col-form-label'>
								Nombre del solicitante:
							</label>
							<input
								className='w-50 m-3 col-form-label form-control'
								readOnly
								value={formik.values.Nombre_Solicitante}
							/>
						</div>
						<div className='d-flex m-3 my-0 border-top-0 border border-dark'>
							<label className='col-4 m-3 col-form-label'>
								Fecha de elaboracion:
							</label>
							<label className='col-2 m-3 col-form-label'>{formatDate}</label>
						</div>
						<div className='m-3 my-0 border-top-0 border border-dark'>
							<label className='m-3 mb-0 col-form-label'>
								Descripcion del servicio solicitado o falla a reparar:
							</label>
							<div></div>
							<div className='m-3 my-0'>
								<button
									className='border-0 bg-transparent my-2'
									onClick={() => handleVerSug()}
								>
									Sugerencias
									{verSug ? (
										<IconContext.Provider value={{ size: '20' }}>
											<IoIosArrowUp />
										</IconContext.Provider>
									) : (
										<IconContext.Provider value={{ size: '20' }}>
											<IoIosArrowDown />
										</IconContext.Provider>
									)}
									<label className='mx-2 text-secondary'>(Opcional)</label>
								</button>
							</div>
							{verSug && (
								<div className='mx-3'>
									<div className='form-check'>
										<input
											className='form-check-input'
											type='checkbox'
											id='prob1'
										/>
										<label className='form-check-label'>Problema 1</label>
									</div>
									<div className='form-check'>
										<input
											className='form-check-input'
											type='checkbox'
											id='prob2'
										/>
										<label className='form-check-label'>Problema 2</label>
									</div>
									<div className='form-check'>
										<input
											className='form-check-input'
											type='checkbox'
											id='prob3'
										/>
										<label className='form-check-label'>Problema 3</label>
									</div>
								</div>
							)}
							<label className='my-0 m-3'>
								Especifique o escriba su problema.
							</label>
							<textarea
								className='form-control m-3 w-75'
								name='Descripcion_Servicio_Falla'
								id='Descripcion_Servicio_Falla'
								value={formik.values.Descripcion_Servicio_Falla}
								onChange={formik.handleChange}
							></textarea>
						</div>
						<div className='m-3 my-0 border-top-0 border border-dark'>
							<label className='m-3 my-0 col-form-label'>
								Lugar especifico donde debe de acudir tecnico a dar
								mantenimiento.
							</label>
							<textarea
								className='form-control m-3 w-75 mt-0'
								name='Lugar_Especifico'
								id='Lugar_Especifico'
								value={formik.values.Lugar_Especifico}
								onChange={formik.handleChange}
							></textarea>
						</div>
						<div className='m-3 my-0 border-top-0 border border-dark'>
							<label className='m-3 my-0 col-form-label'>
								Horario en el que puede ser atendido el tecnico.
							</label>
							<textarea
								className='form-control m-3 w-75 mt-0'
								name='Horario_Atencion'
								id='Horario_Atencion'
								value={formik.values.Horario_Atencion}
								onChange={formik.handleChange}
							></textarea>
						</div>
					</div>
				</div>
			</div>
			<div className='container d-flex justify-content-center my-3'>
				<button
					className='btn btn-warning btn-lg m-2'
					onClick={() => handleSend()}
				>
					Enviar
				</button>
			</div>
		</>
	);
};
