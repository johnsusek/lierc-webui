import store from '../store'

const ircEventStream = {
    source: {}
}

export default ircEventStream

ircEventStream.start = function() {
    this.source = new EventSource(`${store.apiConfig.rootURL}${store.apiConfig.sessionID}/events/${store.apiConfig.username}`)

    this.source.onmessage = (event) => {
        const eventData = JSON.parse(event.data)
        store.ircEvents.push(eventData) // for any components that just want a raw data feed of the irc events
        ircEventStream.parseEvent(eventData)
    }

    this.source.onerror = (event) => {
        console.error(event)
    }
}

ircEventStream.close = function() {
    this.eventSource.close()
}

ircEventStream.parseEvent = function(e) {
    console.log('This: ', this)
    console.log('Store: ', store)
    console.log('Command to parse: ', e.Command, e)
    switch (e.Command) {
    case 'JOIN':
    case 'PRIVMSG':
    case 'QUIT':
    case 'PART':
    case 'TOPIC':
    case 'NICK':
        break
    case '001':
    case '002':
    case '003':
    case '004':
    case '005':
    case '372':
    case '375':
    case '376':
    case '422':
        store.console.messages.push({ message: e.Params[1], timestamp: Date(e.Time) })
        break
    case '332':
    case '353':
    case '366':
        break
    }
}
