import React, { createContext, useContext, useReducer } from 'react';

//Path con la direccion de la API que tenemos en el BackEnd
const HOST_API = "http://localhost:8080/api";
//Estados iniciales para el Store
const initialState = {
  list: []
};

//Para utilizar el Store hay que delimitarlo como un contexto
const Store = createContext(initialState);

const List = () => {
  //Hooks

  const { dispatch, state } = useContext(Store);//El Store es para guardar los estados internos de la app

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Nombre</td>
            <td>¿Esta completado?</td>
          </tr>
        </thead>
        <tbody>
          {
            state.list.map((element) => {
              return(
                <div>
                  <td>{element.id}</td>
                  <td>{element.name}</td>
                  <td>{element.description}</td>
                  <td>{element.isCompleted}</td>
                </div>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

//Reducer
//Funcion pura, Dada una entrada, siempre va a resibir la misma salida de esa entrada
function reducer(state, action) {
  switch (action.type) {
    case 'update-list':{
      return {...state, list: action.list};
    }
    case 'add-item':{
      const newList = state.list;
      newList.push(action.item);
      return {...state, list: newList}
    }
    default:{
      return state;
    }
  }
}

//Provider, permite conectar entre sí diferentes componentes
const StoreProvider = ({ children }) => {  
  //Se basa en el contexto ya creado 'Store'
  //Al reducer se le envian tambien los estados iniciales
  const [state, dispatch] = useReducer(reducer, initialState);

  //Se le inyecta dos argumentos el 'state' y el 'dispatch'
  //state --> como esta el reducer actualmente
  //dispatch --> indica que cambios quiere que pasen en el sistema orientados a una accion
  return(
    <Store.Provider value={{state, dispatch}}>
      {children}
    </Store.Provider>
  )
};

function App() {
  //Contenedor de componentes
  return (
      <StoreProvider>
        <List />
      </StoreProvider>
  );
}

export default App;
