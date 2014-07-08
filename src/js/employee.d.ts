/// <reference path="utility.d.ts" />
/// <reference path="../../data/js/names.d.ts" />
/// <reference path="../../data/js/employeemodifiers.d.ts" />
declare var idGenerator: any;
interface ISkillsObj {
    negotiation: number;
    recruitment: number;
    construction: number;
}
declare class Employee {
    public id: string;
    public name: string;
    public player: any;
    public gender: string;
    public ethnicity: string;
    public skills: ISkillsObj;
    public growth: ISkillsObj;
    public skillTotal: number;
    public potential: number;
    public trait: playerModifiers.IPlayerModifier;
    public active: boolean;
    public currentAction: string;
    constructor(names: any, params: {
        id?: string;
        name?: string;
        gender?: string;
        ethnicity?: string;
        skillLevel?: number;
        skillVariance?: number;
        growthLevel?: number;
        growth?: ISkillsObj;
        potential?: number;
        skills?: ISkillsObj;
        trait?: string;
        traitChance?: number;
    });
    public getName(names: any, gender: string, ethnicity: string): string;
    public setSkillsByLevel(skillLevel: any, variance: any): ISkillsObj;
    public setGrowthByLevel(growthLevel: any): ISkillsObj;
    public setSkillTotal(): void;
    public trainSkill(skill: string): void;
    public addTrait(modifier: any): void;
    public addRandomTrait(): void;
    public getAvailableTraits(): any[];
}
declare function makeNewEmployees(employeeCount: number, recruitingSkill: number): any[];
