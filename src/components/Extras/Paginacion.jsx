import React from 'react';

export const Paginacion = ({ postPerPage, totalPosts, paginar }) => {
	const pageNumbers = [];
	for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
		pageNumbers.push(i);
	}

	return (
		<nav>
			<ul className='pagination justify-content-end mx-5'>
				{pageNumbers.map((number) => {
					return (
						<li key={number} className='page-item'>
							<button onClick={() => paginar(number)} className='page-link'>
								{number}
							</button>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};
