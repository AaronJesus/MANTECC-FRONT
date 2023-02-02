import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { NotificationManager } from 'react-notifications';

export const Reporte = () => {
	const [areas, setAreas] = useState();
	const [ene, setEne] = useState();
	const [feb, setfeb] = useState();
	const [mar, setmar] = useState();
	const [abr, setabr] = useState();
	const [may, setmay] = useState();
	const [jun, setjun] = useState();
	const [jul, setjul] = useState();
	const [ago, setago] = useState();
	const [sep, setsep] = useState();
	const [oct, setoct] = useState();
	const [nov, setnov] = useState();
	const [dic, setdic] = useState();
	const [yearTot, setYearTot] = useState();

	const formik = useFormik({
		initialValues: {
			year: new Date().getFullYear(),
		},
	});

	const getAreas = async () => {
		try {
			const data = await fetch(process.env.REACT_APP_DEV + '/areas');
			const res = await data.json();
			setAreas(
				res.sort(function (a, b) {
					if (a.Nombre.toLowerCase() < b.Nombre.toLowerCase()) {
						return -1;
					}
					if (a.Nombre.toLowerCase() > b.Nombre.toLowerCase()) {
						return 1;
					}
					return 0;
				})
			);
		} catch (error) {
			NotificationManager.warning(
				'No se pudieron cargar las areas',
				'Error',
				3000
			);
			console.error('Get Areas ' + error);
		}
	};

	const getMeses = async () => {
		try {
			for (let index = 0; index <= 11; index++) {
				const data = await fetch(
					process.env.REACT_APP_DEV +
						`/eneProceso/${
							formik.values.year ? formik.values.year : new Date().getFullYear()
						}/${index}`
				);
				const res = await data.json();
				const dataT = await fetch(
					process.env.REACT_APP_DEV +
						`/eneTerminadas/${
							formik.values.year ? formik.values.year : new Date().getFullYear()
						}/${index}`
				);
				const resT = await dataT.json();
				const dataR = await fetch(
					process.env.REACT_APP_DEV +
						`/eneRechazadas/${
							formik.values.year ? formik.values.year : new Date().getFullYear()
						}/${index}`
				);
				const resR = await dataR.json();

				switch (index) {
					case 0:
						!!res && setEne(res);
						if (!!resT) {
							for (let index = 0; index < resT.length; index++) {
								setEne((ene) => [...ene, resT[index]]);
							}
						}
						if (!!resR) {
							for (let index = 0; index < resR.length; index++) {
								setEne((ene) => [...ene, resR[index]]);
							}
						}

						break;
					case 1:
						!!res && setfeb(res);
						if (!!resT) {
							for (let index = 0; index < resT.length; index++) {
								setfeb((feb) => [...feb, resT[index]]);
							}
						}
						if (!!resR) {
							for (let index = 0; index < resR.length; index++) {
								setfeb((feb) => [...feb, resR[index]]);
							}
						}
						break;
					case 2:
						!!res && setmar(res);
						if (!!resT) {
							for (let index = 0; index < resT.length; index++) {
								setmar((mar) => [...mar, resT[index]]);
							}
						}
						if (!!resR) {
							for (let index = 0; index < resR.length; index++) {
								setmar((mar) => [...mar, resR[index]]);
							}
						}
						break;
					case 3:
						!!res && setabr(res);
						if (!!resT) {
							for (let index = 0; index < resT.length; index++) {
								setabr((abr) => [...abr, resT[index]]);
							}
						}
						if (!!resR) {
							for (let index = 0; index < resR.length; index++) {
								setabr((abr) => [...abr, resR[index]]);
							}
						}
						break;
					case 4:
						!!res && setmay(res);
						if (!!resT) {
							for (let index = 0; index < resT.length; index++) {
								setmay((may) => [...may, resT[index]]);
							}
						}
						if (!!resR) {
							for (let index = 0; index < resR.length; index++) {
								setmay((may) => [...may, resR[index]]);
							}
						}
						break;
					case 5:
						!!res && setjun(res);
						if (!!resT) {
							for (let index = 0; index < resT.length; index++) {
								setjun((jun) => [...jun, resT[index]]);
							}
						}
						if (!!resR) {
							for (let index = 0; index < resR.length; index++) {
								setjun((jun) => [...jun, resR[index]]);
							}
						}
						break;
					case 6:
						!!res && setjul(res);
						if (!!resT) {
							for (let index = 0; index < resT.length; index++) {
								setjul((jul) => [...jul, resT[index]]);
							}
						}
						if (!!resR) {
							for (let index = 0; index < resR.length; index++) {
								setjul((jul) => [...jul, resR[index]]);
							}
						}
						break;
					case 7:
						!!res && setago(res);
						if (!!resT) {
							for (let index = 0; index < resT.length; index++) {
								setago((ago) => [...ago, resT[index]]);
							}
						}
						if (!!resR) {
							for (let index = 0; index < resR.length; index++) {
								setago((ago) => [...ago, resR[index]]);
							}
						}
						break;
					case 8:
						!!res && setsep(res);
						if (!!resT) {
							for (let index = 0; index < resT.length; index++) {
								setsep((sep) => [...sep, resT[index]]);
							}
						}
						if (!!resR) {
							for (let index = 0; index < resR.length; index++) {
								setsep((sep) => [...sep, resR[index]]);
							}
						}
						break;
					case 9:
						!!res && setoct(res);
						if (!!resT) {
							for (let index = 0; index < resT.length; index++) {
								setoct((oct) => [...oct, resT[index]]);
							}
						}
						if (!!resR) {
							for (let index = 0; index < resR.length; index++) {
								setoct((oct) => [...oct, resR[index]]);
							}
						}
						break;
					case 10:
						!!res && setnov(res);
						if (!!resT) {
							for (let index = 0; index < resT.length; index++) {
								setnov((nov) => [...nov, resT[index]]);
							}
						}
						if (!!resR) {
							for (let index = 0; index < resR.length; index++) {
								setnov((nov) => [...nov, resR[index]]);
							}
						}
						break;
					case 11:
						!!res && setdic(res);
						if (!!resT) {
							for (let index = 0; index < resT.length; index++) {
								setdic((dic) => [...dic, resT[index]]);
							}
						}
						if (!!resR) {
							for (let index = 0; index < resR.length; index++) {
								setdic((dic) => [...dic, resR[index]]);
							}
						}
						break;

					default:
						break;
				}
			}
		} catch (error) {
			NotificationManager.warning(
				'No se pudieron cargar las solicitudes',
				'Error',
				3000
			);
			console.error('Get Areas ' + error);
		}
	};

	const getAño = async () => {
		try {
			const data = await fetch(
				process.env.REACT_APP_DEV +
					`/yearTotal/${
						formik.values.year ? formik.values.year : new Date().getFullYear()
					}`
			);
			const res = await data.json();
			const dataP = await fetch(
				process.env.REACT_APP_DEV +
					`/yearProc/${
						formik.values.year ? formik.values.year : new Date().getFullYear()
					}`
			);
			const resP = await dataP.json();
			const dataT = await fetch(
				process.env.REACT_APP_DEV +
					`/yearDone/${
						formik.values.year ? formik.values.year : new Date().getFullYear()
					}`
			);
			const resT = await dataT.json();
			!!res && setYearTot(res);
			if (!!resT) {
				for (let index = 0; index < resT.length; index++) {
					setYearTot((yearTot) => [...yearTot, resT[index]]);
				}
			}
			if (!!resP) {
				for (let index = 0; index < resP.length; index++) {
					setYearTot((yearTot) => [...yearTot, resP[index]]);
				}
			}
		} catch (error) {
			NotificationManager.warning(
				'No se pudieron cargar las solicitudes',
				'Error',
				3000
			);
			console.error('Get Areas ' + error);
		}
	};

	const handleTotal = (arr) => {
		let tot = 0;
		for (let index = 0; index < arr.length; index++) {
			if (arr[index].TotalProceso) {
				tot = parseInt(tot) + arr[index].TotalProceso;
			} else if (arr[index].TotalTerminadas) {
				tot = parseInt(tot) + arr[index].TotalTerminadas;
			} else if (arr[index].TotalRechazadas) {
				tot = parseInt(tot) + arr[index].TotalRechazadas;
			} else if (arr[index].TotalAño) {
				tot = parseInt(tot) + arr[index].TotalAño;
			}
		}
		return tot;
	};

	const handleProcesos = (arr) => {
		let tot = 0;
		for (let index = 0; index < arr.length; index++) {
			if (arr[index].TotalProceso) {
				tot = parseInt(tot) + arr[index].TotalProceso;
			} else if (arr[index].AñoProceso) {
				tot = parseInt(tot) + arr[index].AñoProceso;
			}
		}
		return tot;
	};

	const handleRealizados = (arr) => {
		let tot = 0;
		for (let index = 0; index < arr.length; index++) {
			if (arr[index].TotalTerminadas) {
				tot = parseInt(tot) + arr[index].TotalTerminadas;
			} else if (arr[index].TotalRechazadas) {
				tot = parseInt(tot) + arr[index].TotalRechazadas;
			} else if (arr[index].AñoTerminado) {
				tot = parseInt(tot) + arr[index].AñoTerminado;
			}
		}
		return tot;
	};

	const handleIndice = (arr) => {
		let tot = 0;
		tot = (handleRealizados(arr) / handleTotal(arr)) * 100;
		if (!!tot) {
			if (tot.toString().length > 3) {
				return tot.toFixed(2);
			} else {
				return tot;
			}
		} else {
			return 0;
		}
	};

	const handleIndiceR = (arr, clave) => {
		let tot = 0;
		let arr2 = [];
		for (let index = 0; index < arr.length; index++) {
			if (arr[index].Clave_Area === clave) {
				arr2.push(arr[index]);
			}
		}
		tot = (handleRealizados(arr2) / handleTotal(arr2)) * 100;
		if (!!tot) {
			if (tot.toString().length > 3) {
				return tot.toFixed(2);
			} else {
				return tot;
			}
		} else {
			return 0;
		}
	};

	const handleIndiceP = (arr, clave) => {
		let tot = 0;
		let arr2 = [];
		for (let index = 0; index < arr.length; index++) {
			if (arr[index].Clave_Area === clave) {
				arr2.push(arr[index]);
			}
		}
		tot = (handleProcesos(arr2) / handleTotal(arr2)) * 100;
		if (!!tot) {
			if (tot.toString().length > 3) {
				return tot.toFixed(2);
			} else {
				return tot;
			}
		} else {
			return 0;
		}
	};

	useEffect(() => {
		getAreas();
		getMeses();
		getAño();
	}, [
		formik.values.year,
		setAreas,
		setEne,
		setfeb,
		setabr,
		setmay,
		setjun,
		setjul,
		setago,
		setsep,
		setoct,
		setnov,
		setdic,
		setYearTot,
	]);

	return (
		<>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Reporte</h1>
			</div>
			<div className='ms-5'>
				<p className='text-danger m-2'>ROJO para las solicitudes pendientes</p>
				<p className='fw-bold m-2'>NEGRO para las solicitudes terminadas</p>
				<p className='text-primary m-2'>AZUL para las solicitudes rechazadas</p>
			</div>
			<form>
				<div className='d-flex'>
					<big>
						<label className='fw-bold ms-5 m-2'>Año:</label>
					</big>
					<input
						className='form-control w-auto m-2 justify-content-end d-flex'
						name='year'
						value={formik.values.year}
						onChange={formik.handleChange}
					/>
				</div>
			</form>
			<div className='mx-4'>
				<table className='table table-sm table-bordered align-content-start'>
					<thead className='bg-blue text-white'>
						<tr>
							<th scope='col'>Departamento</th>
							<th scope='col'>Ene.</th>
							<th scope='col'>Feb.</th>
							<th scope='col'>Mar.</th>
							<th scope='col'>Abr.</th>
							<th scope='col'>Mayo</th>
							<th scope='col'>Jun.</th>
							<th scope='col'>Jul.</th>
							<th scope='col'>Ago.</th>
							<th scope='col'>Sept.</th>
							<th scope='col'>Oct.</th>
							<th scope='col'>Nov.</th>
							<th scope='col'>Dic.</th>
							<th scope='col'>Recibidos</th>
							<th scope='col'>Realizados</th>
							<th scope='col'>%Realizados</th>
							<th scope='col'>Pendientes</th>
							<th scope='col'>%Pendientes</th>
						</tr>
					</thead>
					{!!areas &&
						areas.map((area) => {
							return (
								<tbody className='bg-white fs-6'>
									<tr key={area.Clave_Area}>
										<td>
											{area.Nombre[0] + area.Nombre.slice(1).toLowerCase()}
										</td>
										<td>
											{!!ene &&
												ene
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.TotalProceso) {
															return (
																<p className='fw-bold d-inline text-danger m-1'>
																	{p.TotalProceso}
																</p>
															);
														} else if (!!p.TotalTerminadas) {
															return (
																<p className='fw-bold d-inline m-1'>
																	{p.TotalTerminadas}
																</p>
															);
														} else if (!!p.TotalRechazadas) {
															return (
																<p className='fw-bold d-inline text-primary m-1'>
																	{p.TotalRechazadas}
																</p>
															);
														}
													})}
										</td>
										<td>
											{!!feb &&
												feb
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.TotalProceso) {
															return (
																<p className='fw-bold d-inline text-danger m-1'>
																	{p.TotalProceso}
																</p>
															);
														} else if (!!p.TotalTerminadas) {
															return (
																<p className='fw-bold d-inline m-1'>
																	{p.TotalTerminadas}
																</p>
															);
														} else if (!!p.TotalRechazadas) {
															return (
																<p className='fw-bold d-inline text-primary m-1'>
																	{p.TotalRechazadas}
																</p>
															);
														}
													})}
										</td>
										<td>
											{!!mar &&
												mar
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.TotalProceso) {
															return (
																<p className='fw-bold d-inline text-danger m-1'>
																	{p.TotalProceso}
																</p>
															);
														} else if (!!p.TotalTerminadas) {
															return (
																<p className='fw-bold d-inline m-1'>
																	{p.TotalTerminadas}
																</p>
															);
														} else if (!!p.TotalRechazadas) {
															return (
																<p className='fw-bold d-inline text-primary m-1'>
																	{p.TotalRechazadas}
																</p>
															);
														}
													})}
										</td>
										<td>
											{!!abr &&
												abr
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.TotalProceso) {
															return (
																<p className='fw-bold d-inline text-danger m-1'>
																	{p.TotalProceso}
																</p>
															);
														} else if (!!p.TotalTerminadas) {
															return (
																<p className='fw-bold d-inline m-1'>
																	{p.TotalTerminadas}
																</p>
															);
														} else if (!!p.TotalRechazadas) {
															return (
																<p className='fw-bold d-inline text-primary m-1'>
																	{p.TotalRechazadas}
																</p>
															);
														}
													})}
										</td>
										<td>
											{!!may &&
												may
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.TotalProceso) {
															return (
																<p className='fw-bold d-inline text-danger m-1'>
																	{p.TotalProceso}
																</p>
															);
														} else if (!!p.TotalTerminadas) {
															return (
																<p className='fw-bold d-inline m-1'>
																	{p.TotalTerminadas}
																</p>
															);
														} else if (!!p.TotalRechazadas) {
															return (
																<p className='fw-bold d-inline text-primary m-1'>
																	{p.TotalRechazadas}
																</p>
															);
														}
													})}
										</td>
										<td>
											{!!jun &&
												jun
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.TotalProceso) {
															return (
																<p className='fw-bold d-inline text-danger m-1'>
																	{p.TotalProceso}
																</p>
															);
														} else if (!!p.TotalTerminadas) {
															return (
																<p className='fw-bold d-inline m-1'>
																	{p.TotalTerminadas}
																</p>
															);
														} else if (!!p.TotalRechazadas) {
															return (
																<p className='fw-bold d-inline text-primary m-1'>
																	{p.TotalRechazadas}
																</p>
															);
														}
													})}
										</td>
										<td>
											{!!jul &&
												jul
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.TotalProceso) {
															return (
																<p className='fw-bold d-inline text-danger m-1'>
																	{p.TotalProceso}
																</p>
															);
														} else if (!!p.TotalTerminadas) {
															return (
																<p className='fw-bold d-inline m-1'>
																	{p.TotalTerminadas}
																</p>
															);
														} else if (!!p.TotalRechazadas) {
															return (
																<p className='fw-bold d-inline text-primary m-1'>
																	{p.TotalRechazadas}
																</p>
															);
														}
													})}
										</td>
										<td>
											{!!ago &&
												ago
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.TotalProceso) {
															return (
																<p className='fw-bold d-inline text-danger m-1'>
																	{p.TotalProceso}
																</p>
															);
														} else if (!!p.TotalTerminadas) {
															return (
																<p className='fw-bold d-inline m-1'>
																	{p.TotalTerminadas}
																</p>
															);
														} else if (!!p.TotalRechazadas) {
															return (
																<p className='fw-bold d-inline text-primary m-1'>
																	{p.TotalRechazadas}
																</p>
															);
														}
													})}
										</td>
										<td>
											{!!sep &&
												sep
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.TotalProceso) {
															return (
																<p className='fw-bold d-inline text-danger m-1'>
																	{p.TotalProceso}
																</p>
															);
														} else if (!!p.TotalTerminadas) {
															return (
																<p className='fw-bold d-inline m-1'>
																	{p.TotalTerminadas}
																</p>
															);
														} else if (!!p.TotalRechazadas) {
															return (
																<p className='fw-bold d-inline text-primary m-1'>
																	{p.TotalRechazadas}
																</p>
															);
														}
													})}
										</td>
										<td>
											{!!oct &&
												oct
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.TotalProceso) {
															return (
																<p className='fw-bold d-inline text-danger m-1'>
																	{p.TotalProceso}
																</p>
															);
														} else if (!!p.TotalTerminadas) {
															return (
																<p className='fw-bold d-inline m-1'>
																	{p.TotalTerminadas}
																</p>
															);
														} else if (!!p.TotalRechazadas) {
															return (
																<p className='fw-bold d-inline text-primary m-1'>
																	{p.TotalRechazadas}
																</p>
															);
														}
													})}
										</td>
										<td>
											{!!nov &&
												nov
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.TotalProceso) {
															return (
																<p className='fw-bold d-inline text-danger m-1'>
																	{p.TotalProceso}
																</p>
															);
														} else if (!!p.TotalTerminadas) {
															return (
																<p className='fw-bold d-inline m-1'>
																	{p.TotalTerminadas}
																</p>
															);
														} else if (!!p.TotalRechazadas) {
															return (
																<p className='fw-bold d-inline text-primary m-1'>
																	{p.TotalRechazadas}
																</p>
															);
														}
													})}
										</td>
										<td>
											{!!dic &&
												dic
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.TotalProceso) {
															return (
																<p className='fw-bold d-inline text-danger m-1'>
																	{p.TotalProceso}
																</p>
															);
														} else if (!!p.TotalTerminadas) {
															return (
																<p className='fw-bold d-inline m-1'>
																	{p.TotalTerminadas}
																</p>
															);
														} else if (!!p.TotalRechazadas) {
															return (
																<p className='fw-bold d-inline text-primary m-1'>
																	{p.TotalRechazadas}
																</p>
															);
														}
													})}
										</td>
										<td>
											{/* Total x dep del año */}
											{!!yearTot &&
											yearTot.filter((y) => y.Clave_Area === area.Clave_Area)
												.length === 0 ? (
												<p className='fw-bold text-success m-1'>0</p>
											) : (
												''
											)}
											{!!yearTot &&
												yearTot
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.TotalAño) {
															return (
																<p className='fw-bold text-success m-1'>
																	{p.TotalAño}
																</p>
															);
														}
													})}
										</td>
										<td>
											{/* Realizados x dep del año */}
											{!!yearTot &&
												yearTot
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.AñoTerminado) {
															return (
																<p className='fw-bold m-1'>{p.AñoTerminado}</p>
															);
														}
													})}
										</td>
										<td>
											{/* % Realizados x dep del año */}
											{!!yearTot && (
												<p className='fw-bold text-success m-1'>
													{handleIndiceR(yearTot, area.Clave_Area)}%
												</p>
											)}
										</td>
										<td>
											{/* Pendientes x dep del año */}
											{!!yearTot &&
												yearTot
													.filter((pro) => pro.Clave_Area === area.Clave_Area)
													.map((p) => {
														if (!!p.AñoProceso) {
															return (
																<p className='fw-bold text-danger m-1'>
																	{p.AñoProceso}
																</p>
															);
														}
													})}
										</td>
										<td>
											{/* %PEndientes x dep del año */}
											{!!yearTot && (
												<p className='fw-bold text-success m-1'>
													{handleIndiceP(yearTot, area.Clave_Area)}%
												</p>
											)}
										</td>
									</tr>
								</tbody>
							);
						})}
					<tbody className='table-secondary'>
						<tr>
							<td>Solicitados</td>
							<td>{!!ene && handleTotal(ene)}</td>
							<td>{!!feb && handleTotal(feb)}</td>
							<td>{!!mar && handleTotal(mar)}</td>
							<td>{!!abr && handleTotal(abr)}</td>
							<td>{!!may && handleTotal(may)}</td>
							<td>{!!jun && handleTotal(jun)}</td>
							<td>{!!jul && handleTotal(jul)}</td>
							<td>{!!ago && handleTotal(ago)}</td>
							<td>{!!sep && handleTotal(sep)}</td>
							<td>{!!oct && handleTotal(oct)}</td>
							<td>{!!nov && handleTotal(nov)}</td>
							<td>{!!dic && handleTotal(dic)}</td>
							<td>{!!yearTot && handleTotal(yearTot)}</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td>Faltan por realizar</td>
							<td>{!!ene && handleProcesos(ene)}</td>
							<td>{!!feb && handleProcesos(feb)}</td>
							<td>{!!mar && handleProcesos(mar)}</td>
							<td>{!!abr && handleProcesos(abr)}</td>
							<td>{!!may && handleProcesos(may)}</td>
							<td>{!!jun && handleProcesos(jun)}</td>
							<td>{!!jul && handleProcesos(jul)}</td>
							<td>{!!ago && handleProcesos(ago)}</td>
							<td>{!!sep && handleProcesos(sep)}</td>
							<td>{!!oct && handleProcesos(oct)}</td>
							<td>{!!nov && handleProcesos(nov)}</td>
							<td>{!!dic && handleProcesos(dic)}</td>
							<td>{!!yearTot && handleProcesos(yearTot)}</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td>Total realizados</td>
							<td>{!!ene && handleRealizados(ene)}</td>
							<td>{!!feb && handleRealizados(feb)}</td>
							<td>{!!mar && handleRealizados(mar)}</td>
							<td>{!!abr && handleRealizados(abr)}</td>
							<td>{!!may && handleRealizados(may)}</td>
							<td>{!!jun && handleRealizados(jun)}</td>
							<td>{!!jul && handleRealizados(jul)}</td>
							<td>{!!ago && handleRealizados(ago)}</td>
							<td>{!!sep && handleRealizados(sep)}</td>
							<td>{!!oct && handleRealizados(oct)}</td>
							<td>{!!nov && handleRealizados(nov)}</td>
							<td>{!!dic && handleRealizados(dic)}</td>
							<td>{!!yearTot && handleRealizados(yearTot)}</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td>Indice de mantenimiento</td>
							<td>{!!ene && handleIndice(ene)}%</td>
							<td>{!!feb && handleIndice(feb)}%</td>
							<td>{!!mar && handleIndice(mar)}%</td>
							<td>{!!abr && handleIndice(abr)}%</td>
							<td>{!!may && handleIndice(may)}%</td>
							<td>{!!jun && handleIndice(jun)}%</td>
							<td>{!!jul && handleIndice(jul)}%</td>
							<td>{!!ago && handleIndice(ago)}%</td>
							<td>{!!sep && handleIndice(sep)}%</td>
							<td>{!!oct && handleIndice(oct)}%</td>
							<td>{!!nov && handleIndice(nov)}%</td>
							<td>{!!dic && handleIndice(dic)}%</td>
							<td>{!!yearTot && handleIndice(yearTot)}%</td>
							<td></td>
							<td>{!!yearTot && handleIndice(yearTot)}%</td>
							<td></td>
							<td>{!!yearTot && 100 - handleIndice(yearTot)}%</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
};
