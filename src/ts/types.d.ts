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
    jobSkill2: {
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
    bulletSpd: number,
    skill: SkillData[]
}

type SkillData = {
    des: string,
    ct: number,
    reach: number,
    damage: number,
    attackSpd: number,
    bulletSpd: number,
    moveSpd: number,
    extraData: number,
    skillDuration: number
}

type UserSkillData = {
    name: string,
    ct: number,
}