express = require('express')
const app = express()
const port = 3000
const path = require('path');

const { exec } = require('child_process');
const say = require('say');

let index = 0;
let t = new Date();
//obj
const myObject = {
  opencalc: "calc",
  opennotepad: "start notepad",
  opensetting: "start ms-settings:",
  opencmd: "start cmd",
  openfile: "start explorer",
  openchrome: "start chrome",
  openvsc: "code",

};
// key
const keys = ["open calculator.", "open notepad.", "open setting.", "open file manager.", "open command prompt.", "open chrome.", "open visual studio code."];
function speak2(text) {
  say.speak(text, 9);
}

function speak(line, index) {
  if(line[index]==='paues'){
    return;
  }
  say.speak(line[index], 'Alex', 0.85, () => {
    if (index < line.length) {
      console.log(line[index]);
      setTimeout(() => {
        speak(line, index + 1);
      }, 2500);
    }
  });
}

line = ["wellcome to the BotAi... ",
  t.toLocaleTimeString(),
  "How can I assist you today?"];
async function openProgram(cmdName, input) {
  let i = 0;
  const openappCommand = cmdName;
  exec(openappCommand, (error, stdout, stderr) => {
    if (error) {
      i = 1;
      console.error(`Error: ${error.message}`);
      return i;
    }
    if (stderr) {
      i = 1;
      console.error(`stderr: ${stderr}`);
      return i;
    }
    console.log(`opening: ${stdout}`);
    if (i == 0) {
      return i;
    }
  });
  if (i == 0)
    return `Successfully ${input} program`;
  else
    return 'Not to open this program!';
}
//check 4 step

async function chack(input) {
  let istrue = true;
  let output;
  if ("wellcome" === input) {
    speak(line, index)
    console.log(line, input);
    output = line;
    istrue = false;
    console.log("y1")

    return output;
  }

  // new method
  if (keys.filter(item => item.includes(input.toLowerCase()))) {
    let a = keys.filter(item => item === input.toLowerCase())
    console.log(a);
    if (a.length > 0) {
      if (a[0] === 'open calculator.') {
        speak(["Successfully" + input], 0);
        openProgram(myObject['opencalc'], input);
      }
      else if (a[0] === 'open notepad.') {
        console.log(myObject['opennotepad']);
        speak(["Successfully " + input], 0);
        openProgram(myObject['opennotepad'], input);
      }
      else if (a[0] === 'open setting.') {
        speak(["Successfully" + input], 0);
        openProgram(myObject['opensetting'], input);
      }
      else if (a[0] === 'open file manager.') {
        speak(["Successfully" + input], 0);
        openProgram(myObject['openfile'], input);
      }
      else if (a[0] === 'open command prompt.') {
        speak(["Successfully" + input], 0);
        console.log(myObject['opencmd']);
        openProgram(myObject['opencmd'], input);
      }
      else if (a[0] === 'open chrome.') {
        speak(["Successfully" + input], 0);
        openProgram(myObject['openchrome'], input);
      }
      else if (a[0] === 'open visual studio code.') {
        speak(["Successfully" + input], 0);
        openProgram(myObject['openvsc'], input);
      }
      else {
        console.log("no mach");
        output = "error opning this application ! please try deffrent application";
      }

      return "Successfully " + input;
    }
    else console.log("'BotAi Sorry, I could not find an answer.'");

  }
  console.log("wiki start", istrue);
  if (istrue) {
    console.log("wiki start");
    let data = await getWikiAnswer(input);
    console.log(data);
    return data;
  }

  return "no match"
}

//server code
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

// Render Html File
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.post('/api', async function (req, res, next) {
  console.log(req.body)
  // speak(line, index);
  const mes = await chack(req.body.input)
  res.json({ success: true, message: mes })
})


app.listen(port, () => {
  console.log("Running...")
  // Code.....
})


// wiki

async function getWikiAnswer(query) {
  return new Promise((resolve, reject) => {
    var url = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(query) + "&format=json&origin=*";
    let answer;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        answer = data.query.search[0].snippet;
        console.log("y:", answer);
        // speak([answer], 0);
        resolve(' <b>Answer by Wikipedia: </b>' + answer);
      })
      .catch(() => reject("no"));

  })

}
