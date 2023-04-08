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
    }
}