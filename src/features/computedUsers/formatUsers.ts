import seedrandom from 'seedrandom';
import introduceRandom from '../../utils/introduceRandom';
import type { UserResponse } from '../../app/services/api';
import type { User } from './computedUsersSlice';

export default function formatUsers(
    userResponse: UserResponse[],
    startInd: number
): User[] {
    const rng = seedrandom(userResponse[0].id.value);

    const [pickRandom] = introduceRandom(rng);

    const getName = (user: UserResponse) =>
        `${pickRandom('', user.name.title + ' ')}${user.name.first} ${user.name.last} `;
    const getStreet = (user: UserResponse) =>
        `${user.location.street.name} - ${user.location.street.number}`;

    const getState = (user: UserResponse) =>
        `${user.location.state}, ${pickRandom(
            user.location.city,
            user.location.postcode
        )}`;
    const getTelephone = (user: UserResponse) =>
        pickRandom(
            user.phone,
            user.phone.replace(/[()]/g, '').replace(/\s+/g, '-'),
            user.phone.replace(/[-]/g, ' ')
        );

    return userResponse.map((fullUser) => ({
        number: startInd++,
        id: fullUser.id.value,
        fullName: getName(fullUser),
        street: getStreet(fullUser),
        state: getState(fullUser),
        telephone: getTelephone(fullUser),
    }));
}
