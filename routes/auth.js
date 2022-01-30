const { Router } = require('express');
const { check } = require('express-validator');
const { registerUsuario, loginUsuario, tokenUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJwt } = require('../middleware/validar-jwt');
const router = Router();


// Crear un nuevo usuario
router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'Password debe de tener minimo 6 caracteres').isLength({ min: 6}),
    validarCampos
], registerUsuario );

// Login del usuario
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'Password debe de tener minimo 6 caracteres').isLength({ min: 6}),
    validarCampos
], loginUsuario ); 

// Validar y revalidar Token
router.get('/renew', [validarJwt], tokenUsuario );


module.exports = router;