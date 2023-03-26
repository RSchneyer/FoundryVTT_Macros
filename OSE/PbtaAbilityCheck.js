/** 
* Powered By The Apocalypse style ability rolls.
* Instead of d20 + mod vs DC, 2d6 + mod falls into one of 3 categories:
* - total < 7: failure
* - total > 9: full success
* - total > 6 && total < 10: partial success
*/

const abilities = ["cha", "con", "dex", "int", "str", "wis"];
const ab_full_names = {"cha":"Charisma", "con":"Constitution", "dex":"Dexterity", "int":"Intelligence", "str":"Strength", "wis":"Wisdom"};
let scores = actor.system.scores;
let dialog_options = abilities.map(a=>`<option value=${a}>${ab_full_names[a]} (${scores[a].mod})</option>`).join(``);
let roll_options = `<option value="std">Standard</option><option value="adv">Advantage</option><option value="dis">Disadvantage</option>`
const dialog_content = `<div><h2>${actor.name}: Ability Check!</h2></div><div>Select Ability: <select name="ability">${dialog_options}</select></div><div>Bonus (not ability mod): <input id="roll_bonus" type="number" value="0" style="width:25%"/></div><div>Advantage? <select name="advantage">${roll_options}</select></div>`;

new Dialog({
  title: "PbtA Ability Check",
  content: dialog_content,
  buttons: {
    button1: {
      label: "Display Value",
      callback: (html) => myCallback(html),
      icon: `<i class="fa-solid fa-dice"></i>`
    }
  }
}).render(true);

async function myCallback(html) {
    const value = html.find("[name=ability]")[0].value;
    const ab_mod = scores[value].mod;
    const bonus = parseInt(html.find("input#roll_bonus").val());
    const roll_type = html.find("[name=advantage]")[0].value;
    console.log(roll_type);
    
    let roll_str;
    if(roll_type == "adv"){roll_str = `3d6kh2`;}
    else if(roll_type == "dis"){roll_str = `3d6kl2`;}
    else{roll_str = `2d6`;}

    let roll = await new Roll(roll_str).roll();
    console.log(roll.dice[0].results)

    let message = `<h2><b>${actor.name}</b> attempts a <b>${value.toUpperCase()}</b> ability check!</h2>`;

    if((roll.total + ab_mod + bonus) < 7){message += ` <div style="color:red">Failure 😭</div>`;}
    else if((roll.total + ab_mod + bonus) > 9){message += ` <div style="color:green">Full Success 🎉</div>`;}
    else{message += " <div>Partial Success 🤷</div>";}
    const roll_total = roll.total + ab_mod + bonus;
    message += `rolled a ${roll_total} <i>([${displayDice(roll.dice[0].results)}] + ${ab_mod} + ${bonus})</i>`;

    ChatMessage.create({user:game.user._id, speaker:ChatMessage.getSpeaker({token:actor}),content:message});
}

function displayDice(dice_arr){
    let ret_string = ``;
    dice_arr.forEach(function(i, idx, arr){
        if(!i.active){ret_string += `<del>${i.result}</del>`;}
        else {ret_string += i.result;}
        if(idx != arr.length - 1){ret_string += `, `}

    });
    return ret_string;
}
