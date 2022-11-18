import ith_logo from '../../assets/ith_logo.jpg';
import 'react-datepicker/dist/react-datepicker.css';
import Moment from 'moment/moment';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const CalificarOrden = () => {
	const { id } = useParams();
	const [date, setDate] = useState('');
	const [vals, setVals] = useState();

	const formik = useFormik({
		initialValues: {
			Calificacion_Servicio: '',
			Comentario_Servicio: '',
		},
	});

	const getRev = async () => {
		try {
			//3 es el numero de la revision
			const dataConf = await fetch(`http://localhost:4000/config/3`);
			const resC = await dataConf.json();
			!!resC && setRev(resC[0]);
		} catch (error) {
			console.log(error);
			console.log('Trono get Data');
		}
	};
	const [rev, setRev] = useState();

	const handleSend = async () => {
		try {
			const data = await fetch(`http://localhost:4000/orden/${id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					Calificacion_Servicio: parseInt(formik.values.Calificacion_Servicio),
					Comentario_Servicio: formik.values.Comentario_Servicio,
				}),
			});
			await data.json();
			window.alert('Liston');
		} catch (error) {
			window.alert('Trono krnal');
			console.log(error);
		}
	};
	const getDatos = async () => {
		try {
			const data = await fetch(`http://localhost:4000/orden/${id}`);
			const res = await data.json();
			if (!!res[0]) {
				setVals(res[0]);
				setDate(
					new Date(
						res[0].Fecha_Realizacion.replace(/-/g, '/').replace(/T.+/, '')
					)
				);
			}
		} catch (error) {
			console.error('Cant get data ' + error);
		}
	};
	useEffect(() => {
		getDatos();
		getRev();
	}, [setRev]);

	return (
		<>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Ver Orden</h1>
			</div>
			<div className='container bg-white pb-5 border border-dark'>
				<div className='container'>
					<table className='table text-center table-bordered border-dark align-middle m-3'>
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
									Formato para Orden de Trabajo de Mantenimiento
								</th>
								<th scope='col'>Codigo: ITH-AD-PO-001-04</th>
							</tr>
							<tr>
								<th scope='col'>
									Referencia al punto de la norma ISO 9001:2015 7.1.3, 8.4
								</th>
								<th scope='col'>Revison: {!!rev && rev.Valor}</th>
							</tr>
						</tbody>
					</table>
					<div className='d-flex m-3 justify-content-center'>
						<h4>ORDEN DE TRABAJO DE MANTENIMIENTO</h4>
					</div>
					<div className='d-flex justify-content-end m-3 my-0'>
						<label>Numero de control:</label>
						<div className='d-flex px-3 border-bottom border-dark'>
							{!!vals && vals.No_Control}
						</div>
					</div>
					<div>
						<div className='d-flex m-3 mb-0 border border-dark'>
							<label className='col-4 m-3 col-form-label'>Mantenimiento:</label>
							<div className='d-flex'>
								<div className='form-check m-3'>
									<input
										className='form-check-input'
										type='radio'
										name='flexRadioDefault'
										disabled
									/>
									<label
										className='form-check-label'
										htmlFor='flexRadioDefault1'
									>
										Interno
									</label>
								</div>
								<div className='form-check m-3'>
									<input
										className='form-check-input'
										type='radio'
										name='flexRadioDefault'
										disabled
									/>
									<label
										className='form-check-label'
										htmlFor='flexRadioDefault2'
									>
										Externo
									</label>
								</div>
							</div>
						</div>
						<div className='d-flex m-3 my-0 border-top-0 border border-dark'>
							<label className=' col-4 m-3 mb-0 col-form-label'>
								Tipo de servicio:
							</label>
							<input
								type='text'
								className=' form-control m-3 w-75'
								disabled
								value={!!vals && vals.Tipo_Servicio}
							/>
						</div>
						<div className='d-flex m-3 my-0 border-top-0 border border-dark'>
							<label className='col-4 m-3 col-form-label'>Asignado a:</label>
							<input
								type='text'
								className=' form-control m-3 w-75'
								disabled
								value={!!vals && vals.Asignado_a}
							/>
						</div>
						<div className='d-flex m-3 mb-0 border border-dark'>
							<label className='col-4 m-3 col-form-label'>
								Fecha de realizacion:
							</label>
							<label className='col-4 m-3 col-form-label'>
								{!!date && Moment(date).format('DD/MM/YYYY')}
							</label>
						</div>
						<div className='m-3 my-0 border-top-0 border border-dark'>
							<label className='m-3 mb-0 col-form-label'>
								Trabajo Realizado:
							</label>
							<textarea
								className='form-control m-3 w-75'
								disabled
								value={!!vals && vals.Trabajo_Realizado}
							></textarea>
						</div>
						<div className='m-3 my-0 border border-top-0 border-bottom-0 border-dark'>
							<label className='col-4 m-3 mb-0 col-form-label'>
								Calificacion del servicio:
							</label>
							<div className='d-flex ms-5' onChange={formik.handleChange}>
								<div className='form-check m-3'>
									<input
										className='form-check-input'
										type='radio'
										name='Calificacion_Servicio'
										value={10}
										id='flexRadioDefault1'
									/>
									<label
										className='form-check-label'
										htmlFor='flexRadioDefault1'
									>
										Excelente
									</label>
								</div>
								<div className='form-check m-3'>
									<input
										className='form-check-input'
										type='radio'
										name='Calificacion_Servicio'
										value={9}
										id='flexRadioDefault2'
									/>
									<label
										className='form-check-label'
										htmlFor='flexRadioDefault2'
									>
										Muy bien
									</label>
								</div>
								<div className='form-check m-3'>
									<input
										className='form-check-input'
										type='radio'
										name='Calificacion_Servicio'
										value={8}
										id='flexRadioDefault2'
									/>
									<label
										className='form-check-label'
										htmlFor='flexRadioDefault2'
									>
										Bueno
									</label>
								</div>
								<div className='form-check m-3'>
									<input
										className='form-check-input'
										type='radio'
										value={7}
										name='Calificacion_Servicio'
										id='flexRadioDefault2'
									/>
									<label
										className='form-check-label'
										htmlFor='flexRadioDefault2'
									>
										Regular
									</label>
								</div>
								<div className='form-check m-3'>
									<input
										className='form-check-input'
										type='radio'
										name='Calificacion_Servicio'
										value={6}
										id='flexRadioDefault2'
									/>
									<label
										className='form-check-label'
										htmlFor='flexRadioDefault2'
									>
										Malo
									</label>
								</div>
							</div>
						</div>
						<div className='m-3 my-0 border-top-0 border border-dark'>
							<label className='mb-0 m-3'>Comentarios del servicio:</label>
							<textarea
								className='form-control m-3 w-75'
								name='Comentario_Servicio'
								onChange={formik.handleChange}
							></textarea>
						</div>
						<div className='d-inline-flex w-100'>
							<div className='d-flex ms-3 my-0 border-top-0 border border-dark w-50'>
								<label className='w-50 m-3 col-form-label'>
									Verificado y Liberado Por:
								</label>
								<label className='w-75 m-3 form-control'>
									{!!vals && vals.Liberado_Por}
								</label>
							</div>
							<div className='d-flex me-3 border-top-0 border border-dark w-50'>
								<label className='w-25 m-3 col-form-label'>
									Fecha y Firma:
								</label>
								<label className='w-75 m-3 form-control'>
									{!!date && Moment(date).format('DD/MM/YYYY')}
								</label>
							</div>
						</div>
						<div></div>
						<div className='d-inline-flex w-100'>
							<div className='d-flex ms-3 my-0 border-top-0 border border-dark w-50'>
								<label className='w-50 m-3 col-form-label'>Aprobado por:</label>
								<label className='w-75 m-3 form-control'>
									{!!vals && vals.Aprobado_Por}
								</label>
							</div>
							<div className='d-flex me-3 border-top-0 border border-dark w-50'>
								<label className='w-25 m-3 col-form-label'>
									Fecha y Firma:
								</label>
								<label className='w-75 m-3 form-control'>
									{!!date && Moment(date).format('DD/MM/YYYY')}
								</label>
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
					</div>
				</div>
			</div>
		</>
	);
};
