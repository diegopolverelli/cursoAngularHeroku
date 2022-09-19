// los middlewares son simplemente funciones;
// solo ver que haga el next (función que se ejecuta)
// si todo está OK, y que indica que se debe continuar
// la ejecución 

const { response } = require("express");
const {validationResult} = require('express-validator')


const validarCampos=(req, res=response, next)=>{
    const errors= validationResult( req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    next();
}



module.exports={
    validarCampos
}








