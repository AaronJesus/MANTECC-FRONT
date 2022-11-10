//import { useEffect } from 'react';
import { AppRouter } from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';

export const App = () => {
	return (
		<>
			<BrowserRouter>
				<AppRouter />
			</BrowserRouter>
		</>
	);
};
