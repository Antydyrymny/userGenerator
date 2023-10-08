import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import UsersPageLayout from './pages/randomUsersTable/UsersPageLayout';

function App() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path='/' element={<UsersPageLayout />} />
            </Routes>
        </Suspense>
    );
}

export default App;
