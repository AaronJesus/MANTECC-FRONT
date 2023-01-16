import { NavLink } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/NavbarStyles.css';
import Swal from 'sweetalert2';

export const TablaProblemas = ({ prob, cargando }) => {
	const handleDel = async (idP) => {
		Swal.fire({
			title: 'Seguro que desea eliminar el problema?',
			showDenyButton: true,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			denyButtonText: `Eliminar`,
		}).then(async (result) => {
			if (result.isDenied) {
				try {
					const data = await fetch(`http://localhost:4000/problema/${idP}`, {
						method: 'DELETE',
					});
					await data.json();
					window.location.reload(false);
				} catch (error) {
					console.log(error);
					console.log('trono delete');
				}
			}
		});
	};

	if (cargando) {
		return (
			<h1 className='d-flex justify-content-center'>Cargando problemas...</h1>
		);
	}

	return (
		<>
			<div className='d-flex m-3 mx-5 justify-content-center '>
				{!!prob && prob.length ? (
					<table className='table table-sm table-hover text-center align-middle'>
						<thead className='bg-blue text-white'>
							<tr>
								<th scope='col'>Descripcion</th>
								<th scope='col'>Tipo de problema</th>
								<th scope='col'>Opciones</th>
							</tr>
						</thead>
						<tbody className='bg-white'>
							{prob.map((problema) => {
								return (
									<tr key={problema.idProblema}>
										<td>{problema.Descripcion}</td>
										<td>{problema.Tipo}</td>
										<td>
											<NavLink
												className='btn btn-success btn-sm m-2'
												to={`/editar_problemas/${problema.idProblema}`}
											>
												Editar
											</NavLink>
											<button
												className='btn btn-danger btn-sm m-2'
												onClick={() => handleDel(problema.idProblema)}
											>
												Eliminar
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				) : (
					<h1>No hay problemas para mostrar</h1>
				)}
			</div>
		</>
	);
};
