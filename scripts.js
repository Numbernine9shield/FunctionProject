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

function getPersonFigma(){
    return person.filter(item => {
        const skillFigma = item.skills.find(skill => {
            return skill.name.toLowerCase() === "figma";
        })
        const specDes = specializations.find(spec => {
            return item.personal.specializationId === spec.id
        })

        if (skillFigma && specDes.name === "designer") {
            return item;
        }
    })
}

function getPersonReact(){
    return person.find(item => {
        const react = item.skills.find(skill => {
            return skill.name.toLowerCase() === 'react';
        })
        return react;
    })
}

function getPersonAge(){
    const today = new Date();
    const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    )
    return person.every(user => {
        const agePerson = user.personal.birthday;
        const [day, month, year] = agePerson.split('.').map(Number)

        const birthdayPerson = new Date(year, month - 1, day);

        return birthdayPerson <= eighteenYearsAgo;
    })
}

function getPersonBackend(){
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

        if (specDes.name === "backend" && mosPer.name === "Москва" && fullDay) {
            return user;
        }
    })
    return backMos.sort((a, b) => {
        const userA = a.request.find(item => item.name === "Зарплата")
        const userB = b.request.find(item => item.name === "Зарплата")

        return userA.value - userB.value;
    })
}

function getPersonFigPhoto(){
    return person.filter(user => {
        const skillsUserFigma = user.skills.find(skill => {
            return skill.name === "Figma" && skill.level >= 6;
        });

        const skillUserPhoto = user.skills.find(skill => {
            return skill.name === "Photoshop" && skill.level >= 6;
        });

        const specDes = specializations.find(spec => {
            return user.personal.specializationId === spec.id
        })

        return skillsUserFigma && skillUserPhoto && specDes.name === "designer";
    });
}

function getBestSpecial(specName, job){
    const candidates = person.filter(user => {
        const specCand = specializations.find(spec => {
            return user.personal.specializationId === spec.id
        })
        const skillUser = user.skills.find(skill => {
            return skill.name === specName;
        });

        return skillUser && specCand.name === job;
    })

    const bestCand = candidates.sort((a, b) => {
        const skillA = a.skills.find(skill => skill.name === specName);
        const skillB = b.skills.find(skill => skill.name === specName);

        return skillA.level - skillB.level
    })
    const bestBestCand = bestCand.at(-1);

    return bestBestCand;
}

function getBestTeam(){
    const bestDesigner = getBestSpecial("Figma", "designer");
    const bestFrontend = getBestSpecial("Angular", "frontend");
    const bestBackend = getBestSpecial("Go", "backend");

    return [bestDesigner, bestFrontend, bestBackend];
}

function processData() {
    console.log("Они владеют Figma:")
    const personsFigma = getPersonFigma();
    personsFigma.forEach(person => {
            console.log(getInfo.call(person.personal))
        }
    )

    console.log("React:")
    const personReact = getPersonReact()
    console.log(getInfo.call(personReact.personal))


    console.log("Возраст:")
    const age = getPersonAge();
    if (age) {
        console.log("All persons are 18 years old or older")
    } else {
        console.log("Not all persons are 18 years old or older")
    }

    console.log("Backend из Москвы")
    const backMosSort = getPersonBackend()
    backMosSort.forEach(user => {
        console.log(getInfo.call(user.personal))
    })

    console.log("Photoshop and Figma:")
    const designers = getPersonFigPhoto()
    designers.forEach(user => {
        console.log(getInfo.call(user.personal))
    })

    console.log("Best team:")
    const bestTeam = getBestTeam();
    bestTeam.forEach(user => {
        console.log(getInfo.call(user.personal))
    })
}
