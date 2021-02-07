import axios from 'axios';
import api from './api';

class App {
    constructor() {

        document.getElementById('logar').onclick = () => this.logar()
        document.getElementById('registrar').onclick = () => this.registrar();
        this.token = "";
        this.user_uid = "";

        this.manipularDom();
        this.logout();

    }

    manipularDom() {

        document.getElementById('criar').onclick = () => {
            document.getElementById('tela1').style.display = 'none';
            document.getElementById('tela2').style.display = 'flex';
        }
        document.getElementById('voltarTela').onclick = () => {
            document.getElementById('tela1').style.display = 'flex';
            document.getElementById('tela2').style.display = 'none';
        }


    }

    logar() {
        const username = document.getElementById('usuario').value;
        const password = document.getElementById('senha').value;
        api.post('/login', {
            "username": username,
            "password": password
        }).then(r => {
            const { success, token } = r.data;


            if (success) {
                this.token = token;
                this.user_uid = r.data.user.uid
                this.buscaGrowdevers();
                alert(this.user_uid)
                this.addGrowdever();


            }

            document.getElementById('tela1').style.display = 'none';
            document.getElementById('app').style.display = 'flex';
        })
            .catch(e => alert('Usuário ou senha invalidos'));
    }

    buscaGrowdevers() {
        api.getAutenticado('/growdevers', this.token)
            .then(r => {

                let html = "";
                r.data.growdevers.forEach((gd) => {
                    html += `
                <tr>
                    <td>${gd.user.name}</td>
                    <td>${gd.email}</td>
                </tr>`

                })

                document.getElementById('listaGrowdevers').innerHTML += html
            });
    }
    /////// Mudanças no Adicionar growdevers (nao funcionaram da maneira que eu pensava que iria..)
    addGrowdever() {
      /*
        const registrarEmailGd = document.getElementById('registrarEmailGd');
        const registrarTelefoneGd = document.getElementById('registrarSenhaGd');
        const registrarProgramaGd = document.getElementById('registrarProgramaGd');
        const registrarIdGd = document.getElementById('registrarIdGd');
    */
        document.getElementById('addNewGrowDever').onclick = () => {
            api.postAutenticado(`/growdevers`, {
                "email": registrarEmailGd.value,
                "phone": registrarTelefoneGd.value,
                "program": registrarProgramaGd.value,
                "user_uid": this.user_uid

            }, this.token)

                .then(r => {
                    console.log(r.data)
                })
        }


    }
    

    registrar() {
        const cargo = document.getElementById('select').value;
        const nome = document.getElementById('nome').value;
        const criarUsuario = document.getElementById('criarUsuario').value
        const criarSenha = document.getElementById('criarSenha').value

        document.getElementById('registrar').onclick = () => {
            api.post('/users', {
                "name": nome,
                "password": criarSenha,
                "type": cargo,
                "username": criarUsuario
            })
                .then(r => {
                    alert('Conta criada com sucesso.')
                    document.getElementById('tela2').style.display = 'none';
                    document.getElementById('tela1').style.display = 'flex';
                })
                .catch(e => alert('Usuário ja existente'))

        }
    }

    logout() {
        document.getElementById('logout').onclick = () => {
            document.getElementById('tela1').style.display = 'flex';
            document.getElementById('app').style.display = 'none';

        }
    }
}
new App();