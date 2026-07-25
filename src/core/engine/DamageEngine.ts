export class DamageEngine {

    static computeDamage(

        attack: number,

        defense: number

    ): number {

        return Math.max(

            attack - defense,

            1

        );

    }

}