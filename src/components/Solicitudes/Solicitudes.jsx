import { useState } from 'react';
import { TablaSolicitudes } from './TablaSolicitudes';
import { TablaTerminadas } from './TablaTerminadas';

export const Solicitudes = () => {
	const [a, setA] = useState(1);

	return (
		<>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Solicitudes</h1>
			</div>

			<div className='d-flex m-3 mx-5 justify-content-end'>
				<button className='btn btn-primary mx-2' onClick={() => setA(1)}>
					En proceso
				</button>
				<button className='btn btn-primary mx-2' onClick={() => setA(2)}>
					Terminadas
				</button>
			</div>
			{a === 1 ? <TablaSolicitudes /> : <TablaTerminadas />}
		</>
	);
};
