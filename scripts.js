let cities = [];
let person = [];
let specializations = [];

Promise.all(
    [
        fetch("cities.json"),
        fetch("person.json"),
        fetch("specializations.json")
    ]
).then(async ([citiesResponse, personResponse, specializationsResponse]) => {
    const citiesJson = await citiesResponse.json();
    const personJson = await personResponse.json();
    const specializationsJson = await specializationsResponse.json();

    return [citiesJson, personJson, specializationsJson];
}).then(response => {
    cities = response[0];
    person = response[1];
    specializations = response[2];

    processData();
})

function getInfo() {
    const cityPerson = cities.find(item => {
        return item.id === this.locationId;
    })
    return `${this.firstName} ${this.lastName}, ${cityPerson.name}`
}

const today = new Date();
const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
)

function processData() {
    console.log("Они владеют Figma:")
    const personsFigma = person.filter(item => {
        const skillFigma = item.skills.find(skill => {
            return skill.name.toLowerCase() === "figma";
        })
        const specDes = specializations.find(spec => {
            return item.personal.specializationId === spec.id
        })

        if (skillFigma && specDes?.name === "designer") {
            return item;
        }
    })

    personsFigma.forEach(person => {
            console.log(getInfo.call(person.personal))
        }
    )

    console.log("React:")
    const personReact = person.find(item => {
        const react = item.skills.find(skill => {
            return skill.name.toLowerCase() === 'react';
        })
        return react;
    })

    console.log(getInfo.call(personReact.personal))


    console.log("Возраст:")
    const age = person.every(user => {
        const agePerson = user.personal.birthday;
        const [day, month, year] = agePerson.split('.').map(Number)

        const birthdayPerson = new Date(year, month - 1, day);

        return birthdayPerson <= eighteenYearsAgo;
    })

    if (age) {
        console.log("All persons are 18 years old or older")
    } else {
        console.log("Not all persons are 18 years old or older")
    }

    console.log("Backend из Москвы")
    const backMos = person.filter(user => {
        const specDes = specializations.find(spec => {
            return user.personal.specializationId === spec.id
        })

        const mosPer = cities.find(city => {
            return user.personal.locationId === city.id
        })

        const fullDay = user.request.find(item => {
            return item.value === "Полная";
        })

        if (specDes?.name === "backend" && mosPer?.name === "Москва" && fullDay) {
            return user;
        }
    })

    const backMosSort = backMos.sort((a, b) => {
        const userA = a.request.find(item => item.name === "Зарплата")
        const userB = b.request.find(item => item.name === "Зарплата")

        return userA.value - userB.value;
    })

    backMosSort.forEach(user => {
        console.log(getInfo.call(user.personal))
    })

    console.log("Photoshop and Figma:")
    const designers = person.filter(user => {
        const skillsUserFigma = user.skills.find(skill => {
            return skill.name === "Figma" && skill.level >= 6;
        });

        const skillUserPhoto = user.skills.find(skill => {
            return skill.name === "Photoshop" && skill.level >= 6;
        });

        const specDes = specializations.find(spec => {
            return user.personal.specializationId === spec.id
        })

        return skillsUserFigma && skillUserPhoto && specDes?.name === "designer";
    });

    designers.forEach(user => {
        console.log(getInfo.call(user.personal))
    })

    console.log("Best team:")
    const Des = person.filter(des => {
        const specDes = specializations.find(spec => {
            return des.personal.specializationId === spec.id
        })
        const skillsUserFigma = des.skills.find(skill => {
            return skill.name === "Figma";
        });

        return skillsUserFigma && specDes?.name === "designer";
    })

    const bestDes = Des.sort((a, b) => {
        const skillA = a.skills.find(skill => skill.name === "Figma");
        const skillB = b.skills.find(skill => skill.name === "Figma");

        return skillA.level - skillB.level
    })
    const bestDesigner = bestDes.at(-1);


    //backend max Go

    const front = person.filter(des => {
        const specDes = specializations.find(spec => {
            return des.personal.specializationId === spec.id
        })
        const skillsUserAng = des.skills.find(skill => {
            return skill.name === "Angular";
        });

        return skillsUserAng && specDes?.name === "frontend";
    })

    const bestFront = front.sort((a, b) => {
        const skillA = a.skills.find(skill => skill.name === "Angular");
        const skillB = b.skills.find(skill => skill.name === "Angular");

        return skillA.level - skillB.level
    })
    const bestFrontend = bestFront.at(-1);


    const back = person.filter(des => {
        const specDes = specializations.find(spec => {
            return des.personal.specializationId === spec.id
        })
        const skillsUserGo = des.skills.find(skill => {
            return skill.name === "Go";
        });

        return skillsUserGo && specDes?.name === "backend";
    })

    const bestBack = back.sort((a, b) => {
        const skillA = a.skills.find(skill => skill.name === "Go");
        const skillB = b.skills.find(skill => skill.name === "Go");

        return skillA.level - skillB.level
    })
    const bestBackend = bestBack.at(-1);

    const bestTeam = [bestDesigner, bestFrontend, bestBackend];

    bestTeam.forEach(user => {
        console.log(getInfo.call(user.personal))
    })
}
