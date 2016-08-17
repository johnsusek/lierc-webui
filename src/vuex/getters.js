import _ from 'lodash'

export function getChannelCount(state) {
    return state.channels.length
}

export function getChannels(state) {
    return state.channels
}

export function getSelectedChannel(state) {
    return _.find(state.channels, 'isBeingViewed')
}

export function userHasSelectedChannel(state) {
    return !!_.find(state.channels, 'isBeingViewed')
}

export function getConsole(state) {
    return state.console
}

export function getConnection(state) {
    return state.connection
}
