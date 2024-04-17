class UserController {

    constructor(formIdCreate, formIdUpdate, tableId) {

        this.formEl = document.getElementById(formIdCreate); // form: form-user-create
        this.formUpdateEl = document.getElementById(formIdUpdate); // form: form-user-create
        this.tableEl = document.getElementById(tableId); // table: table-users

        this.onSubmit();
        this.onEdit();
        this.selectAll();

    }


    onEdit() {

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {

            this.showPanelCreate();

        });

        this.formUpdateEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);  // retorna todos los datos del usuario

            let index = this.formUpdateEl.dataset.trIndex; // tomo el usuario que quiero actualizar

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user); // verificar si esta modificando la imagen

            let result = Object.assign({}, userOld, values); // sistituye la imagen, assign perdio la instancia

            this.showPanelCreate(); 

            this.getPhoto(this.formUpdateEl).then(
                (content) => {  // Promise

                    if (!values.photo) {
                        result._photo = userOld._photo; // asigna la modificacion de imagen al img
                    } else {
                        result._photo = content;
                    }

                    let user = new User();

                    user.loadFromJSON(result);

                    user.save();

                    this.getTr(user, tr);
        
                    this.updateCount();

                    this.formUpdateEl.reset();

                    btn.disabled = false;

                },
                (e) => {

                    console.error(e);

                }
            );

        });

    }


    onSubmit() {

        this.formEl.addEventListener("submit", event => {

            event.preventDefault(); // SPA

            let btn = this.formEl.querySelector("[type=submit]"); // bloquear el boton

            btn.disabled = true;

            let values = this.getValues(this.formEl);   

            values.photo = ""; // leer contenido de la foto

            if (!values) return false;
            
            this.getPhoto(this.formEl).then(
                (content) => {  // Promise

                    values.photo = content;

                    values.save();

                    this.addLine(values);

                    this.formEl.reset();

                    btn.disabled = false;

                },
                (e) => {

                    console.error(e);

                }
            );
        
        });

    }


    getPhoto(formEl) {

        return new Promise((resolve, reject) => {  // Promise

            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item => {
    
                if (item.name === 'photo') {
                    return item;
                };
    
            });
    
            let file =   elements[0].files[0];
            
            fileReader.onload = () => {
    
                resolve(fileReader.result); 
    
            };

            fileReader.onerror = (e) => {

                reject(e);

            }
    
            if (file) { // verificando si existe archivo anhadido de imagen
                fileReader.readAsDataURL(file); // callback
            } else {
                resolve('dist/img/boxed-bg.jpg'); // mantiene imagen obligatorio sino reject
            }

        });

        

    }


    getValues(formEl) {

        let user = {};
        let isValid = true;

        [...formEl.elements].forEach((field, index) => { // ... agrega items que tenga el arreglo SPREAD

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {

                field.parentElement.classList.add('has-error'); 

                isValid = false;

            }
            
            if (field.name == "gender") {
        
                if (field.checked) {
                    user[field.name] = field.value;
                }
        
            } else if (field.name == "admin") {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        
        });

        if (!isValid) {

            return false;

        }

        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.email, 
            user.country, 
            user.password, 
            user.photo, 
            user.admin
        );

    }


    selectAll() {

        let users = this.getUsersStorage();

        users.forEach(dataUser => {

            let user  = new User();

            user.loadFromJSON(dataUser);

            this.addLine(user);

        });

    }


    addLine(dataUser) {   // dataUser = user

        let tr = this.getTr(dataUser);

        this.tableEl.appendChild(tr); // adiciona el tr dentro de la tabla

        this.updateCount();
        
    }


    getTr(dataUser, tr = null) { // si tr no pasa es nulo
    
        if (tr === null) tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser); // serializar: convierte el objeto en su atributo inicial (array)
    
        tr.innerHTML = `
            <td>
                <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm">
            </td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;
        
        this.addEventsTR(tr);

        return tr;    

    }


    showPanelCreate() {

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";

    }

    
    showPanelUpdate() {

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    }


    addEventsTR(tr) {

        tr.querySelector(".btn-delete").addEventListener("click", e => { // localiza boton de exluir

            if (confirm("Deseja realmente exluir?")) {

                let user = new User();

                user.loadFromJSON(JSON.pasrse(tr.dataset.User));

                user.remove();

                tr.remove();

                this.updateCount();

            }

        });

        tr.querySelector(".btn-edit").addEventListener("click", e => { // localiza boton de editar

            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex; // grabar la ubicacion del usuario para actualizar

            for (let name in json) {

                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {

                    if(field.type == 'file') continue;

                    switch (field.filter) {

                        case 'file':
                            continue;
                            break;
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];

                    }

                }

            }

            this.formUpdateEl.querySelector(".photo").src = json._photo; //localizar la clase photo y anhadir la imagen



            this.showPanelUpdate();

        });

    }

    
    // actualizar informacion de cantidad de usuarios
    updateCount() {

    let numberUsers = 0;
    let numberAdmin = 0;

    [...this.tableEl.children].forEach(tr => {

        numberUsers++;

        let user = JSON.parse(tr.dataset.user); // serializar invert

        if (user._admin) numberAdmin++;

    });

    document.querySelector("#number-users").innerHTML = numberUsers;
    document.querySelector("#number-users-admin").innerHTML = numberAdmin;

    }

}