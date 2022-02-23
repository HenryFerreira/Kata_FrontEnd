import React, { createContext, useContext } from 'react';

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

function App() {
  return (
    <div>
      
    </div>
  );
}

export default App;
