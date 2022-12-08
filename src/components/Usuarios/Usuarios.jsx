import { useEffect } from 'react';
import { useState } from 'react';
import { Paginacion } from '../Extras/Paginacion';
import { TablaUsuarios } from './TablaUsuarios';
import { NavLink } from 'react-router-dom';
export const Usuarios = () => {
	const [users, setUsers] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [postPerPage] = useState(10);
	const [currentPosts, setcurrentPosts] = useState();
	const [cargando, setCargando] = useState();

	const lastPost = currentPage * postPerPage;
	const firstPost = lastPost - postPerPage;

	const getUsers = async () => {
		setCargando(true);
		try {
			const data = await fetch('http://localhost:4000/usuarios');
			const res = await data.json();
			!!res && setUsers(res);
			setCargando(false);
		} catch (error) {
			console.log('trono users');
			console.log(error);
		}
	};

	const paginar = (pageNumber) => setCurrentPage(pageNumber);

	useEffect(() => {
		getUsers();
	}, [setCargando]);

	useEffect(() => {
		if (!!users) {
			setcurrentPosts(users.slice(firstPost, lastPost));
		}
	}, [users, currentPage, setUsers]);

	return (
		<>
			<div className='m-3'>
				<NavLink
					className='btn btn-primary btn-lg mx-5 float-end'
					to='/nuevo_usuario'
				>
					Nuevo
				</NavLink>
				<h1 className='d-flex justify-content-center'>Usuarios</h1>
			</div>

			{!!users && (
				<>
					<TablaUsuarios users={currentPosts} cargando={cargando} />
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
