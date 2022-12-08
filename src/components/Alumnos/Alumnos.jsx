import { useEffect } from 'react';
import { useState } from 'react';
import { Paginacion } from '../Extras/Paginacion';
import { TablaAlumnos } from './TablaAlumnos';
import { NavLink } from 'react-router-dom';

export const Alumnos = () => {
	const [users, setUsers] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [postPerPage] = useState(10);
	const [currentPosts, setcurrentPosts] = useState();
	const [cargando, setCargando] = useState();

	const lastPost = currentPage * postPerPage;
	const firstPost = lastPost - postPerPage;

	const getData = async () => {
		setCargando(true);
		try {
			const data = await fetch('http://localhost:4000/alumnos');
			const res = await data.json();
			setUsers(res[0]);
			setCargando(false);
		} catch (error) {
			console.log('Trono get');
			console.log(error);
		}
	};

	const paginar = (pageNumber) => setCurrentPage(pageNumber);

	useEffect(() => {
		getData();
	}, [setCargando]);

	useEffect(() => {
		if (!!users) {
			setcurrentPosts(users.slice(firstPost, lastPost));
		}
	}, [users, currentPage]);

	return (
		<>
			<div className='m-3'>
				<NavLink
					className='btn btn-primary btn-lg mx-5 float-end'
					to='/nuevo_alumno'
				>
					Nuevo
				</NavLink>
				<h1 className='d-flex justify-content-center'>Alumnos</h1>
			</div>

			{!!users && (
				<>
					<TablaAlumnos users={currentPosts} cargando={cargando} />
					<Paginacion
						postPerPage={postPerPage}
						totalPosts={users.length}
						paginar={paginar}
					/>
				</>
			)}
		</>
	);
};
