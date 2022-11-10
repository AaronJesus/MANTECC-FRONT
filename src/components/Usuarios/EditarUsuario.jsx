import { NavLink } from 'react-router-dom';

export const EditarUsuario = () => {
	return (
		<div className='container'>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Editar Usuario</h1>
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
					<NavLink className='btn btn-primary m-2' to='/usuarios'>
						Regresar
					</NavLink>
				</div>
			</div>
		</div>
	);
};
