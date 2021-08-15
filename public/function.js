const {useReducer, useState, useEffect} = React
const initialState = {
    host: window.location.origin,
    auth: [
        {
            pathname: '/login',
            method: 'POST',
            body: {
                email: 'admin@gmail.com',
                password: '123456',
            },
        },
        {
            pathname: '/signin',
            method: 'POST',
            body: {
                email: 'user@gmail.com',
                password: '123456',
            },
        },
        {
            pathname: '/register',
            method: 'POST',
            body: {
                email: 'oliver@gmail.com',
                username: 'Oliver',
                password: '123456',
            },
        },
        {
            pathname: '/signup',
            method: 'POST',
            body: {
                email: 'harry@gmail.com',
                username: 'Harry',
                password: '123456',
            },
        },
    ],
    products: [
        {
            pathname: '/api/products',
            method: 'GET',
            body: {},
        },
        {
            pathname: '/api/products?_page=2&_limit=4',
            method: 'GET',
            body: {},
        },
        {
            pathname: '/api/products?color=plum',
            method: 'GET',
            body: {},
        },
        {
            pathname: '/api/products?name_like=tasty',
            method: 'GET',
            body: {},
        },
        {
            pathname: '/api/products?price_gte=400&price_lte=600',
            method: 'GET',
            body: {},
        },
        {
            pathname: '/api/products?_sort=price&_order=asc',
            method: 'GET',
            body: {},
        },
        {
            pathname: '/api/products',
            method: 'POST',
            body: {},
        },
        {
            pathname: '/api/products/',
            method: 'PATCH',
            body: {},
        },
        {
            pathname: '/api/products/',
            method: 'PUT',
            body: {},
        },
        {
            pathname: '/api/products/',
            method: 'DELETE',
            body: {},
        },
    ],
    db: {},
}
const rootReducer = (state = initialState, action) => {
    let newState = {...state}
    switch (action.type) {
        case 'setDB': {
            newState.db = action.payload
            return newState
        }
        default:
            return state
    }
}
const store = Redux.createStore(
    rootReducer /* preloadedState, */,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

function Header(props) {
    const state = ReactRedux.useSelector((state) => state)
    const dispatch = ReactRedux.useDispatch()

    useEffect(() => {
        fetch('/api/db')
            .then((res) => res.json())
            .then((res) => {
                dispatch({type: 'setDB', payload: res})
            })
    }, [])
    const resetFakeData = () => {
        fetch('/refresh')
            .then((res) => res.json())
            .then((res) => {
                dispatch({type: 'setDB', payload: res})
                alert('The database has just been updated')
            })
    }

    return (
        <div id='header'>
            <div id='logo'>FAKE API SERVER</div>
            <div id='navbar'>
                <ul>
                    <li onClick={() => window.open('/api/db', '_blank').focus()}>Show Database</li>
                    <li onClick={() => resetFakeData()}>Reset Demo Data</li>
                </ul> 
            </div>
        </div>
    )
}

function Content(props) {
    const state = ReactRedux.useSelector((state) => state)
    const [request, setRequest] = useState(
        `fetch("${state.host}/api/users")
.then(res => {
    if(!res.ok) throw res.statusText;
    return res.json()
})
.then(res => data = res)
.catch(err => data = {err: err.toString()})
`
    )
    const [result, setResult] = useState({})
    const [id, setID] = useState('')

    const selectRequest = ({pathname, method, body}) => {
        pathname = state.host + pathname
        let config = ``
        if (method == 'GET' || !method) {
            config = `fetch('${pathname}')`
        } else if (method == 'DELETE') {
            config = `fetch('${pathname}/${id}', {method: 'DELETE'})`
        } else if (method == 'POST') {
            config = `fetch('${pathname}', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(${JSON.stringify(body)}),
            })`
        } else if (['PATCH', 'PUT'].includes(method)) {
            config = `fetch('${pathname}/${id}', {
                method: '${method}',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(${JSON.stringify(body)}),
            })`
        }
        let rs = `let data = {}

${config}
    .then(res => {
        if(!res.ok) throw res.statusText;
        return res.json()
    })
    .then(res => data = res)
    .catch(err => data = {err: err.toString()})`

        setRequest(rs)
        setResult({})
    }

    const startRequest = () => {
        let data = {}
        eval(request + '.finally(() =>setResult(data))')
    }

    return (
        <div id='content'>
            <div id='path'>
                <ul>
                    <p>Your Database: </p>
                    {Object.keys(state.db).map((item, index) => (
                        <li key={index} onClick={(e) => selectRequest({pathname: '/api/' + item})}>
                            <button>GET</button>
                            <p
                                id='link'
                                onMouseDown={(e) => {
                                    if (e.button === 1) {
                                        window.open('/api/' + item, '_blank').focus()
                                    }
                                }}
                            >
                                {location.origin + '/api/' + item}
                            </p>
                        </li>
                    ))}
                </ul>
                <ul>
                    <p>Authentication: </p>
                    {state.auth.map((item, index) => (
                        <li key={index} onClick={(e) => selectRequest(item)}>
                            <button className={item.method}>{item.method}</button>
                            <p id='link'>{state.host + item.pathname}</p>
                        </li>
                    ))}
                </ul>
                {Object.keys(state.db).includes('products') && (
                    <ul>
                        <p>Example Products: </p>
                        {state.products.map((item, index) => (
                            <li key={index} onClick={(e) => selectRequest(item)}>
                                <button className={item.method}>{item.method}</button>
                                <p
                                    id='link'
                                    onMouseDown={(e) => {
                                        if (e.button === 1 && item.method == 'GET') {
                                            window
                                                .open(state.host + item.pathname, '_blank')
                                                .focus()
                                        }
                                    }}
                                >
                                    {state.host + item.pathname}
                                    {['PATCH', 'PUT', 'DELETE'].includes(item.method) && (
                                        <input
                                            placeholder='__id__'
                                            value={id}
                                            onChange={(e) => {
                                                setID(e.target.value)
                                            }}
                                            onKeyUp={(e) => {
                                                selectRequest(item)
                                            }}
                                        />
                                    )}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div id='action'>
                <div id='request'>
                    <h4>Request by Javascript</h4>
                    <pre
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => {
                            setRequest(e.target.innerText)
                        }}
                    >
                        {request}
                    </pre>
                    <button
                        onClick={() => {
                            startRequest()
                        }}
                    >
                        Start Request
                    </button>
                </div>
                <div id='result'>
                    <h4>Result:</h4>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            </div>
        </div>
    )
}
function App(props) {
    return (
        <div>
            <Header></Header>
            <Content></Content>
            <footer>Design by Heroku, NodeJS, ReactJS, Json-Server</footer>
        </div>
    )
}

const Provider = ReactRedux.Provider
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
)
