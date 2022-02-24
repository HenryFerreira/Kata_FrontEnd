import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';

//Path con la direccion de la API que tenemos en el BackEnd
const HOST_API = "http://localhost:8080/api";
//Estados iniciales para el Store
const initialState = {
  list: []
};

//Para utilizar el Store hay que delimitarlo como un contexto
const Store = createContext(initialState);

const Form = () =>{
  //Hooks
  //Nos permite identificar las propiedades de un componente en espesifico
  //En este caso la referencia es la del formulario (form)
  //Se inicializa en nulo y el se crea (o inicializa) cuando el componente es montado
  const formRef = useRef(null);
  //useContext --> nos da un estado externo
  const { dispatch } = useContext(Store);//El Store es para guardar los estados internos de la app
  const [state, setState] = useState({});//Permite tener estados internos dentro del componente

  //Metodo para poder agregar la lista
  const onAdd = (event) =>{
    event.preventDefault();

    //Respuesta --> lo que va a ser enviado en el body como un JSON
    const request = {
      name: state.name,
      id: null,
      isCompleted: false
    };

    //El featch se conecta al path de la url
    fetch(HOST_API + "/todo", {
      method: "POST",//Indica que es un POST
      body: JSON.stringify(request),//Y que envia en el body un JSON
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())//Transforma la promesa en un JSON
      .then((element) => {
        dispatch({
          type: 'add-item',
          item: element
        });
        setState({
          name: ""
        });
        formRef.current.reset();
      });
  }

  return(
    <form ref={formRef}>
      <input
        type="text"
        name='name'
        onChange={(event)=>{
          setState({...state, name: event.target.value})
        }}
      ></input>
      <button onClick={onAdd}>Agregar</button>
    </form>
  )
}

const List = () => {
  //Hooks
  const { dispatch, state } = useContext(Store);//El Store es para guardar los estados internos de la app

  //El useEffect nos permite trabajar sin afectar el Render
  useEffect(()=> {
    fetch(HOST_API + "/todos")//Consulta la url (EndPoint) y devuelve una promesa
    .then(response => response.json())//Transforma la promesa recibida en un JSON
    .then((list)=> {//Despues actualiza el dispatch dependiendo del tipo de la accion
      dispatch({type: "update-list", list})
    })
  }, [state.list.length, dispatch]);//Tienen que existir tanto el 'state.list' como el 'dispatch'

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
                <tr key={element.id}>
                  <td>{element.id}</td>
                  <td>{element.name}</td>
                  <td>{element.isCompleted}</td>
                </tr>
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
        <Form />
        <List />
      </StoreProvider>
  );
}

export default App;
