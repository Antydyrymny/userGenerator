import type { User } from '../../features/computedUsers/computedUsersSlice';

type UserRowProps = {
    user: User;
};

function UserRow({ user }: UserRowProps) {
    return (
        <tr>
            <td style={{ maxWidth: '1rem' }}>{user.number}</td>
            <td style={{ maxWidth: '4rem' }}>{user.id}</td>
            <td style={{ maxWidth: '6rem' }}>{user.fullName}</td>
            <td style={{ maxWidth: '10rem' }}>
                {user.street}
                <br />
                {user.state}
            </td>
            <td style={{ maxWidth: '6rem' }}>{user.telephone}</td>
        </tr>
    );
}

export default UserRow;
