/// <reference path="js/utility.d.ts" />
// TODO
var TEMPNAMES = {
    american: {
        male: [
            "James",
            "Christopher",
            "Ronald",
            "John",
            "Daniel",
            "Anthony",
            "Robert",
            "Paul",
            "Kevin",
            "Michael",
            "Mark",
            "Jason",
            "William",
            "Donald",
            "Jeff",
            "David",
            "George",
            "Richard",
            "Kenneth",
            "Charles",
            "Steven",
            "Joseph",
            "Edward",
            "Thomas",
            "Brian",
            "Davis"
        ],
        female: [
            "Mary",
            "Lisa",
            "Michelle",
            "Patricia",
            "Nancy",
            "Laura",
            "Linda",
            "Karen",
            "Sarah",
            "Barbara",
            "Betty",
            "Kimberly",
            "Elizabeth",
            "Helen",
            "Deborah",
            "Jennifer",
            "Sandra",
            "Maria",
            "Donna",
            "Susan",
            "Carol",
            "Margaret",
            "Ruth"
        ],
        surnames: [
            "Smith",
            "Anderson",
            "Clark",
            "Wright",
            "Mitchell",
            "Johnson",
            "Thomas",
            "Rodriguez",
            "Lopez",
            "Perez",
            "Williams",
            "Jackson",
            "Lewis",
            "Hill",
            "Roberts",
            "Jones",
            "White",
            "Lee",
            "Scott",
            "Turner",
            "Brown",
            "Harris",
            "Walker",
            "Green",
            "Phillips",
            "Davis",
            "Martin",
            "Hall",
            "Adams",
            "Campbell",
            "Miller",
            "Farmer",
            "Thompson",
            "Allen",
            "Baker",
            "Parker",
            "Wilson",
            "Garcia",
            "Young",
            "Gonzalez",
            "Evans",
            "Moore",
            "Martinez",
            "Hernandez",
            "Nelson",
            "Edwards",
            "Taylor",
            "Robinson",
            "King",
            "Carter",
            "Collins"
        ]
    }
};

var Employee = (function () {
    function Employee(id, names, params) {
        this.traits = {};
        this.active = true;
        this.id = "employee" + id;

        // lets us do cleaner || check instead of (params && param.x) ? x : y
        var _params = params || {};

        this.gender = _params.gender || getRandomArrayItem(["male", "female"]);
        this.ethnicity = _params.ethnicity || getRandomKey(names);
        this.name = _params.name || this.getName(names, this.gender, this.ethnicity);

        var skillVariance = Math.round(_params.skillVariance) || 1;
        this.skills = _params.skills || this.setSkillsByLevel(_params.skillLevel, skillVariance);
        this.growth = _params.growth || this.setGrowthByLevel(_params.growthLevel);
        this.potential = _params.potential || 50 * _params.skillLevel + 30 * Math.random();

        this.setSkillTotal();
    }
    Employee.prototype.getName = function (names, gender, ethnicity) {
        var first = getRandomArrayItem(names[ethnicity][gender]);
        var last = getRandomArrayItem(names[ethnicity]["surnames"]);

        return "" + first + " " + last;
    };
    Employee.prototype.setSkillsByLevel = function (skillLevel, variance) {
        var skills = {
            negotiation: 1,
            management: 1,
            recruitment: 1,
            constuction: 1
        };
        var min = 8 * skillLevel + 1;
        var max = 16 * skillLevel + 1 + variance;

        for (var skill in skills) {
            skills[skill] = randInt(min, max);
        }
        return skills;
    };
    Employee.prototype.setGrowthByLevel = function (growthLevel) {
        var skills = {
            negotiation: 1,
            management: 1,
            recruitment: 1,
            constuction: 1
        };

        for (var skill in skills) {
            var _growth = Math.random() * growthLevel;
            skills[skill] = _growth > 0.1 ? _growth : 0.1;
        }
        return skills;
    };
    Employee.prototype.setSkillTotal = function () {
        var total = 0;
        for (var skill in this.skills) {
            total += this.skills[skill];
        }
        this.skillTotal = total;
    };
    Employee.prototype.trainSkill = function (skill) {
        // don't train if potential is already reached
        if (this.skillTotal >= this.potential)
            return;
        else {
            var rand = Math.random();

            var adjustedGrowth = this.growth[skill] * (1 / Math.log(this.skills[skill] + 0.5));
            if (rand + adjustedGrowth > 1) {
                this.skills[skill]++;
                this.skillTotal++;
            }
        }
    };
    return Employee;
})();
//# sourceMappingURL=employee.js.map
