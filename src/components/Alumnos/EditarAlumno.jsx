import { NavLink } from 'react-router-dom';

export const EditarAlumno = () => {
	return (
		<div className='container'>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Editar Alumno</h1>
			</div>
			<div>
				<div className='d-flex my-3'>
					<label className='col-2 col-form-label'>Nombre de usuario:</label>
					<input type='text' className='form-control w-50' />

					<label className='mx-3 col-form-label w-25'>Tipo de usuario:</label>
					<select className='form-control w-50'>
						<option>Admin</option>
						<option>Cliente</option>
						<option>Alumno</option>
					</select>
				</div>
				<div className='d-flex my-3'>
					<label className='col-2 col-form-label'>Nombre completo:</label>
					<input type='text' className='form-control' />
				</div>
				<div className='d-flex my-3'>
					<label className='col-2 col-form-label'>Numero de control:</label>
					<input type='text' className='form-control w-25' />

					<label className='mx-3 col-form-label w-25'>
						Clave y nombre de la carrera:
					</label>
					<select className='form-control w-50'>
						<option>Clave-Nombre 1</option>
						<option>Clave-Nombre 2</option>
						<option>Clave-Nombre 3</option>
					</select>
				</div>
				<div className='my-3'>
					<label className='col-2 col-form-label'>Cambiar contraseña</label>
				</div>
				<div>
					<label className='col-2 col-form-label'>Nueva contraseña:</label>
					<input type='text' className='form-control w-25 mx-3' />
					<label className='col-2 col-form-label'>Repetir contraseña:</label>
					<input type='text' className='form-control w-25 mx-3' />
				</div>
				<div className='d-flex justify-content-end'>
					<button className='btn btn-warning m-2' type='submit'>
						Guardar
					</button>
					<NavLink className='btn btn-primary m-2' to='/alumnos'>
						Regresar
					</NavLink>
				</div>
			</div>
		</div>
	);
};
