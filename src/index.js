import express, { query } from 'express'

const app = express()

app.get('/saludo', (req, res)=>{ // dos parametros en los () el path y el callback

    //res.send('<h1> desde express  desde el endpoint saludo </h1>')
    res.json({"Mensaje":"hola", "otro Mensaje" :"hola" })

})    


app.get('/alumnos/:idAlumno', (req, res)=>{    // :idalumno es lo que entra por parametro cuando se hace peticion /alumno/pedro (pedro se captura)
    console.log(req.params)   // params en un objeto vacio que se llena con lo que captura
    res.send(`Buenas noches ${req.params.idAlumno}` )

})

// varios parametros
app.get('/producto/:id/:color', (req, res)=>{  
    
    const {id, color} = req.params    // deconstruccion de un objeto
    console.log(req.params)   
    res.send(`producto ${id} color ${color}` )
})

app.listen(8080, ()=>{console.log('servidor levantado en 8080')})

//Query params   (mejor)   http://localhost:8080/productos?carro=verde&lapiz=azul

app.get('/productos/', (req, res)=>{  
    
    const query = req.query    
    console.log(query)   
    res.send(query)
})


// elejir un objeto     http://localhost:8080/estudiante?id=1

// Objetos
const a1 = {
    nombre: "juan jose",
    edad: 8,
    grado: 6,
};

const a2 = {
    nombre: "maria jose",
    edad: 9,
    grado: 7,
};

// Endpoint para obtener el estudiante según el id
app.get('/estudiante/', (req, res) => {
    const { id } = req.query; // Extraer 'id' de los parámetros de consulta

    // Seleccionar el objeto según el id
    let selectedObject;
    if (id === '1') {
        selectedObject = a1;
    } else if (id === '2') {
        selectedObject = a2;
    } else {
        selectedObject = { error: "ID no válido. Usa id=1 o id=2" }; // Mensaje de error si no coincide
    }

    // Enviar la respuesta
    console.log(selectedObject) 
    res.json(selectedObject);
});