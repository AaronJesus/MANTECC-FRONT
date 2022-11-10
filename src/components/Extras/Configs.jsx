import { useState } from 'react';

export const Configs = () => {
	const [edit, setEdit] = useState(false);
	const handleEdit = () => {
		setEdit(!edit);
	};
	return (
		<>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Configuraciones</h1>
			</div>
			<div className='container'>
				<div className='d-flex m-3'>
					<label className='col-4 col-form-label'>
						Revision de los documentos:
					</label>
					<input type='text' className='form-control w-25' disabled={!edit} />
				</div>
				<div className='d-flex m-3'>
					<label className='col-4 col-form-label'>
						Asignado por defecto a:
					</label>
					<select className='w-25 form-control' disabled={!edit}>
						<option>Ray Nuztas</option>
						<option>Alumno Servicio 1</option>
						<option>Alumno Servicio 2</option>
					</select>
				</div>
				<div className='d-flex m-3'>
					<label className='col-4 col-form-label'>Aprobado por defecto:</label>
					<select className='w-25 form-control' disabled={!edit}>
						<option>Ana Alicia Valenzuela Huerta</option>
						<option>etc</option>
						<option>etc</option>
					</select>
				</div>
				<div className='d-flex justify-content-center'>
					{edit ? (
						<button
							className='btn btn-warning btn-lg'
							onClick={() => handleEdit()}
						>
							Guardar
						</button>
					) : (
						<button
							className='btn btn-success btn-lg'
							onClick={() => handleEdit()}
						>
							Editar
						</button>
					)}
				</div>
			</div>
		</>
	);
};
