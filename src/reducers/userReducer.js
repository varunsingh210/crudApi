// src/redux/reducers/userReducer.js

const initialState = {
    loading: false,
    users: [],
    selectedUser: null,
    error: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_USERS_REQUEST":
            return { ...state, loading: true };
        case "FETCH_USERS_SUCCESS":
            return { ...state, loading: false, users: action.payload };
        case "FETCH_USERS_FAILURE":
            return { ...state, loading: false, error: action.payload };
        case "DELETE_USER_SUCCESS":
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.payload)
            };
        case "SET_ITEM":
            return { ...state, selectedUser: action.payload };
        case "UPDATE_USER_SUCCESS":
        
            // console.log('Before update:', state.users);
            // console.log('Update payload:', action.payload);
            // console.log('Update payload id:', action.payload.id);
            const updatedUsers = state.users.map(user =>
                user.id === action.payload.id ? { ...user, ...action.payload } : user
            );
            
            // console.log('After update:', updatedUsers);
            return {
                ...state,
                users: updatedUsers
            };
        case "CREATE_USER_SUCCESS":
            // console.log('Create payload:', action.payload);
            return {
                ...state,
                users: [...state.users, action.payload]
            };
        default:
            return state;
    }
};

export default userReducer;
