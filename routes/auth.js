const {Router} =require('express');
const { check } = require('express-validator');
const {crearUsuario, loginUsuario, revalidarToken} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router= Router();

// Crear un nuevo usuario
router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria y tiene que tener al menos 6 caracteres').isLength({min: 6}),
    validarCampos
], crearUsuario);

// Login de usuario
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria, y tiene que tener 6 caracteres').isLength({min: 6}),
    validarCampos
], loginUsuario);
//(el primer argumento del .post es la ruta, el 
//segundo si solo hay 2 argumentos, es el controlador... que
// es la función que se ejecuta en esa ruta; y si hay 3 argumentos, el 
// arg 2 es un middleware o arreglo de middlewares, y el 
// tercero el controlador)



// Validar y revalidar usuario
router.get('/renew', validarJWT, revalidarToken);







module.exports = router;



