import { NavLink } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/NavbarStyles.css';
const problemas = [
	{
		id: 1,
		problema: 'Problema 1',
		tipo: 'Admin',
	},
	{
		id: 2,
		problema: 'Problema 2',
		tipo: 'Admin',
	},
	{
		id: 3,
		problema: 'Problema 2',
		tipo: 'Cliente',
	},
];

export const EditarProblemas = () => {
	return (
		<>
			<div className='d-flex m-3 justify-content-center'>
				<h1>Problemas</h1>
			</div>
			<div className='d-flex m-5 my-0 justify-content-center '>
				<table className='table table-hover text-center align-middle'>
					<thead className='bg-blue text-white'>
						<tr>
							<th scope='col'>Descripcion</th>
							<th scope='col'>Tipo de problema</th>
							<th scope='col'>Opciones</th>
						</tr>
					</thead>
					<tbody className='bg-white'>
						<tr>
							<td>
								<input className='form-control' />
							</td>
							<td>
								<select className='form-control'>
									<option>Admin</option>
									<option>Cliente</option>
								</select>
							</td>
							<td>
								<NavLink className='btn btn-warning m-2' to='/problemas'>
									Guardar
								</NavLink>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
};
