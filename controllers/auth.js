const {response} = require('express')
const Usuario = require('../models/Usuario')
const bcrypt= require('bcryptjs');
const {generarJWT}= require('../helpers/jwt')

// lo anterior es para mantener la ayuda (autocompletar), 
// en el archivo de rutas; lo que hago es hacerle llegar el 
// tipado. 
// De express tomo solo el response (con desestructuracion),
// y lo igual al res de la función. Así res toma el tipado

const crearUsuario = async(req, res = response)=>{

    // console.log(req.body);
    const {email, name, password} = req.body;
    // console.log(email, name, password);

    try{
    // verificar que no exista un correo igual en DB
        const usuario=await Usuario.findOne({email: email});

        if (usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }
    
    // Crear usuario con el modelo
        const dbUser=new Usuario( req.body);

    // Encriptar o Hashear la contraseña
        const salt=bcrypt.genSaltSync();
        dbUser.password=bcrypt.hashSync(password, salt);


    // Generar el Jason Web Token
        const token=await generarJWT(dbUser.id, name)


    // Crear usuario de DB
        await dbUser.save();

    // Generar respuesta exitosa
        return res.status(200).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            token

        });


    }catch (error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacte al administrador'
        })
    
    }
}

const loginUsuario = async(req, res= response)=>{

    const {email, password} = req.body;
    // console.log(email, name, password);

    try{

        const dbUser= await Usuario.findOne({email:email});

        // verificar que exista el usuario
        if(!dbUser){
            return res.status(400).json({
                ok:false,
                msg: 'El correo ingresado no existe'
            })
        }

        // confirmar password
        const validPassword= bcrypt.compareSync(password, dbUser.password);

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Password inválido'
            })

        }

        // Generar el JWT
        const token=await generarJWT(dbUser.id, dbUser.name)

        // Generar respuesta exitosa
        return res.status(200).json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email,
            token

        });



    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador'
        })
    }


}

const revalidarToken= async(req, res=response)=>{

    // tomo con desestructuración del req, los parámetros que 
    // guarde en el middleware validar-jwt; 
    // ese middleware se ejecuto en la definición de la
    // ruta, en routes\auth.js
    const {uid} = req;

    const dbUser=await Usuario.findById(uid);

    token=await generarJWT(uid, dbUser.name);

    return res.json({
        ok: true,
        // msg: 'renew',
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
//        token: req.header('x-token')
    })

}

module.exports={
    crearUsuario, 
    loginUsuario,
    revalidarToken
}




