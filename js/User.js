class User {

    constructor(name, gender, birth, country, email, password, photo, admin){

        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();

    }

    // propiedades privadas
    // CRUD
    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get gender() {
        return this._gender;
    }

    get birth() {
        return this._birth;
    }

    get country() {
        return this._country;
    }

    get email() {
        return this._country;
    }

    get password() {
        return this._password;
    }

    get photo() {
        return this._photo;
    }

    get admin() {
        return this._admin;
    }

    get register() {
        return this._register;
    }


    // consulta
    set photo(value) {
        this._photo = value;
    }


    // recibir los datos
    loadFromJSON(json) {
        for (let name in json) {

            switch (name){
                case '_register':
                    this[name] = new Date(json[name]);
                    break;
                default:
                    this[name] = json[name];
            }
        }
    }


    // editando informacion del localStorage
    static getUsersStorage() {

        let users = [];

        if (localStorage.getItem("users")) {

            users = JSON.parse(localStorage.getItem("users"));

        }

        return users;

    }


    getNewID() {

        let usersID = parseInt(localStorage.getItem("userID")); // se elimino un item del localStorage, el muda su id

        if (!usersID > 0) usersID = 0;

        usersID++;

        localStorage.setItem("usersID", usersID); // guardar el ultimo id que generamos

        return usersID;

    }


    save() {

        let users = User.getUsersStorage();

        if (this.Id > 0) { // llave unica para identificar usuario

            users.map(u => { // retorna los datos del item en el array

                if (u._id == this.id) {

                    Object.assign(u, this);

                }
                
                return u;

            });

        } else {

            this._id = this.getNewID();

            users.push(this);

        }

        //sessionStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("users", JSON.stringify(users)); // llave, valor

    }


    remove() {
        
        let users = User.getUsersStorage();

        users.foreEach((userData, index) => {

            if (this._id == userData._id) {

                users.splice(index, 1); // remover un item del array de localStorage

            }

        });

        //sessionStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("users", JSON.stringify(users)); // llave, valor

    }

}