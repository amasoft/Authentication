/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - firstName
 *         - lastName
 *         - phoneNumber
 *         - password
 *         - code
 *       properties:
 *          id:
 *            type: string
 *            description: the Auto generated id of the user
 *          email:
 *            type: string
 *            description: the user email addresss
 *          firstName:
 *            type: string
 *            description: the user firstname
 *          lastName:
 *            type: string
 *            description: the user lastName
 *          phoneNumber:
 *            type: string
 *            description: the user phoneNumber
 *
 */

/**
 * @swagger
 * /api/v1/signup:
 *   post:
 *     summary: User creates Account
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             items:
 *               document:
 *                 type: string
 *                 #ref:'#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Document authenticated successfully
 *       '400':
 *         description: Bad request
 *       '409':
 *         description: user Already exist
 */

//login

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: User logins
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             items:
 *               document:
 *                 type: string
 *                 #ref:'#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Document authenticated successfully
 *       '400':
 *         description: Bad request
 *       '409':
 *         description: user Already exist
 */

//verify Email
/**
 * @swagger
 * /api/v1/verifyemail/{verifycode}:
 *   get:
 *     summary: verify User Email
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: verifycode
 *         required: true
 *         schema:
 *           type: string
 *           items:
 *             document:
 *               type: string
 *               #ref:'#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Email verified successfully
 *       '400':
 *         description: Bad request
 *       '409':
 *         description: user Already exist
 */

//Reset password

/**
 * @swagger
 * /api/v1/restcode:
 *   post:
 *     summary: for code rest
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             items:
 *               document:
 *                 type: string
 *                 #ref:'#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Document authenticated successfully
 *       '400':
 *         description: Bad request
 *       '409':
 *         description: user Already exist
 */
