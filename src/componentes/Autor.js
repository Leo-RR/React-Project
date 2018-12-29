import React, { Component } from 'react';
import InputCustomizado from './InputCustomizado.js';
import BotaoSubmitCustomizado from './BotaoSubmitCustomizado.js';
import PubSub from 'pubsub-js';
import TratadorErros from '../TratadorErros.js';
import $ from 'jquery';

class FormularioAutor extends Component{

    constructor(){
        super();
        this.state = {
            nome: '',
            email: '',
            senha: '' 
        };

        this.enviaForm = this.enviaForm.bind(this);
    }

    atualizaCampo(input, event){
        let obj = {};
        obj[input] = event.target.value;
        this.setState(obj);
    }

    enviaForm(event){
        event.preventDefault();

        // let _this = this;
        
        console.log(this.state);

        $.ajax({
          url: 'https://cdc-react.herokuapp.com/api/autores',
          contentType: 'application/json',
          dataType: 'json',
          type: 'post',
          data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
          success: function(response){
            // this.setState({lista: response.slice(5090, response.length)})
            PubSub.publish('atualiza-listagem-autores', response.slice(5440, response.length));
          },
          error: function(response){
            console.log(response);
            if (response.status === 400){
               new TratadorErros().publicaErros(response.responseJSON); 
            }

          },
          beforeSend: function(){
              PubSub.publish('limpa-erros', {});
          }
        });
    }

    render(){

        return(

            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.atualizaCampo.bind(this, 'nome')} label="Nome"/>
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.atualizaCampo.bind(this, 'email')} label="Email"/>
                    <InputCustomizado id="Senha" type="password" name="senha" value={this.state.senha} onChange={this.atualizaCampo.bind(this, 'senha')} label="Senha"/>
                    <BotaoSubmitCustomizado label="Gravar"/>
                </form>             
            </div>
        );
    }
}

class TabelaAutores extends Component{

    render(){

        return(

            <div>            
                <table className="pure-table">
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.lista.map(autor => {
                            return(
                                <tr key={autor.id}>
                                <td>{autor.nome}</td>
                                <td>{autor.email}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table> 
            </div>     
        );
    }
}

export default class AutorBox extends Component{

   constructor(){
        super();

        this.state = {lista : []};
        // this.atualizaListagem = this.atualizaListagem.bind(this);
    }

    componentDidMount(){
        let _this = this;
        
        fetch('https://cdc-react.herokuapp.com/api/autores')
        .then(res => res.json())
        .then(res => {
            _this.setState({lista: res.slice(0,8)})
        })
        .catch(err => console.log(err));

        PubSub.subscribe('atualiza-listagem-autores', function(topico, data){

            this.setState({lista : data});
        }.bind(this));
    }

    // atualizaListagem(novaLista){

    //     this.setState({lista : novaLista.slice(5110, novaLista.length)});
    // }

    render(){

        return(
            <div>
                <div className="header">
                <h1>Cadastro de autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor/>
                    <TabelaAutores lista={this.state.lista}/>
                </div>
            </div>
        );
    }
}