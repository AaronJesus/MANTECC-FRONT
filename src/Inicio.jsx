import React from 'react';
import Swal from 'sweetalert2';
import { Navbar } from './components/Navbar';

export const Inicio = () => {
	const acercaDe = () => {
		Swal.fire(
			'Acerca de',
			'Desarrollado por Aaron Jesus Robles Rodriguez de la carrera de Ingenieria en Sistemas Computacionales, Este sitio web asi como el servidor y la base de datos es parte de un proyecto de residencias para el Centro de Computo Administrativo del Instituto Tecnologico de Hermosillo (ITH), para cualquier otra duda presentarse al al mismo.'
		);
	};

	return (
		<>
			<Navbar />
			<div className='container'>
				<h1>Bienvenido</h1>
				<h4>
					Gracias por acceder al Sistema de Registo de Mantenimiento del
					Tecnologico de Hermosillo (MANTECC).
				</h4>
				<br />
				<h4>
					Este sistema es parte de un proyecto de residencias para ayudar la
					administraciond de las soliciutdes de mantenimiento correctivas,
					facilitando la creacion y el seguimiento de las solicitudes.
				</h4>
				<br />
				<h4>
					Si desea hacer uso del sistema para registrar una nueva solicitud de
					mantenimiento correctivo favor de entrar al sistema con su RFC y
					contraseña establecidas por los administradores del Departamento de
					Administracion del servicio del computo, o si no esta en el sistema
					favor de reportarse al mismo.
				</h4>
				<br />
				<div className='float-end mt-5'>
					<button className='btn btn-secondary' onClick={() => acercaDe()}>
						Acerca de
					</button>
				</div>
			</div>
		</>
	);
};
