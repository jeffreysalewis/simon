const GameEvent = {
    System: 'system',
    End: 'gameEnd',
    Start: 'gameStart',
};

class EventMessage {
    constructor(from, type, value){
        this.from = from;
        this.type = type;
        this.value = value;
    }
}

class GameEventNotifier {
    events = [];
    handlers = [];

    constructor() {
        //when dev debugging we need to talk to the service and not the react debugger
        let port = window.location.port;
        if(process.env.NODE_ENV !== 'production') {
            port = 3000;
        }

        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket.onopen = (event) => {
            try {
                const event = JSON.parse(await msg.data.text());
                this.receiveEvent(event);
            } catch {}
        };
    }

    broadcastEvent(from, type, value) {
        const event = new EventMessage(from, type, value);
        this.socket.send(JSON.stringify(event));
    }

    addHandler(handler) {
        this.handlers.push(handler);
    }

    removeHandler(handler) {
        this.handlers.filter((h) => h !== handler);
    }

    receiveEvent(event) {
        this.event.push(event);

        this.events.forEach((e) => {
            this.handlers.forEach((handler) => {
                handler(e);
            });
        });
    }
}

const GameNotifier = new GameEventNotifier();
export { GameEvent, GameNotifier };