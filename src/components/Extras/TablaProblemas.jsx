import { NavLink } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/NavbarStyles.css';
import { useEffect } from 'react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export const TablaProblemas = () => {
	const [prob, setProb] = useState();
	const [estcheck, setEstchek] = useState(true);

	const getData = async () => {
		const data = await fetch('http://localhost:4000/problemas');
		const res = await data.json();
		setProb(res);
	};

	const handleDel = async (idP) => {
		Swal.fire({
			title: 'Seguro que desea eliminar el alumno?',
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
					setEstchek(!estcheck);
				} catch (error) {
					console.log(error);
					console.log('trono delete');
				}
			}
		});
	};

	useEffect(() => {
		getData();
	}, [setProb, estcheck]);

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
						{!!prob &&
							prob.map((problema) => {
								return (
									<tr key={problema.idProblema}>
										<td>{problema.Descripcion}</td>
										<td>{problema.Tipo}</td>
										<td>
											<NavLink
												className='btn btn-success m-2'
												to={`/editar_problemas/${problema.idProblema}`}
											>
												Editar
											</NavLink>
											<button
												className='btn btn-danger m-2'
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
			</div>
			<div className='d-flex justify-content-center'>
				<NavLink className='btn btn-primary btn-lg m-2' to='/editar_problemas'>
					Nuevo
				</NavLink>
			</div>
		</>
	);
};
