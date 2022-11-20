export default class UserController {
    constructor({ userService, validationResult }) {
        this.userService = userService;
        this.validationResult = validationResult;

        this.createUser = this.createUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.getUser = this.getUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    async createUser(req, res) {
        //check if errors in validation
        const errors = this.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password, password2 } = req.body;

        try {
            //check if user exists
            const queryResult = await this.userService.userExists(email);
            if (queryResult.length > 0) {
                return res.status(400).json({ errors: [{ msg: 'Email already registered' }] });
            }
            //check if password and password2 are the same
            if (password !== password2) {
                return res.status(400).json({ errors: [{ msg: 'Passwords do not match' }] });
            }
            //Encrypt password
            const passwordEncrypted = await this.userService.encryptPassword(password);
            //Get users gravatar
            const avatar = await this.userService.getGravatar(email);
            //Add user to database
            await this.userService.addUser(name, email, avatar, passwordEncrypted);
            //Return jsonwebtoken
            const token = this.userService.generateToken(email);
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: `Server error, ${error.message}` }] });
        }
    }

    async loginUser(req, res) {
        //check if errors in validation
        const errors = this.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        try {
            //check if user exists
            const queryResult = await this.userService.userExists(email);
            if (queryResult.length == 0) {
                return res.status(401).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            //check if password is correct
            const isMatch = await this.userService.comparePassword(
                password,
                queryResult[0].password
            );
            if (!isMatch) {
                return res.status(401).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }
            //Return jsonwebtoken

            const token = this.userService.generateToken(queryResult[0].email);
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: `Server error, ${error.message}` }] });
        }
    }

    async getUser(req, res) {
        try {
            const email = req.user.id;
            const user = await this.userService.getUser(email);
            res.status(200).json({ user: user[0] });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: `Server error, ${error.message}` }] });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            await this.userService.deleteUserById(id);

            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: `Server error, ${error.message}` }] });
        }
    }
}
