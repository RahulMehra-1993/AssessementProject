import React, { createContext, useReducer, ReactNode } from "react";

// Define User Type
interface User {
  name: string;
  age: number;
}

// Define State Type
interface State {
  user: User[] | null;
  userError: string | null;
  userLoading: boolean;

  questions: string[];
  questionsError: string | null;
  questionsLoading: boolean;

  isModalOpen: boolean;
}

// Initial State
const initialState: State = {
  user: [],
  userError: null,
  userLoading: false,

  questions: [],
  questionsError: null,
  questionsLoading: false,

  isModalOpen: false,
};

// Define Action Types - Using const enums for better type safety
const enum ActionType {
  SET_USER = "SET_USER",
  SET_USER_ERROR = "SET_USER_ERROR",
  SET_USER_LOADING = "SET_USER_LOADING",
  SET_QUESTIONS = "SET_QUESTIONS",
  SET_QUESTIONS_ERROR = "SET_QUESTIONS_ERROR",
  SET_QUESTIONS_LOADING = "SET_QUESTIONS_LOADING",
  TOGGLE_MODAL = "TOGGLE_MODAL",
}

type Action =
  | { type: ActionType.SET_USER; payload: User[] }
  | { type: ActionType.SET_USER_ERROR; payload: string }
  | { type: ActionType.SET_USER_LOADING; payload: boolean }
  | { type: ActionType.SET_QUESTIONS; payload: string[] }
  | { type: ActionType.SET_QUESTIONS_ERROR; payload: string }
  | { type: ActionType.SET_QUESTIONS_LOADING; payload: boolean }
  | { type: ActionType.TOGGLE_MODAL };


// Reducer Function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_USER:
      return { ...state, user: [...state.user , ...action.payload], userError: null };
    case ActionType.SET_USER_ERROR:
      return { ...state, userError: action.payload };
    case ActionType.SET_USER_LOADING:
      return { ...state, userLoading: action.payload };

    case ActionType.SET_QUESTIONS:
      return { ...state, questions: action.payload, questionsError: null };
    case ActionType.SET_QUESTIONS_ERROR:
      return { ...state, questionsError: action.payload };
    case ActionType.SET_QUESTIONS_LOADING:
      return { ...state, questionsLoading: action.payload };

    case ActionType.TOGGLE_MODAL:
      return { ...state, isModalOpen: !state.isModalOpen };

    default:
      return state;
  }
};

// Define Context Type
interface StoreContextProps {
  state: State ;
  dispatch: React.Dispatch<Action> ;
}

// Create Context with Default Value
export const StoreContext = createContext<StoreContextProps | undefined >(undefined);

// Provider Component
interface StoreProviderProps {
  children: ReactNode; 
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};