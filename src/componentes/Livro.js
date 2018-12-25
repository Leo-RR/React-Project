import React, { Component } from 'react'
import InputCustomizado from './InputCustomizado';
import BotaoSubmitCustomizado from './BotaoSubmitCustomizado';

export default class Livro extends Component{

    constructor(){
        super();
        this.state = {livros: []};
    }

    componentDidMount(){
        let _this = this;

        fetch('https://cdc-react.herokuapp.com/api/livros')
        .then(res => res.json())
        .then(res => {
            _this.setState({livros: res.slice(450, res.length)});
        })
        .catch(err => console.log(err));
    }

    render(){

        return(

            <div>
                <div className="header">
                <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <div className="pure-form pure-form-aligned">
                        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                            <InputCustomizado type="text" id="titulo" name="titulo" label="Titulo"/>
                            <InputCustomizado type="text" id="preco" name="preco" label="Preço"/>
                            <BotaoSubmitCustomizado label="Enviar"/>
                        </form>
                    </div>
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
                                this.state.livros.map(livro => {
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
                </div>
            </div>
                
        );
    }
} 