import seedrandom from 'seedrandom';
import introduceRandom from '../../utils/introduceRandom';
import type { User } from './computedUsersSlice';
import type { Locale } from './computedUsersSlice';

export default function addErrors(
    users: User[],
    locale: Locale,
    errorFrequency: number,
    seed: string
): User[] {
    const rng = seedrandom(seed);
    const makeError = introduceRandom(rng)[1];

    return users.map((user) => {
        const [id, fullName, street, state, telephone] = makeError(
            [user.id, user.fullName, user.street, user.state, user.telephone],
            locale,
            errorFrequency
        );
        return { ...user, id, fullName, street, state, telephone };
    });
}
