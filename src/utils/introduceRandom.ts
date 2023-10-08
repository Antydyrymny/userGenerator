import seedrandom from 'seedrandom';
import type { Locale } from '../features/computedUsers/computedUsersSlice';
import { localeDictionary } from '../assets/localeDictionary';

type IntroduceRandomReturnType = [
    <T>(...args: T[]) => T,
    (textFields: string[], locale: Locale, errorNum: number) => string[]
];

export default function introduceRandom(rng: seedrandom.PRNG): IntroduceRandomReturnType {
    const randomInRange = (max: number, min = 0) => Math.floor(rng() * (max - min)) + min;
    const pickRandom = <T>(...args: T[]): T => args[randomInRange(args.length)];

    const makeError = (textFields: string[], locale: Locale, errorNum: number) => {
        const lookup = localeDictionary[locale].concat(localeDictionary.num);
        const textFieldsArr = textFields.map((text) => text.split(''));

        const swapLetters = () => {
            const textArr = pickRandom(
                ...textFieldsArr.filter((textArr) => textArr.length >= 2)
            );
            if (!textArr) return;
            const ind = randomInRange(textArr.length - 1);
            const tmp = textArr[ind];
            if (ind === 0) {
                textArr[0] = textArr[1];
                textArr[1] = tmp;
            } else {
                textArr[ind] = textArr[ind - 1];
                textArr[ind - 1] = tmp;
            }
        };
        const addLetter = () => {
            const textArrInd = randomInRange(textFields.length);
            const textArr = textFieldsArr[textArrInd];
            const randomChar = pickRandom(...lookup);
            const ind = randomInRange(textArr.length - 1);
            textFieldsArr[textArrInd] = [
                ...textArr.slice(0, ind),
                randomChar,
                ...textArr.slice(ind),
            ];
        };
        const deleteLetter = () => {
            const textArr = pickRandom(
                ...textFieldsArr.filter((textArr) => textArr.length > 0)
            );
            if (!textArr) return;
            const ind = randomInRange(textArr.length - 1);
            textArr.splice(ind, 1);
        };

        const [fullErrorNum, chanceForError] = errorNum.toString().split('.') as [
            string,
            string | undefined
        ];
        const errors = [swapLetters, addLetter, deleteLetter];

        [...Array(+fullErrorNum)].forEach(() => pickRandom(...errors)());
        if (chanceForError && +chanceForError >= rng() * 100) pickRandom(...errors)();

        return textFieldsArr.map((textArr) => textArr.join(''));
    };

    return [pickRandom, makeError];
}
