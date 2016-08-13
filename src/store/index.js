const store = {
    config: {
        username: 'johnsolo',
        rootURL: 'http://lierc-webui.local:5004/',
        sessionID: '2zfbuYhqSURN2De31RJJ2c'
    },
    ircEvents: []
}

export default store

store.startEventStream = function() {
    const eventSource = new EventSource(`${this.config.rootURL}${this.config.sessionID}/events/${this.config.username}`)
    eventSource.onmessage = function() {
        store.ircEvents.push(JSON.parse(event.data))
    }
    eventSource.onerror = function(event) {
        console.error(event)
    }
}

