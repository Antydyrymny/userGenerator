import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import apiSlice from '../../app/services/api';
import formatUsers from './formatUsers';
import addErrors from './addErrors';
import type { RootState } from '../../app/store';

export type Locale = 'US' | 'DE' | 'FR' | 'MX';

export type User = {
    number: number;
    id: string;
    fullName: string;
    street: string;
    state: string;
    telephone: string;
};

type InitialState = {
    locale: Locale;
    errorFrequency: number;
    seed: string;
    cachedUsers: User[];
    usersWithErrors: User[];
};

const initialState: InitialState = {
    locale: 'US',
    errorFrequency: 0,
    seed: 'My-random-seed',
    cachedUsers: [],
    usersWithErrors: [],
};

const computedUsersSlice = createSlice({
    name: 'computedUsers',
    initialState,
    reducers: {
        setLocale: (state, action: PayloadAction<Locale>) => {
            state.locale = action.payload;
        },
        setSeed: (state, action: PayloadAction<string>) => {
            state.seed = action.payload;
        },
        setErrorFrequency: (state, action: PayloadAction<number>) => {
            state.errorFrequency = action.payload;
            state.usersWithErrors = addErrors(
                state.cachedUsers,
                state.locale,
                action.payload,
                state.seed
            );
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            apiSlice.endpoints.getUsers.matchFulfilled,
            (state, action) => {
                if ([0, 1].includes(action.meta.arg.originalArgs.page))
                    state.cachedUsers = formatUsers(action.payload.results, 1);
                else
                    state.cachedUsers.push(
                        ...formatUsers(
                            action.payload.results,
                            state.cachedUsers.length + 1
                        )
                    );
                state.usersWithErrors = addErrors(
                    state.cachedUsers,
                    state.locale,
                    state.errorFrequency,
                    state.seed
                );
            }
        );
    },
});

export default computedUsersSlice.reducer;

export const { setLocale, setErrorFrequency, setSeed } = computedUsersSlice.actions;

export const selectComputedUsers = (state: RootState) =>
    state.computedUsers.usersWithErrors;
export const selectLocale = (state: RootState) => state.computedUsers.locale;
export const selectErrorFrequency = (state: RootState) =>
    state.computedUsers.errorFrequency;
export const selectSeed = (state: RootState) => state.computedUsers.seed;
