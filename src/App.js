import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import UserList from './components/UserList';
import 'antd/dist/reset.css';

const App = () => {
    return (
        <Provider store={store}>
            <div className="App">
                <UserList />
            </div>
        </Provider>
    );
};

export default App;
