import { useState, useRef } from 'react';
import { Container, Navbar, Form, FloatingLabel, Button } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import prepareCSV from '../../utils/prepareCSV';
import UserTable from './UserTable';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import useIntersectionObserver from '../../hooks/useIntersectionOberver';
import { useGetUsersQuery } from '../../app/services/api';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    selectLocale,
    setLocale,
    selectErrorFrequency,
    setErrorFrequency,
    selectSeed,
    setSeed,
    selectComputedUsers,
} from '../../features/computedUsers/computedUsersSlice';
import generateSeed from '../../utils/generateSeed';
import type { Locale } from '../../features/computedUsers/computedUsersSlice';
import styles from './randomUsersStyle.module.scss';
import { useSelector } from 'react-redux';

function UsersPageLayout() {
    const dispatch = useAppDispatch();

    const locale = useSelector(selectLocale);
    const errorFrequency = useSelector(selectErrorFrequency);
    const seed = useSelector(selectSeed);
    const users = useAppSelector(selectComputedUsers);

    // Infinite scrolling
    const [page, setPage] = useState(0); // 0 as during first render intersection observer runs instantly
    const { isFetching, isError, error } = useGetUsersQuery({ page, seed, nat: locale });
    const pageBottomRef = useRef<HTMLSpanElement>(null);
    useIntersectionObserver(pageBottomRef, () => setPage((page) => page + 1));

    const resetPage = () => {
        setPage(1);
        window.scrollTo(0, 0);
    };

    // Event handlers
    const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setLocale(e.target.value as Locale));
        resetPage();
    };
    const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const remainder = +e.target.value % 0.25;
        const roundedNumber =
            +e.target.value - remainder + (remainder < 0.125 ? 0 : 0.25);
        dispatch(setErrorFrequency(Math.min(1000, +roundedNumber.toFixed(2))));
    };
    const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSeed(e.target.value));
        resetPage();
    };
    const handleGenerateClick = () => {
        dispatch(setSeed(generateSeed()));
        resetPage();
    };

    return (
        <Container className={`${styles.wrapper} d-flex-column  justify-content-center`}>
            <Navbar className={`${styles.navbar} fixed-top bg-info`}>
                <Form>
                    <FloatingLabel label='Choose locale'>
                        <Form.Select
                            value={locale}
                            onChange={handleLocaleChange}
                            aria-label='Choose locale'
                            size='sm'
                        >
                            <option value='US'>USA</option>
                            <option value='DE'>Germany</option>
                            <option value='FR'>France</option>
                            <option value='MX'>Mexico</option>
                        </Form.Select>
                    </FloatingLabel>
                </Form>
                <Form>
                    <Form.Group>
                        <FloatingLabel label='Choose error frequency'>
                            <Form.Control
                                type='number'
                                placeholder='0'
                                className='mb-2'
                                value={errorFrequency}
                                onChange={handleFrequencyChange}
                                size='sm'
                            />
                        </FloatingLabel>
                        <Form.Range
                            min='0'
                            max='10'
                            step='0.25'
                            value={Math.min(10, errorFrequency)}
                            onChange={handleFrequencyChange}
                        />
                    </Form.Group>
                </Form>
                <Form>
                    <Form.Group className='d-flex'>
                        <FloatingLabel label='Enter seed'>
                            <Form.Control
                                type='email'
                                placeholder='Enter seed'
                                required
                                value={seed}
                                onChange={handleSeedChange}
                                size='sm'
                            />
                        </FloatingLabel>
                        <Button onClick={handleGenerateClick} variant='primary' size='sm'>
                            Generate
                        </Button>
                    </Form.Group>
                </Form>
                <Button size='sm' className={styles.csv}>
                    <CSVLink
                        style={{ color: 'white' }}
                        filename={`nat-${locale}_err-${errorFrequency}_seed-${seed}_page-${page}`}
                        data={prepareCSV(users)}
                    >
                        Export CSV
                    </CSVLink>
                </Button>
            </Navbar>
            <UserTable users={users} />
            <br />
            {isFetching && <LoadingSpinner color='black' />}
            {isError && (isFetchError(error) ? error.data : 'Error loading users')}
            <span ref={pageBottomRef} />
        </Container>
    );

    type FetchError = {
        status: number;
        data: string;
    };

    function isFetchError(error: unknown): error is FetchError {
        if (
            typeof error === 'object' &&
            error !== null &&
            'status' in error &&
            'data' in error &&
            typeof error.status === 'number' &&
            typeof error.data === 'string'
        ) {
            return true;
        }
        return false;
    }
}

export default UsersPageLayout;
