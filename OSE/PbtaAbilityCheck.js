const abilities = ["cha", "con", "dex", "int", "str", "wis"];
let scores = actor.system.scores;
let dialog_options = abilities.map(a=>`<option value=${a}>${a.toUpperCase()}</option>`).join(``);
const dialog_content = `<div><h2>Ability Check!</h2></div><div>Select Ability:<select name="ability">${dialog_options}</select></div>`;

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
console.log(ab_mod);
    let roll = await new Roll(`2d6`).roll();
    let message = `<h2><b>${actor.name}</b> attempts a <b>${value.toUpperCase()}</b> ability check!</h2>`;
    if((roll.total + ab_mod) < 7){message += " failure";}
    else if((roll.total + ab_mod) > 9){message += " full success";}
    else{message += " partial success";}
    message += `, rolled a ${(roll.total+ab_mod)} <i>(${roll.total} + ${ab_mod})</i>`;

    ChatMessage.create({user:game.user._id, speaker:ChatMessage.getSpeaker({token:actor}),content:message});
}
