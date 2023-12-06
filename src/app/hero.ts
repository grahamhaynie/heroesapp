export interface Hero {
    id: number;
    name: string;
    power: string;
    alterEgo?: string;
    photoURL?: string;
  }

export class HeroForm implements Hero {

  constructor(
    public id: number,
    public name: string,
    public power: string,
    public alterEgo?: string
  ) {  }

}