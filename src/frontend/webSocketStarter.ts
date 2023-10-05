const webClientStarter = () => {
    const wsClient: WebSocket = new WebSocket(`ws://${location.host}`);

    wsClient.onopen = () => {
        setInterval(() => wsClient.send("Hello mon copaing"), 5000)
    };

    wsClient.onmessage = (event: MessageEvent) => {
        if (event.data === "reload") {
            location.reload();
        }
    };
};

export default webClientStarter;