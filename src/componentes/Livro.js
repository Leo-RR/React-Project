import React, { Component } from 'react'
import InputCustomizado from './InputCustomizado';
import BotaoSubmitCustomizado from './BotaoSubmitCustomizado';
import PubSub from 'pubsub-js';
import $ from 'jquery';
import TratadorErros from '../TratadorErros';

class FormularioLivro extends Component{

    constructor(){
        super();
        this.state = {
            autorId: '',
            titulo: '',
            preco: ''
        };

        this.setAutorId = this.setAutorId.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.enviaForm = this.enviaForm.bind(this);
    }

    setAutorId(event){
        this.setState({autorId: event.target.value});
    }

    setTitulo(event){
        this.setState({titulo: event.target.value});
    }

    setPreco(event){
        this.setState({preco: event.target.value});
    }

    enviaForm(event){
        event.preventDefault();
            
        $.ajax({
            url: 'https://cdc-react.herokuapp.com/api/livros',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({autorId: this.state.autorId, titulo: this.state.titulo, preco: this.state.preco}),
            success: function(response){
                // this.setState({livros: response.slice(450, response.length)})
                PubSub.publish('atualiza-listagem-livros', response.slice(450, response.length));
            },
            error: function(response){
                console.log(response);
                if (response.status === 400){

                    if (response.field === "autorId"){
                        //Tratar erro do combo vazio
                    }
                    new TratadorErros().publicaErros(response.responseJSON); 
                }
            },
            beforeSend: function(){
                PubSub.publish('limpa-erros', {});
            }
        })
    }

    render(){

        return(

            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <div className="pure-control-group">
                        <label>ID Autor</label>
                        <select value={this.state.autorId} onChange={this.setAutorId}>
                            <option value="">Selecione</option>
                            {
                                this.props.autores.map(autor => {
                                    return <option key={autor.id} value={autor.id}>{autor.nome}</option>
                                })
                            }
                        </select>
                        <span className="error"></span>
                    </div>
                    <InputCustomizado id="titulo" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Título"/>
                    <InputCustomizado id="preco" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preço"/>
                    <BotaoSubmitCustomizado label="Enviar"/>
                </form>
            </div>
        );
    }
}

class TabelaLivro extends Component{

    render(){

        return(
         
            <table className="pure-table">
                <thead>
                <tr>
                    <th>autor</th>
                    <th>preço</th>
                    <th>título</th>
                </tr>
                </thead>
                <tbody>
                    {
                        this.props.livros.map(livro => {
                            return(
                                <tr key={livro.id}>
                                <td>{livro.autor.nome}</td>
                                <td>{livro.preco}</td>
                                <td>{livro.titulo}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>       
        );
    }
}

export default class LivroBox extends Component{

    constructor(){
        super();
        this.state = {livros: [], autores: []};
    }

    componentDidMount(){
        let _this = this;

        fetch('https://cdc-react.herokuapp.com/api/livros')
        .then(res => res.json())
        .then(res => _this.setState({livros: res.slice(450, res.length)}))
        .catch(err => console.log(err));

        fetch('https://cdc-react.herokuapp.com/api/autores')
        .then(res => res.json())
        .then(res => _this.setState({autores: res.slice(5350, res.length)}))
        .catch(err => console.log(err));

        PubSub.subscribe('atualiza-listagem-livros', function(topico, lista){
            this.setState({livros: lista});
        }.bind(this));
    }

    render(){

        return(
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores}/>
                    <TabelaLivro livros={this.state.livros}/>
                </div>
            </div>
        );
    }
}