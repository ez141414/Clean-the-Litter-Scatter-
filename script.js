/* eslint-disable unicorn/prevent-abbreviations */
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const fontPadding = window.innerHeight / 35;
const aboutFontSize = window.innerHeight / 20;

let targetx = innerWidth/2;
let targety = innerHeight/2;
let gotargetx = true;
let gotargety = true;
let speed = 2.5;
let minspeed = 2.5;
let maxspeed = 8;
let lastx, lasty;
let dialogueRun = false;
let dragging = false;
let clickInteract = false;
let binHover = false;
let showExit = false;
const learnedDialogue = 'Thanks for learning! Click "X" to exit, then drag the litter.'

const mouse = {
  x: 0,
  y: 0,
  mousedown: false,
  mouseup: false,
  click: false
};

function isCollide(a, b) {
  return !(
    a.y + a.height < b.y ||
    a.y > b.y + b.height ||
    a.x + a.width < b.x ||
    a.x > b.x + b.width
  );
}

function mouseCollide(a) {
  return (
    a.y + a.height > mouse.y && a.y < mouse.y &
    a.x + a.width > mouse.x && a.x < mouse.x
  );
}

function pointTo(x1, y1, x2, y2) {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}

function distanceTo(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

canvas.addEventListener('mousemove', e => {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
});
canvas.addEventListener('mousedown', () => {
  mouse.mousedown = true;
  mouse.mouseup = false;
});

canvas.addEventListener('mouseup', () => {
  mouse.mouseup = true;
  // mouse.click = false;
  mouse.mousedown = false;
});

canvas.addEventListener('click', () => {
  mouse.click = true;
});


let frame = 0;
class Trash {
  constructor(x, y, width, height, image, description, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = document.querySelector(image);
    this.description = description;
    this.hover = false;
    this.clicked = false;
    this.dialogue = false;
    this.dragging = false;
    this.index = 0;
    this.ogx = x;
    this.ogy = y;
    this.type = type;
    this.learned = false;
  }

  Update() {
    this.Draw();
    if (mouseCollide(this)) {
      this.hover = true;
    } else {
      this.hover = false;

    }

    if (this.learned) {
      if (this.hover && mouse.mousedown && (this.dragging || !dragging)) {
        dragging = true;
        this.dragging = true;
      } else {
        let litterBinCollide = false;
        for (const bin of bins) {
          if (isCollide(bin, this)) {
            litterBinCollide = true;
          }
        } 

        if (!litterBinCollide) {
          this.ogx = this.x;
          this.ogy = this.y;
        }
      }

      if (this.dragging) {
        this.x = mouse.x - this.width / 2;
        this.y = mouse.y - this.height / 2;
      }

      if (!mouse.mousedown) {
        this.dragging = false;
      }
    }

    if (!dialogueRun && !this.dialogue) {
      if (this.hover && mouse.click){
        clickInteract = true
        this.clicked = true;
      } else {
        clickInteract = false;
        this.clicked = false;
      }

      if (this.clicked & this.learned) {
        this.clicked = false;
        mouse.click = false;
      } else if (this.clicked & !this.learned){
        this.clicked = false;
        mouse.click = false;
        this.dialogue = true;
        dialogueRun = true;
      }

    } else if (!dialogueRun && this.dialogue) {
      this.dialogue = false;
    }


    if (this.dialogue & !this.learned) {
      ctx.fillStyle = 'rgba(135 206 235 / 50%)';
      if (window.innerWidth > 1000) {
        ctx.fillRect(
          window.innerWidth * (1/4),
          window.innerHeight * (3 / 4),
          window.innerWidth * (1 / 2),
          window.innerHeight * (1 / 6)
        );
      } else {
        ctx.fillRect(
          window.innerWidth * (1/12),
          window.innerHeight * (3 / 4),
          window.innerWidth - window.innerWidth * (1 / 6),
          window.innerHeight * (1 / 6)
        );
      }
      ctx.fillStyle = 'black';
      ctx.font = `${aboutFontSize / 2}px poppins`;
      if (window.innerWidth < 1000) {
        ctx.fillText(
          this.description[this.index],
          window.innerWidth * (1 / 12) + fontPadding,
          window.innerHeight * (47 / 64) + aboutFontSize * 0.7 + fontPadding
        );
      } else {        
        ctx.fillText(
          this.description[this.index],
          window.innerWidth * (3 / 12) + fontPadding,
          window.innerHeight * (47/ 64) + aboutFontSize * 0.7 + fontPadding
        );
      }
      ctx.font = `${aboutFontSize / 2}px poppins`;

      if (window.innerWidth < 1000) {
        if (this.description.length > this.index + 1) { // check if reach last line
          if (
            mouseCollide({
              x: window.innerWidth * (10 / 12),
              y: window.innerHeight * (56 / 64),
              width: 50,
              height: 20
            })
          ) {
            ctx.fillStyle = 'white';
            ctx.fillText(
              'next',
              window.innerWidth * (10 / 12),
              window.innerHeight * (57 / 64)
            );
            if (mouse.click) {
              this.index += 1;
              this.clicked = false;
              mouse.click = false;
            }
          } else {
            ctx.fillStyle = 'black';
            ctx.fillText(
              'next',
              window.innerWidth * (10 / 12),
              window.innerHeight * (57 / 64)
            );
          }
        } else {
          showExit = true;
        }
      } else {
        if (this.description.length > this.index + 1) { // check if reach last line
          if (
            mouseCollide({
              x: window.innerWidth * (8.5 / 12),
              y: window.innerHeight * (56 / 64),
              width: 50,
              height: 20
            })
          ) {
            ctx.fillStyle = 'white';
            ctx.fillText(
              'next',
              window.innerWidth * (8.5 / 12),
              window.innerHeight * (57 / 64)
            );
            if (mouse.click) {
              this.index += 1;
              mouse.click = false;
            }
          } else {
            ctx.fillStyle = 'black';
            ctx.fillText(
              'next',
              window.innerWidth * (8.5 / 12),
              window.innerHeight * (57 / 64)
            );
          }
        } else {
          showExit = true;
        }
      }

    }
  }

  Draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Bin {
  constructor (x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.image = document.querySelector(`#${type}`)
    this.hover = false;
  }

  Update() {
    this.Draw();
    this.y = window.innerHeight / 10 - window.innerHeight / 12;
    if (this.type === 'trashbin') {
      this.x = window.innerWidth - window.innerHeight / 8;
    } else if (this.type === 'recyclebin') {
      this.x = window.innerWidth - window.innerHeight / 8 - window.innerHeight / 6;
    } else {
      this.x = window.innerWidth - window.innerHeight / 8 - window.innerHeight / 3;
    }

  }

  Draw() {
    ctx.globalAlpha = 0.6;
    for (const trashobject of trashobjects) {
      console.log(isCollide(trashobject, this) + ' first');
      if (isCollide(trashobject, this) && (!binHover || this.hover)) {
        if (!binHover) {
          binHover = true;
          this.hover = true
        }
        ctx.globalAlpha = 1;
        if (mouse.mouseup) {
          if (trashobject.learned) {
            if (trashobject.type === this.type) {
              mouse.mouseup = false;
              if (trashobject.dialogue) {
                dialogueRun = false;
              }
              trashobjects.splice(trashobjects.indexOf(trashobject), 1);
              trash += 1;
            } else {
              trashobject.x = trashobject.ogx;
              trashobject.y = trashobject.ogy;
              // window.alert('This is the wrong bin.')
            }
          }
        }

      } else if (!isCollide(trashobject, this) && this.hover) {
        this.hover = false;
      }
    }
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.globalAlpha = 1;

  }
  
}

const bins = [new Bin(
  window.innerWidth - window.innerHeight / 12 - window.innerHeight / 12, 
  window.innerHeight / 10 - window.innerHeight / 12,
  window.innerHeight / 18, 
  window.innerHeight / 14, 
  'recyclebin'
), new Bin(
  window.innerWidth - window.innerHeight / 10 - window.innerHeight / 6, 
  window.innerHeight / 10 - window.innerHeight / 12, 
  window.innerHeight / 14, 
  window.innerHeight / 13, 
  'compostbin'
), new Bin(
  window.innerWidth - window.innerHeight / 12,
  window.innerHeight / 10 - window.innerHeight / 12, 
  window.innerHeight / 20, 
  window.innerHeight / 13, 
  'trashbin'
)
];


class ExitButton {
  constructor(exitType, width, height, colour) {
    this.exitType = exitType;
    this.width = width;
    this.height = height;
    this.colour = colour;
  }
  Update () {
    // update coords for responsive
    if (this.exitType === 'dialogue') {
      if (window.innerWidth > 1000) {
        this.x = innerWidth * 750/1000 - 30;
        this.y = innerHeight * 750/1000;
      } else {
        this.x = innerWidth * 916/1000 - 30;
        this.y = innerHeight * 750/1000;
      }
    }

    // hover settings
    if (mouseCollide(this)) {
      this.hover = true;
    } else {
      this.hover = false;
    }

    if (dialogueRun && showExit) {
      this.Draw();
      if (this.hover && mouse.click){
        mouse.click = false;
        this.clicked = true;
        clickInteract = true;
        dialogueRun = false;
        showExit = false;
        for (const trashobject of trashobjects) {
          if (trashobject.dialogue) {
            trashobject.learned = true;
            trashobject.dialogue = false;
            trashobject.clicked = false;
          }
        }
      } else {
        this.clicked = false;
        clickInteract = false;
      }
  
      if (this.clicked && !dragging) {
        this.clicked = false;
        mouse.click = false;
        dialogueRun = false;
      }
    }
  }

  Draw () {
    if (!this.hover) {
      ctx.fillStyle = 'red';
    } else {
      ctx.fillStyle = this.colour;
    }
    ctx.font = '40px poppins';
    ctx.fillText('x', this.x + 4, this.y + 29);
  }
}

// 235 561
const trashobjects = [
  new Trash(innerWidth * 0.1, innerHeight * 0.3, 50, 69, '#can', ['This is a metal can.', 'Animals can get trapped inside of the can.', 'It should be thrown into the trash can.', learnedDialogue], 'trashbin'),
  new Trash(innerWidth * 0.8, innerHeight * 0.4, 110, 60, '#sixpackring', ['This is a plastic six pack ring from canned soda.', 'Animals can get strangled by the rings.', 'It should be thrown into the recycling bin', learnedDialogue], 'recyclebin'),
  new Trash(innerWidth * 0.5, innerHeight * 0.2, 75, 47, '#bottle', ['This is a plastic bottle.', 'Plastic can take up to 500 years to decompose.', 'It should be thrown into the recycling bin to be reused.', learnedDialogue], 'recyclebin'),
  new Trash(innerWidth * 0.6, innerHeight * 0.7, 128, 65, '#banana', ['This is a banana peel.', 'It should be thrown in the compost bin.', learnedDialogue], 'compostbin'),
  new Trash(innerWidth * 0.25, innerHeight * 0.6, 125, 80, '#pizza', ['This is a pizza box.', 'It should be thrown in the recycling bin.', learnedDialogue], 'recyclebin'),
  new Trash(innerWidth * 0.85, innerHeight * 0.8, 65, 65, '#apple', ['This is a apple core.', 'It should be thrown in the compost bin.', learnedDialogue], 'compostbin'),
  new Trash(innerWidth * 0.5, innerHeight * 0.5, 75, 75, '#wrapper', ['This is a choclate wrapper.', 'It should be thrown in the garbage bin.', learnedDialogue], 'trashbin')
];

const dialogueExit = new ExitButton('dialogue', 30, 30, 'white');
let trash = 0;
const beach = document.querySelector('#beach');

let maxTrash = trashobjects.length;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(beach, 0, 0,  canvas.width, canvas.height);
  frame += 1;
  let isThereDrag = false;
  let isThereBinHover = false;
  
  for (const bin of bins) {
    bin.Update();
    if (bin.hover) {
      isThereBinHover = true;  
    }
  }
  binHover = isThereBinHover;

  ctx.fillStyle = 'black';
  ctx.font = '30px poppins';
  ctx.fillText('Litter Thrown out: ' + trash + '/' + maxTrash, 20,  50);
  ctx.font = '20px poppins';
  if (trash !== 7) {
    ctx.fillText(' 1. FIRST, learn about the litter by clicking', 20, 90);
    ctx.fillText('    on them to enter the dialogue.', 20, 120);
    ctx.fillText('2. AFTER exiting the dialogue, drag the', 20, 150);
    ctx.fillText('    litter to the correct bin. ', 20, 180);
  } else {
    ctx.fillText('Congratulations! You have disposed of all the litter!', 20, 90);
  }
  for (const trashobject of trashobjects) {
    trashobject.Update();
    if (trashobject.dragging) {
      isThereDrag = true;  
    }
    
    // reset dialogue line
    if (!dialogueRun && trashobject.index !== 0) {
      trashobject.index = 0;
    }

  }
  dragging = isThereDrag;

  dialogueExit.Update();
  if (mouse.click && !clickInteract) {
    mouse.click = false;
  }
  ctx.drawImage(document.querySelector('#glove'), mouse.x -15, mouse.y - 15, 30, 70);
  requestAnimationFrame(animate);
}

const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  animate(0);
};

window.addEventListener('resize', resize, true);
resize();


window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'e': {
      player.event = true;
      break;
    }
  }
});

window.addEventListener('keyup', e => {
  switch (e.key) {
    case 'e': {
      player.event = false;
    }
  }
});