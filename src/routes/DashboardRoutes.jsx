import { Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { EditarSolicitud } from '../components/Solicitudes/EditarSolicitud';
import { NuevaSolicitud } from '../components/Solicitudes/Nueva_solicitud';
import { Solicitudes } from '../components/Solicitudes/Solicitudes';
import { VerSolicitud } from '../components/Solicitudes/VerSolicitud';
import { VerOrden } from '../components/Ordenes/VerOrden';
import { Usuarios } from '../components/Usuarios/Usuarios';
import { Alumnos } from '../components/Alumnos/Alumnos';
import { EditarUsuario } from '../components/Usuarios/EditarUsuario';
import { EditarAlumno } from '../components/Alumnos/EditarAlumno';
import { CalificarOrden } from '../components/Ordenes/Calificar_orden';
import { Problemas } from '../components/Problemas/Problemas';
import { Configs } from '../components/Extras/Configs';
import { EditarProblemas } from '../components/Problemas/EditarProblemas';
import { NuevoAlumno } from '../components/Alumnos/NuevoAlumno';
import { NuevoUsuario } from '../components/Usuarios/NuevoUsuario';
import { EditarConf } from '../components/Extras/EditarConf';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

export const DashboardRoutes = () => {
	const token = sessionStorage.getItem('token');
	const [role, setRole] = useState();

	const handleId = () => {
		if (!!token) {
			const user = jwtDecode(token);

			if (!!user) {
				setRole(user.id_Usuario);
			}
		}
	};

	useEffect(() => {
		handleId();
	}, []);

	return (
		<>
			<Navbar />
			<div>
				<Routes>
					{role === 2 ? (
						<>
							<Route path='/' element={<NuevaSolicitud />} />
							<Route path='nueva_solicitud' element={<NuevaSolicitud />} />
							<Route path='calificar_orden/:id' element={<CalificarOrden />} />
							<Route path='solicitudes' element={<Solicitudes />} />
							<Route path='solicitudes/:id' element={<VerSolicitud />} />
						</>
					) : (
						<>
							<Route path='/' element={<Solicitudes />} />
							<Route path='ordenes/:id' element={<VerOrden />} />
							<Route path='calificar_orden' element={<CalificarOrden />} />
							<Route path='solicitudes' element={<Solicitudes />} />
							<Route
								path='editar_solicitud/:id'
								element={<EditarSolicitud />}
							/>
							<Route path='nueva_solicitud' element={<NuevaSolicitud />} />
							<Route path='solicitudes/:id' element={<VerSolicitud />} />
							<Route path='usuarios' element={<Usuarios />} />
							<Route path='editar_usuario/:rfc' element={<EditarUsuario />} />
							<Route path='nuevo_usuario' element={<NuevoUsuario />} />
							<Route path='alumnos' element={<Alumnos />} />
							<Route path='editar_alumno/:rfc' element={<EditarAlumno />} />
							<Route path='nuevo_alumno' element={<NuevoAlumno />} />
							<Route path='problemas' element={<Problemas />} />
							<Route path='editar_problemas' element={<EditarProblemas />} />
							<Route
								path='editar_problemas/:id'
								element={<EditarProblemas />}
							/>
							<Route path='configuraciones' element={<Configs />} />

							<Route path='config/:id' element={<EditarConf />} />
						</>
					)}
				</Routes>
			</div>
			<div className='mt-5'></div>
		</>
	);
};
