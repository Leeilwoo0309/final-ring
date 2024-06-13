type KeyDown = {
    w: boolean,
    a: boolean,
    s: boolean,
    d: boolean,
    userSkillKey: {
        isDown: boolean,
        dashLength: number,
        cooltime: number,
    },
    jobSkill: {
        isDown: boolean,
        cooltime: number,
        isSkillOn: boolean
    },
    mouse: boolean,
};

type GetData = {
    data: {
        job: JobData[]
    }
}

type JobData = {
    name: string,
    reach: number,
    damage: number,
    attackSpd: number,
    skill: string,
    ct: number
}