import type { User } from '../features/computedUsers/computedUsersSlice';

const headers = ['№', 'id', 'Full name', 'Address', 'Telephone'];

export default function prepareCSV(users: User[]) {
    return [
        headers,
        ...users.map((user) => [
            user.number,
            user.id,
            user.fullName,
            `${user.street}; ${user.state}`,
            user.telephone,
        ]),
    ];
}
