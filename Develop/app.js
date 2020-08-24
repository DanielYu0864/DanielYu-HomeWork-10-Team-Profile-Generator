const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");




const questions = [
    {
        type: "list",
        name: "role",
        message: "positions",
        choices: [
            "manager",
            "engineer",
            "intern"
        ]
    },
    {
        type: "input",
        name: "name",
        message: "name",
        validate: async (input) => {
            // set up conditional to make sure the valuable input
            if (input == "" || /\s/.test(input)) {
                return "Please enter first or last name.";
            }
            return true;
        }
    },
    {
        type: "input",
        name: "id",
        message: "id"
    },
    {
        type: "input",
        name: "email",
        message: "email",
        // set up conditional to make sure the valuable input
        validate: async (input) => {
            if (/^(\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+[,;]?[ ]?)+$/.test(input)) {
                return true;
            }
            return "Please enter a valid email address.";
        }
    }
]
let htmlRenderer = "";


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
async function start() {
    console.log("The app about to start");// .setInterval
    let teamSize;
    // prompt for the number fo team member
    await inquirer.prompt(
        {
            type: "number",
            name: "teamNumber",
            message: "How many team munber your have"
        }
    )
    .then(data => {
        return teamSize = data.teamNumber;
    });
    console.log(teamSize);
    if (teamSize <= 0 ) return console.log("No one in your team");
    if (isNaN(teamSize)) return console.log("Please enter a number");
    // loop i time(s) for the question(s)
    for(let i = 0; i < teamSize ; i++) {
        let role;
        let name;
        let id;
        let email;
        await inquirer.prompt(questions)
                .then(  data => {
                    role = data.role;
                    name = data.name;
                    id = data.id;
                    email = data.email;
                });

        // prompt qusetion basic on position (by using switch)
        switch(role) {
            case "engineer":

                await inquirer.prompt(
                    {
                        type: "input",
                        name: "github",
                        message: "github"
                    }
                )
                .then(data => {
                    const engineer = new Engineer(name, id, email, data.github);
                    console.log(engineer);
                    const engineerHtml = render(engineer);
                    htmlRenderer = htmlRenderer + "\n" + eval("`" + engineerHtml + "`");
                });
                break;
            case "intern":

                await inquirer.prompt(
                    {
                        type: "input",
                        name: "school",
                        message: "school"
                    }
                )
                .then(data => {
                    const intern = new Intern(name, id, email, data.school);
                    console.log(intern);
                    const internHtml = render(intern);
                    htmlRenderer = htmlRenderer + "\n" + eval("`" + internHtml + "`");

                });
                break;
            case "manager":

                await inquirer.prompt(
                    {
                        type: "input",
                        name: "officeNumber",
                        message: "officeNumber"
                    }
                )
                .then(data => {
                    const manager = new Manager(name, id, email, data.officeNumber);
                    console.log(manager);
                    const managerHtml = render(manager);
                    htmlRenderer = htmlRenderer + "\n" + eval("`" + managerHtml + "`");

                });
                break;
        } // switch end
    } // loop end

    let mainHtml = fs.readFileSync("./templates/main.html", "utf8");

    let teamHtml = replaceTeam(mainHtml, htmlRenderer);

    writeFileAsync("./output/team.html", teamHtml, err => {
        if(err) throw err;
    });


} // function start end
start();



// to replace thisteam to htmlRenderer in main.html
const replaceTeam = (input, html) => {
    return input.replace("{{ thisteam }}", html);
}
