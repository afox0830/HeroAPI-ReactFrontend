import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

let ASPNET_API = "https://localhost:7146/api/"

function testingFetch() {
    try {
        /*
        fetch('https://localhost:7146/api/Heroes', {
            //method: 'GET',
            mode: 'no-cors'
        }).then(response => response.json());
        */
        const myHeaders = new Headers();
        const myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
        };
        //fetch('https://localhost:7146/api/Heroes/D.va', myInit).then(response => response.json()).then(data => console.log(data));
        fetch('https://localhost:7146/api/Heroes/D.va').then(response => response.json()).then(data => console.log(data));
          
    } catch (Err) {
        console.log("error");
    }
}

class Webpage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heroList: [],
            selectedHero: "none",
            displayedHero: null,
            showAddHero: false
        };

        //bind 'this' in callbacks
        this.handleHeroSelectChange = this.handleHeroSelectChange.bind(this);
        this.handleHeroSubmit = this.handleHeroSubmit.bind(this);
        this.handleAddHero = this.handleAddHero.bind(this);
        this.handleDeleteCurrentHero = this.handleDeleteCurrentHero.bind(this);

        this.fetchHero = this.fetchHero.bind(this);
        this.getHeroList = this.refreshHeroList.bind(this);
    }

    
    componentDidMount() {
       this.refreshHeroList();
    }

    refreshHeroList() {
        fetch(ASPNET_API + 'Heroes').then(response => response.json()).then(data => {
            let heroNames = data.map(h => h.Name);
            console.log(data);
            console.log(heroNames);
            this.setState({ displayedHero: null, selectedHero: "none", heroList: heroNames });
        });
    }

    fetchHero(heroName) {
        if (heroName == 'none') {
            alert("Please select a hero!")
            return;
        }

        if (this.state.displayedHero !== null && heroName === this.state.displayedHero.Name) {
            alert(`Already displaying Hero: ${heroName}`);
            return;
        }

        console.log(`GETTING ${heroName}`)

        fetch(ASPNET_API + 'Heroes/' + heroName).then(response => response.json()).then(data => {
            console.log("Received: " + data.Name);
            this.setState({ displayedHero: data, showAddHero: false });
        });
    }

    handleHeroSelectChange(event) {
        this.setState({ selectedHero: event.target.value });
    }

    handleHeroSubmit(event) {
        event.preventDefault();
        this.fetchHero(this.state.selectedHero);
    }

    handleAddHero(event) {
        event.preventDefault();
        console.log("adding new hero...");
        const newHero = {
            Name: "REINHARDT",
            Role: "Tank",
            Overview: "Clad in powered armor and swinging his hammer, Reinhardt leads a rocket-propelled charge across the battleground and defends his squadmates with a massive energy barrier.",
            Health: 300,
            Armor: 200,
            Shield: 0,
            PrimaryFire: {
                Name: "Rocket Hammer",
                Description: "Devastating melee weapon."
            },
            SecondaryFire: {
                Name: "Barrier Field",
                Description: "Hold Secondary Fire to deploy a frontal energy barrier."
            },
            Ability1: {
                Name: "Charge",
                Description: "Charge forward and smash an enemy against a wall.",
                Cooldown: 10
            },
            Ability2: {
                Name: "Fire Strike",
                Description: "Launch a fiery projectile.",
                Cooldown: 6
            },
            Ultimate: {
                Name: "Earthshatter",
                Description: "Knock down all enemies in front of you.",
                Cost: 1540
            }
        };

        const myHeaders = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        const myBody = JSON.stringify(newHero);
        const init = {
            method: "POST",
            headers: myHeaders,
            body: myBody,
        };
        /*
        fetch(ASPNET_API + 'Heroes/', init)
            .then(response => {
                if (response.status == 200) 
            })
            .catch(err => alert(err));
            */
        fetch(ASPNET_API + 'Heroes/', init)
            .then(response => response.json())
            .then(result => {
                alert(result);
                this.refreshHeroList();
            });
       
    }

    handleDeleteCurrentHero(event) {
        const msg = `Are you sure you want to delete '${this.state.displayedHero.Name}'?\nThis action cannot be undone!`;

        if (window.confirm(msg) != true)    return;

        const myHeaders = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };//new Headers();

        //const myBody = JSON.stringify(newHero);
        const init = {
            method: "DELETE",
            headers: myHeaders,
            //body: myBody,
        };

        fetch(ASPNET_API + 'Heroes/' + this.state.displayedHero.Name, init)
            .then(response => response.json())
            .then(result => {
                //alert(result);
                this.refreshHeroList();
            });
    }

    render() {
        const { heroList, selectedHero, displayedHero } = this.state;
        const current = this.state.showAddHero;
        console.log("Displayed Hero: " + displayedHero);
        let newButtonText = "Add New Hero";

        let visibleComponent;

        
        if (this.state.showAddHero) {
            visibleComponent = <AddHeroForm show={this.state.showAddHero} refreshHeroes={this.refreshHeroList}/>;
            newButtonText = "Cancel";
            //this.setState({ selectedHero: "none"});
        }
        else if (displayedHero != null) {
            visibleComponent = <HeroDisplay hero={displayedHero} onDelete={this.handleDeleteCurrentHero} />;
        }

        return (
            <div className="webpage">
                <h1>Overwatch Hero API</h1>

                <form onSubmit={this.handleHeroSubmit}>
                    <label for="heroes">
                        Choose a hero:
                        <select value={selectedHero} onChange={this.handleHeroSelectChange}>
                            <option value="none"> Select a Hero! </option>
                            { heroList.map(heroName => (
                                <option key={heroName} value={heroName}> {heroName} </option>     
                            ))}
                        </select>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>

                <button onClick={() => this.setState({ showAddHero: !current })}>
                    { newButtonText }
                </button>
                {visibleComponent}
            </div>
        );
    }
}


class AddHeroForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            HeroName: '',
            Role: '',
            Overview: '',
            Health: 1,
            Armor: 0,
            Shield: 0,

            PrimaryFireName: '',
            PrimaryFireDescription: '',

            SecondaryFireName: '',
            SecondaryFireDescription: '',

            Ability1Name: '',
            Ability1Description: '',
            Ability1Cooldown: 0,

            Ability2Name: '',
            Ability2Description: '',
            Ability2Cooldown: 0,

            UltimateName: '',
            UltimateDescription: '',
            UltimateCost: 0,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("Handling submit!");

        const newHero = {
            Name: this.state.HeroName,
            Role: this.state.Role,
            Overview: this.state.Overview,
            Health: this.state.Health,
            Armor: this.state.Armor,
            Shield: this.state.Shield,
            PrimaryFire: {
                Name: this.state.PrimaryFireName,
                Description: this.state.PrimaryFireDescription,
            },
            SecondaryFire: {
                Name: this.state.SecondaryFireName,
                Description: this.state.SecondaryFireDescription,
            },
            Ability1: {
                Name: this.state.Ability1Name,
                Description: this.Ability1Description,
                Cooldown: this.Ability1Cooldown,
            },
            Ability2: {
                Name: this.state.Ability2Name,
                Description: this.Ability2Description,
                Cooldown: this.Ability2Cooldown,
            },
            Ultimate: {
                Name: this.state.UltimateName,
                Description: this.UltimateDescription,
                Cooldown: this.UltimateCooldown,
            }
        };

        const myHeaders = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        //const myBody = JSON.stringify(newHero);
        console.log(newHero);

        const init = {
            method: "POST",
            headers: myHeaders,
            body: newHero,
        };

        fetch(ASPNET_API + 'Heroes/', init)
            .then(response => response.json())
            .then(result => {
                alert(result);
                this.props.refreshHeroes();
            });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        let hero = this.state.hero;
        return (
            <div className="HeroForm">
                <h2> Add Hero </h2>
                <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <table>
                        <tr>
                            <td>
                                <label> Hero Name: </label>
                            </td>
                            <td>
                                <input type="text" id="heroName" name="HeroName" placeholder="Hero Name" value={ this.state.Name } required/>

                                <label>Role:</label>
                                <input type="radio" id="tank" name="Role" value="Tank" required/>
                                <label for="tank">Tank</label>
                                <input type="radio" id="damage" name="Role" value="Damage" required/>
                                <label for="damage">Damage</label>
                                <input type="radio" id="support" name="Role" value="Support" required/>
                                <label for="support">Support</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Overview:</label>
                            </td>
                            <td>
                                <textarea id="overview" name="Overview" rows="3" cols="100" placeholder="Hero overview goes here" required></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>HP Breakdown:</label>
                            </td>
                            <td>
                                <label>Health:</label>
                                <input type="number" id="health" name="Health" min="1" placeholder="200" required />
                                <label>Armor:</label>
                                <input type="number" id="armor" name="Armor" min="0" placeholder="100" required />
                                <label>Shield:</label>
                                <input type="number" id="shield" name="Shield" min="0" placeholder="0" required />
                            </td>
                        </tr>
                        <tr>
                            <h4> Primary Weapon </h4>
                        </tr>
                        <tr>
                            <td>
                                <label> Weapon Name: </label>
                            </td>
                            <td>
                                <input type="text" id="primaryFireName" name="PrimaryFireName" placeholder="Primary Fire Name" required/><br />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label> Description: </label>
                            </td>
                            <td>
                                <textarea id="primarydescription" name="PrimaryFireDescription" rows="3" cols="100" placeholder="Weapon description goes here" required></textarea>
                            </td>
                        </tr>
                        <tr>
                            <h4> Secondary Weapon </h4>
                        </tr>
                        <tr>
                            <td>
                                <label> Weapon Name: </label>
                            </td>
                            <td>
                                <input type="text" id="secondaryFireName" name="SecondaryFireName" placeholder="Secondary Fire Name" required/><br />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label> Description: </label>
                            </td>
                            <td>
                                <textarea id="secondarydescription" name="SecondaryFireDescription" rows="3" cols="100" placeholder="Weapon description goes here" required></textarea>
                            </td>
                        </tr>
                        <tr>
                            <h4> Ability 1 </h4>
                        </tr>
                        <tr>
                            <td>
                                <label> Ability Name: </label>
                            </td>
                            <td>
                                <input type="text" id="ability1Name" name="Ability1Name" placeholder="Ability 1 Name" required/><br />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label> Description: </label>
                            </td>
                            <td>
                                <textarea id="ability1description" name="Ability1Description" rows="3" cols="100" placeholder="Ability description goes here" required></textarea><br />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label> Cooldown: </label>
                            </td>
                            <td>
                                <input type="number" id="ability1Cooldown" name="Ability1Cooldown" min="0" placeholder="8" required/>
                            </td>
                        </tr>
                        <tr>
                            <h4> Ability 2 </h4>
                        </tr>
                        <tr>
                            <td>
                                <label> Ability Name: </label>
                            </td>
                            <td>
                                <input type="text" id="ability2Name" name="Ability2Name" placeholder="Ability 2 Name" required/><br />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label> Description: </label>
                            </td>
                            <td>
                                <textarea id="ability2description" name="Ability2Description" rows="3" cols="100" placeholder="Ability description goes here" required></textarea><br />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label> Cooldown: </label>
                            </td>
                            <td>
                                <input type="number" id="ability2Cooldown" name="Ability2Cooldown" min="0" placeholder="8" required/>
                            </td>
                        </tr>
                        <tr>
                            <h4> Ultimate Ability </h4>
                        </tr>
                        <tr>
                            <td>
                                <label> Ability Name: </label>
                            </td>
                            <td>
                                <input type="text" id="ultimateName" name="UltimateName" placeholder="Ultimate Name" required/><br />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label> Description: </label>
                            </td>
                            <td>
                                <textarea id="ultimatedescription" name="UltimateDescription" rows="3" cols="100" placeholder="Ability description goes here" required></textarea><br />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label> Cost: </label>
                            </td>
                            <td>
                                <input type="number" id="ultimateCooldown" name="UlitmateCost" min="0" placeholder="1500" required/>
                            </td>
                        </tr>
                    </table>
                    <input type="submit"/>
                </form>
            </div>  
        )
    }
}


function HeroDisplay(props) {
    return (
        <div className="hero-display">
            <h2> {props.hero.Name} | Role: {props.hero.Role} </h2>
            <p> {props.hero.Overview} </p>
            <div className="health-table">
                <table>
                    <HealthBreakdownTable hero={props.hero} />
                    <WeaponTable hero={props.hero} />
                    <AbilityTable hero={props.hero} />
                </table>
                <button onClick={props.onDelete}> DELETE THIS HERO </button>
            </div>
        </div>
    );
}

function HealthBreakdownTable(props) {
    return (
        <div className= "health-breakdown">
            <h3>Health Breakdown</h3>
            <tr> Health = {props.hero.Health} </tr>
            {props.hero.Armor != 0 &&
            <tr> Armor = {props.hero.Armor} </tr>
            }
            { props.hero.Shield != 0 &&
            <tr> Shield = {props.hero.Shield} </tr>
            }
        </div>
    );
}

function WeaponTable(props) {
    return (
        <div className= "weapon-table">
            <h3> WEAPONS </h3>
            <tr>
                <Weapon weapon={ props.hero.PrimaryFire } type="Primary"/>
            </tr>
            <tr>
                <Weapon weapon={props.hero.SecondaryFire} type="Secondary"/>
            </tr>
        </div>
    );
}

function AbilityTable(props) {
    return (
        <div className= "ability-table">
            <h3>ABILITIES</h3>
            <tr>
                <Ability ability={props.hero.Ability1} type="E" />
            </tr>
            <tr>
                <Ability ability={props.hero.Ability2} type="SHIFT" />
            </tr>
            <tr>
                <Ability ability={props.hero.Ultimate} type="ULTIMATE" />
            </tr>
        </div>
    );
}

function Weapon(props) {
    return (
        <div className="weapon">
            <h4> {props.weapon.Name} ({props.type}) </h4>
            <p> {props.weapon.Description} </p>
        </div>
    );
}


function Ability (props) {
    return (
        <div className="ability">
            <h4> {props.ability.Name} {(props.type) === "ULTIMATE" ? "(ULTIMATE)" : ""}</h4>
            <p> {props.ability.Description} <br />
                 Cooldown: {(props.type) === "ULTIMATE" ? props.ability.Cost : props.ability.Cooldown} </p>
        </div>
    );
}


ReactDOM.render(
  <React.StrictMode>
        <Webpage />
   </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
