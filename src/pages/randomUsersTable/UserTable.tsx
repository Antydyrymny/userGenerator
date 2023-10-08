import { Table } from 'react-bootstrap';
import { nanoid } from '@reduxjs/toolkit';
import UserRow from './UserRow';
import type { User } from '../../features/computedUsers/computedUsersSlice';
import styles from './randomUsersStyle.module.scss';

type UserTableProps = {
    users: User[];
};

function UserTable({ users }: UserTableProps) {
    return (
        <>
            <Table
                size='sm'
                responsive='xl'
                striped
                className={`${styles.table} table-bordered`}
            >
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Id</th>
                        <th>Full Name</th>
                        <th>Address</th>
                        <th>Telephone</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <UserRow key={nanoid()} user={user} />
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default UserTable;
