import React from 'react';
import { Navbar } from './components/Navbar';

export const Inicio = () => {
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
			</div>
		</>
	);
};
