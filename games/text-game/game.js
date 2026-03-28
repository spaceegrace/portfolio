// Nirvana Text Adventure Game - JavaScript Version
// Converted from TextBasedGame.py

class NirvanaGame {
    constructor() {
        this.rooms = {
            'Legs': { 'East': 'Heart', 'item': 'Effort' },
            'Heart': { 'West': 'Legs', 'East': 'Hands', 'South': 'Body', 'item': 'Livelihood' },
            'Hands': { 'West': 'Heart', 'item': 'Action' },
            'Body': { 'West': 'Brain', 'East': 'Ego', 'North': 'Heart', 'South': 'Mouth' },
            'Brain': { 'East': 'Body', 'South': 'Mind', 'item': 'Resolve' },
            'Mind': { 'North': 'Brain', 'item': 'Mindfulness' },
            'Mouth': { 'North': 'Body', 'East': 'Eyes', 'item': 'Speech' },
            'Eyes': { 'West': 'Mouth', 'item': 'View' },
            'Ego': { 'West': 'Body', 'North': 'Rebirth', 'item': 'Samadhi' },
            'Rebirth': { 'South': 'Ego', 'item': 'Samsara' }
        };

        this.currentRoom = 'Body';
        this.inventory = [];
        this.gameActive = false;
    }

    itemPickUp() {
        if (this.currentRoom === 'Rebirth') {
            if (this.inventory.length === 8) {
                this.addOutput("\n🎉 Congratulations!");
                this.addOutput("\nYou have ended the cycle of rebirth and have achieved Nirvana!");
                return "win";
            } else {
                this.addOutput("\n⚠️ You reached Samsara without all 8 practices.");
                this.addOutput(`\nYou have ${this.inventory.length} out of 8 practices.`);
                this.addOutput("\nThe cycle of rebirth continues...");
                return "lose";
            }
        }

        if ('item' in this.rooms[this.currentRoom]) {
            const itemInRoom = this.rooms[this.currentRoom]['item'];
            if (!this.inventory.includes(itemInRoom)) {
                this.addOutput(`✨ You have attained ${itemInRoom}.`);
                this.inventory.push(itemInRoom);
            } else {
                this.addOutput(`📦 You already have ${itemInRoom}.`);
            }
        }

        return null;
    }

    moveRoom(direction) {
        if (direction in this.rooms[this.currentRoom]) {
            this.currentRoom = this.rooms[this.currentRoom][direction];
            return true;
        } else {
            this.addOutput(`❌ Unable to go ${direction} from here!`);
            return false;
        }
    }

    displayRoom() {
        this.addOutput(`\n📍 You are in ${this.currentRoom}`);
        this.addOutput(`📦 Inventory (${this.inventory.length}/8): ${this.inventory.join(', ') || 'empty'}`);
        this.displayExits();
    }

    displayExits() {
        const exits = Object.keys(this.rooms[this.currentRoom]).filter(key => key !== 'item');
        this.addOutput(`🚪 Available exits: ${exits.join(', ') || 'None'}`);
    }

    addOutput(text) {
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML += text + '\n';
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    clearOutput() {
        document.getElementById('output').innerHTML = '';
    }

    startGame() {
        this.clearOutput();
        this.currentRoom = 'Body';
        this.inventory = [];
        this.gameActive = true;

        this.addOutput("🧘 Nirvana Text Adventure Game");
        this.addOutput("Collect all eight practices to defeat Samsara and achieve Nirvana.");
        this.addOutput("\nThe Eight Practices:");
        this.addOutput("1. Effort (Legs)");
        this.addOutput("2. Livelihood (Heart)");
        this.addOutput("3. Action (Hands)");
        this.addOutput("4. Resolve (Brain)");
        this.addOutput("5. Mindfulness (Mind)");
        this.addOutput("6. Speech (Mouth)");
        this.addOutput("7. View (Eyes)");
        this.addOutput("8. Samadhi (Ego)");

        this.displayRoom();
        document.getElementById('input').focus();
    }

    processInput(input) {
        if (!this.gameActive) return;

        const userMove = input.trim().toLowerCase();

        if (userMove === 'exit') {
            this.addOutput("\n👋 Exiting game. Thank you for playing!");
            this.gameActive = false;
            document.getElementById('input').disabled = true;
            return;
        }

        const directions = ['north', 'south', 'east', 'west'];
        const directionMap = {
            'north': 'North',
            'south': 'South',
            'east': 'East',
            'west': 'West'
        };

        if (directions.includes(userMove)) {
            const direction = directionMap[userMove];
            this.moveRoom(direction);
            this.displayRoom();

            const status = this.itemPickUp();

            if (status === 'lose' || status === 'win') {
                this.addOutput("\n☸\n\n☸\n\n☸\n");
                this.gameActive = false;
                document.getElementById('input').disabled = true;
                this.showPlayAgainButton();
            }
        } else {
            this.addOutput(`❌ Invalid command. Use: North, South, East, West, or Exit`);
        }
    }

    showPlayAgainButton() {
        const container = document.getElementById('game-container');
        let button = document.getElementById('play-again-btn');
        if (!button) {
            button = document.createElement('button');
            button.id = 'play-again-btn';
            button.textContent = 'Play Again?';
            button.onclick = () => this.startGame();
            container.appendChild(button);
        }
        button.style.display = 'block';
    }
}

// Initialize game
const game = new NirvanaGame();

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const input = document.getElementById('input');

    startBtn.addEventListener('click', () => {
        game.startGame();
        input.disabled = false;
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            game.processInput(input.value);
            input.value = '';
        }
    });
});
