const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field = [[]], hardMode) {
        this.field = field;
        this.locX = 0;
        this.locY = 0;
        this.turn = 0;
        this.playing = true;
        this.hardMode = hardMode;
        this.newHoleX = 0;
        this.newHoleY = 0;
    };

    print() {
        this.field.forEach(el => console.log(el.join('')));
    };

    getMove() {
        let input = prompt('Which way? ').toLowerCase();
        switch (input) {
            case 'w':
                this.locY -= 1;
                break;
            case 's':
                this.locY += 1;
                break;
            case 'a':
                this.locX -= 1;
                break;
            case 'd':
                this.locX += 1;
                break;
            default:
                console.log('Invalid movement. Please use W, A, S or D.');
                this.getMove();
                break;
        };
        return input;
    };

    isHat() {
        return this.field[this.locY][this.locX] === hat;
    };

    isHole() {
        return this.field[this.locY][this.locX] === hole;
    };

    inField() {
        return (
            this.locX >= 0 &&
            this.locY >= 0 &&
            this.locX < this.field.length &&
            this.locY < this.field[0].length
        );
    };

    isChar() {
        return this.field[this.locY][this.locX] === pathCharacter;
    };

    isField() {
        return this.field[this.newHoleY][this.newHoleX] === fieldCharacter;
    };

    playGame() {
        while(this.playing) {
            if(this.hardMode) {
                this.digHole();
            }
            clear();
            this.print();
            while(!this.isChar()) {
                this.locX = Math.floor(Math.random() * this.field.length);
                this.locY = Math.floor(Math.random() * this.field[0].length);
            };
            this.getMove();

            if(!this.inField()) {
                console.log('You ran out of the field. Game over.');
                this.playing = false;
                break;
            }
            if(this.isHole()) {
                console.log('You fell down a hole. Game over.');
                this.playing = false;
                break;
            };
            if(this.isHat()) {
                console.log('Congrats! You found your hat.');
                this.playing = false;
                break;
            };
            if(this.isChar()) {
                console.log('You stepped on your own trail. Game over.');
                this.playing = false;
                break;
            };

            this.field[this.locY][this.locX] = pathCharacter;
            this.turn++;
        };
    };

    digHole() {
        let rand = Math.floor(Math.random() * 4) + 1;
        if (this.turn % 3 === 0) {
            for(let i = 0; i < rand; i++) {
                while(!this.isField()) {
                this.newHoleX = Math.floor(Math.random() * this.field.length);
                this.newHoleY = Math.floor(Math.random() * this.field[0].length);
                };
                this.field[this.newHoleY][this.newHoleX] = hole;
            };
        };
    };

    static generateField(h, w, percen) {
        let newField = [];
        let holePercen = (h * w) * (percen / 100);

        if (h >= 3 && h < 31 && w >= 3 && w < 31 && percen >= 1 && percen < 100) {
            for (let i = 0; i < h; i++) {
            newField.push([]);
                for (let j = 0; j < w; j++) {
                    newField[i].push(fieldCharacter);
                };
            };

            let charX = Math.floor(Math.random() * w);
            let charY = Math.floor(Math.random() * h);
            newField[charY][charX] = pathCharacter;

            let hatX = charX;
            let hatY = charY;

            while (hatX === charX || hatY === charY) {
                hatX = Math.floor(Math.random() * w);
                hatY = Math.floor(Math.random() * h);
            };
            newField[hatY][hatX] = hat;

            for (let k = holePercen; k > 0; k--) {
                let holeX = hatX;
                let holeY = hatY;
                while (holeX === hatX || holeX === charX || holeY === hatY || holeY === charY) {
                    holeX = Math.floor(Math.random() * w);
                    holeY = Math.floor(Math.random() * h);
                };
                newField[holeY][holeX] = hole;
            };
            return newField;

        } else if (h < 3) {
            console.log('Min field heigth is 3');
            process.exit();
        } else if (h > 30) {
            console.log('Max field height is 30');
            process.exit();
        } else if (w < 3) {
            console.log('Min field width is 3');
            process.exit();
        } else if (w > 30) {
            console.log('Max field width is 30');
            process.exit();
        } else if (percen < 1) {
            console.log('Min percentage of holes is 1');
            process.exit();
        }  else if (percen > 100) {
            console.log('Max percentage of holes is 100');
            process.exit();
        } else {
            console.log('Internal error: Unknown input');
            process.exit();
        };
    };
};

const genField = Field.generateField(10, 10, 20);

const myField = new Field(genField, true);

myField.playGame();