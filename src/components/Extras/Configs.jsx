import { useEffect } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

export const Configs = () => {
	const [configs, setConfigs] = useState();
	const [periodo, setPeriodo] = useState();

	const getData = async () => {
		try {
			const dataConf = await fetch('http://localhost:4000/configs');
			const resC = await dataConf.json();
			setConfigs(resC);
			const dataP = await fetch('http://localhost:4000/periodos');
			const resP = await dataP.json();
			setPeriodo(resP);
		} catch (error) {
			NotificationManager.warning(
				'Hubo un error al descargar las configuraciones',
				'Error',
				3000
			);
			console.log(error);
			console.log('Trono get data');
		}
	};

	useEffect(() => {
		getData();
	}, [setConfigs]);

	return (
		<>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Configuraciones</h1>
			</div>
			<div className='container'>
				{!!configs ? (
					configs.map((c) => {
						return (
							<div key={c.idConfig} className='d-flex m-3'>
								<label className='col-4 col-form-label'>
									{c.Nombre_Campo}:
								</label>
								{c.idConfig === 2 ? (
									!!periodo &&
									periodo
										.filter((per) => per.idPeriodo === parseInt(c.Valor))
										.map((p) => {
											return (
												<input
													key={p.idPeriodo}
													type='text'
													className='form-control w-25'
													value={p.Periodo}
													disabled
												/>
											);
										})
								) : (
									<input
										type='text'
										className='form-control w-25'
										value={c.Valor}
										disabled
									/>
								)}

								<NavLink
									className='btn btn-success mx-5'
									to={`/config/${c.idConfig}`}
								>
									Editar
								</NavLink>
							</div>
						);
					})
				) : (
					<h1 className='d-flex justify-content-center'>
						No se recuperaron Configuraciones
					</h1>
				)}
			</div>
		</>
	);
};
