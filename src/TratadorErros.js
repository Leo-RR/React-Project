import PubSub from 'pubsub-js';

export default class TratadorErros{

    publicaErros(erros){

        var i = 0;
        var tamanho = erros.errors.length;

        for(i; i < tamanho; i++) {
            var erro = erros.errors[i];
            PubSub.publish('erro-validacao', erro);
        }
    }
}