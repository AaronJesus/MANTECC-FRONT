import { NavLink, useParams } from 'react-router-dom';
import Moment from 'moment';
import ith_logo from '../../assets/ith_logo.jpg';
import { useEffect, useState } from 'react';

export const VerSolicitud = () => {
	const { id } = useParams();
	const [val, setVal] = useState();
	const [fecha, setFecha] = useState();
	const [dpto, setDpto] = useState();
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
	const getDatos = async () => {
		try {
			const data = await fetch(`http://localhost:4000/solicitud/${id}`);
			const res = await data.json();
			if (!!res) {
				const getArea = await fetch(
					`http://localhost:4000/area/${res[0].Clave_Area}`
				);
				const resArea = await getArea.json();
				!!resArea && setDpto(resArea[0].Nombre);
			}
			if (!!res[0]) {
				setVal(res[0]);
				setFecha(
					new Date(
						res[0].Fecha_Elaboracion.replace(/-/g, '/').replace(/T.+/, '')
					)
				);
			}
		} catch (error) {
			console.error('Cant get data' + error);
		}
	};
	useEffect(() => {
		getDatos();
		getRev();
	}, [setRev]);

	return (
		<>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Ver Solicitud</h1>
			</div>
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
								<th scope='col'>Revision: {!!rev && rev.Valor}</th>
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
						<label className='m-3 mx-1'>Folio</label>
						<div className='d-flex m-3 mx-0 border-bottom border-dark'>
							{!!val && val.Folio_Completo}
						</div>
					</div>
					<div>
						<div className='d-flex m-3 border border-dark'>
							<label className='col-4 m-3 col-form-label'>
								Area Solicitante:
							</label>
							<label className='col-4 m-3 col-form-label'>
								{!!dpto && dpto}
							</label>
						</div>
						<div className='d-flex m-3 mb-0 border border-dark'>
							<label className='col-4 m-3 col-form-label'>
								Nombre del solicitante:
							</label>
							<label className='col-4 m-3 col-form-label'>
								{!!val && val.Nombre_Solicitante}
							</label>
						</div>
						<div className='d-flex m-3 my-0 border-top-0 border border-dark'>
							<label className='col-4 m-3 col-form-label'>
								Fecha de elaboracion:
							</label>
							<label className='col-2 m-3 col-form-label'>
								{!!fecha && Moment(fecha).format('DD/MM/YYYY')}
							</label>
						</div>
						<div className='m-3 my-0 border-top-0 border border-dark'>
							<label className='m-3 mb-0 col-form-label'>
								Descripcion del servicio solicitado o falla a reparar:
							</label>
							<textarea
								className='form-control m-3 w-75'
								readOnly
								value={!!val && val.Descripcion_Servicio_Falla}
							></textarea>
						</div>
						<div className='m-3 my-0 border-top-0 border border-dark'>
							<label className='m-3 my-0 col-form-label'>
								Lugar especifico donde debe de acudir tecnico a dar
								mantenimiento.
							</label>
							<textarea
								className='form-control m-3 w-75 mt-0'
								readOnly
								value={!!val && val.Lugar_Especifico}
							></textarea>
						</div>
						<div className='m-3 my-0 border-top-0 border border-dark'>
							<label className='m-3 my-0 col-form-label'>
								Horario en el que puede ser atendido el tecnico.
							</label>
							<textarea
								className='form-control m-3 w-75 mt-0'
								readOnly
								value={!!val && val.Horario_Atencion}
							></textarea>
						</div>
						<div className='d-flex m-3 my-0 border border-top-0 border-dark'>
							<label className='col-4 m-3 col-form-label'>Asignado a:</label>
							<label className='col-4 m-3 col-form-label'>
								{!!val && val.Asignado_a}
							</label>
						</div>
					</div>
				</div>
			</div>
			<div className='container d-flex justify-content-center my-3'>
				<NavLink className='btn btn-primary btn-lg m-2' to='/solicitudes'>
					Regresar
				</NavLink>
			</div>
		</>
	);
};
