// Components should call actions to change app state, never changing the store directly.
import ircEventStream from '../store/ircEventStream'

const actions = {
    openIRCEventStream: () => ircEventStream.open(),
    closeIRCEventStream: () => ircEventStream.close()
}

export default actions
