import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';

//Path con la direccion de la API que tenemos en el BackEnd
const HOST_API = "http://localhost:8080/api";
//Estados iniciales para el Store
const initialState = {
  list: [],
  item: {}
};

//Para utilizar el Store hay que delimitarlo como un contexto
const Store = createContext(initialState);

const Form = () =>{
  //Hooks
  //Nos permite identificar las propiedades de un componente en espesifico
  //En este caso la referencia es la del formulario (form)
  //Se inicializa en nulo y el se crea (o inicializa) cuando el componente es montado
  const formRef = useRef(null);
  //useContext --> nos da un estado externo, Se modifico para agregarle el estado local (state{item})
  const { dispatch, state: {item} } = useContext(Store);//El Store es para guardar los estados internos de la app
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

  //Metodo para poder agregar la lista
  const onEdit = (event) =>{
    event.preventDefault();

    //Respuesta --> lo que va a ser enviado en el body como un JSON
    const request = {
      name: state.name,
      id: item.id,
      isCompleted: item.isCompleted
    };

    //El featch se conecta al path de la url
    fetch(HOST_API + "/todo", {
      method: "PUT",//Indica que es un PUT
      body: JSON.stringify(request),//Y que envia en el body un JSON
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())//Transforma la promesa en un JSON
      .then((element) => {
        dispatch({
          type: 'update-item',
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
        defaultValue={item.name}
        onChange={(event)=>{
          setState({...state, name: event.target.value})
        }}
      ></input>
      {
        item.id && <button onClick={onEdit}>Editar</button>
      }
      {
        !item.id && <button onClick={onAdd}>Agregar</button>
      }
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

  //para eliminar un item de la lista
  const onDelete = (id) => {
    //El featch se conecta al path de la url
    fetch(HOST_API + "/" + id + "/todo", {
      method: "DELETE"//Indica que es un DELETE
    })
      .then((list) => {
        dispatch({type: 'delete-item', id})
      })
  };

  //para editar un item de la lista
  const onEdit = (element) => {
    dispatch({type: 'edit-item', item: element})
  };

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
                  <td>{element.isCompleted === true ? "Si" : "No"}</td>
                  <td>
                    <button onClick={()=> onDelete(element.id)}> Eliminar </button>
                    <button onClick={()=> onEdit(element)}> Editar </button>
                  </td>
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
    //Se le agrego el actualizar el item al reducer
    case 'update-item':{
      const listUpdateEdit = state.list.map((element) => {
        if(element.id === action.item.id){
          return action.item;
        }
        return element;
      });
      return {...state, list: listUpdateEdit, element: {}}
    }
    //Se le agrego el eliminar al reducer
    case 'delete-item':{
      const listUpdate = state.list.filter((element) => {
        return element.id !== action.id;
      });
      return {...state, list: listUpdate}
    }
    case 'update-list':{
      return {...state, list: action.list};
    }
    //Se le agrego el editar item al reducer
    case 'edit-item':{
      return {...state, item: action.item};
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
