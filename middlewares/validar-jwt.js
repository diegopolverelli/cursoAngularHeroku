const { response } = require('express')
const jwt=require('jsonwebtoken')


const validarJWT=(req, res=response, next)=>{

    const token=req.header('x-token');
    // console.log(token);

    if (!token){
        // console.log('salio x aca');
        return res.status(401).json({
            ok: false,
            msg: 'Error en token'
        })
    }

    try{

        // la función jwt.verfy chequea el token vs la palabra secreta.
        // Si da OK devuelve el payload; lo ataco con desestructuración
        // y me quedo solo con el uid y el name
        const {uid, name}=jwt.verify(token, process.env.SECRET_JWT_SEED);
  
        // acá estoy en el middleware, pero tengo que enviar
        // el uid y el name al controlador; 
        // Entonces tomo la req, y le paso eso. 
        // Luego lo levando desde el controlador

        // console.log(email);

        req.uid=uid;
        req.name=name;

    }catch(error){

        console.log(error);

        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    // todo OK
    next();

}




module.exports={
    validarJWT
}