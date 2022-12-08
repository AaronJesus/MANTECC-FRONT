import { useEffect } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Paginacion } from '../Extras/Paginacion';
import { TablaProblemas } from './TablaProblemas';

export const Problemas = () => {
	const [prob, setProb] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [postPerPage] = useState(10);
	const [currentPosts, setcurrentPosts] = useState();
	const [cargando, setCargando] = useState();

	const lastPost = currentPage * postPerPage;
	const firstPost = lastPost - postPerPage;

	const getData = async () => {
		setCargando(true);
		try {
			const data = await fetch('http://localhost:4000/problemas');
			const res = await data.json();
			setProb(res);
			setCargando(false);
		} catch (error) {
			console.log(error);
			console.log('Cant get data');
		}
	};

	const paginar = (pageNumber) => setCurrentPage(pageNumber);

	useEffect(() => {
		getData();
	}, [setCargando]);

	useEffect(() => {
		if (!!prob) {
			setcurrentPosts(prob.slice(firstPost, lastPost));
		}
	}, [prob, currentPage]);

	return (
		<>
			<div className='m-3'>
				<NavLink
					className='btn btn-primary btn-lg mx-5 float-end'
					to='/editar_problemas'
				>
					Nuevo
				</NavLink>
				<h1 className='d-flex justify-content-center'>Problemas</h1>
			</div>
			{!!prob && (
				<>
					<TablaProblemas prob={currentPosts} cargando={cargando} />
					<Paginacion
						postPerPage={postPerPage}
						totalPosts={prob.length}
						paginar={paginar}
					/>
				</>
			)}
		</>
	);
};
