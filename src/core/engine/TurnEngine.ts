export class TurnEngine {

    static sortBySpeed(units: { spd: number }[]) {

        return [...units].sort(

            (a, b) => b.spd - a.spd

        );

    }

}