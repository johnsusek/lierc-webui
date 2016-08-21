export const resetState = function({ dispatch }) {
    dispatch('STATE_RESET')
}

export const selectChannel = function({ dispatch }, channel) {
    dispatch('UI_CHANNEL_SELECT', channel)
}

export const addConnectionToList = function({dispatch}, connection, id) {
    dispatch('LIERC_CONNECTION_ADDED', connection, id)
}

// POST api/logout
export const logoutUser = function({ dispatch }) {
    return this.$http.post('/api/logout').then((response) => {
        if (response.json().status === 'ok') {
            dispatch('STATE_RESET')
        }
        else {
            dispatch('AJAX_SERVICE_ERROR', response.text(), response)
        }
    }, (response) => {
        dispatch('AJAX_TRANSPORT_ERROR', response.json().error, response)
    })
}

// GET api/connection
export const refreshConnections = function({ dispatch }) {
    return this.$http.get('/api/connection').then((response) => {
        dispatch('LIERC_CONNECTIONS_RECEIVED', response.json())
    }, (response) => {
        dispatch('AJAX_TRANSPORT_ERROR', response.json().error, response)
    })
}

// GET api/auth
export const checkUserAuthStatusAndSetId = function({ dispatch }) {
    return this.$http.get('/api/auth').then((response) => {
        if (response.json().user) {
            dispatch('LIERC_IS_AUTHENTICATED', response.json().user, response.json().email)
        }
        else {
            dispatch('AJAX_SERVICE_ERROR', response.text(), response)
        }
    }, (response) => {
        dispatch('AJAX_TRANSPORT_ERROR', response.json().error, response)
    })
}

// POST api/auth
export const loginUser = function({ dispatch }, formData) {
    return this.$http.post('/api/auth', formData)
}

// POST api/register
export const registerUser = function({ dispatch }, formData) {
    return this.$http.post('/api/register', formData)
}

// POST api/connection
export const createConnection = function({ dispatch }, connection) {
    return this.$http.post('/api/connection', connection)
}

// DELETE api/connection/:id
export const deleteConnection = function({ dispatch }, id) {
    return this.$http.delete(`/api/connection/${id}`).then((response) => {
        if (response.json().status === 'ok') {
            dispatch('LIERC_CONNECTION_REMOVED', id)
        }
        else {
            dispatch('AJAX_SERVICE_ERROR', response.text(), response)
        }
    }, (response) => {
        dispatch('AJAX_TRANSPORT_ERROR', response.json().error, response)
    })
}

// POST api/connection/:id
export const sendCommand = function({ dispatch }, id, message) {
    return this.$http.post(`/api/connection/${id}`, message).then((response) => {
        if (response.json().status !== 'ok') {
            dispatch('AJAX_SERVICE_ERROR', response.text(), response)
        }
    }, (response) => {
        dispatch('AJAX_TRANSPORT_ERROR', response.json().error, response)
    })
}
