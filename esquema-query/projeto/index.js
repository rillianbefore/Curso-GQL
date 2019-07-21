const{ApolloServer,gql} = require('apollo-server')

//Array de objetos Usuarios
const usuarios = [{
    id: 1,
    nome: 'João da Silva',
    email: 'jsilva@email.com',
    idade: 29
},{
    id: 2,
    nome: 'Manoel da Luz',
    email: 'manoel@email.com',
    idade: 31
}
]
const typeDefs = gql`
    # As vezes é necessário retornar um tipo de dado que não faz parte dos 5 tipos basico do graphQl(Int, Float, Boolean, String, ID)
    # Nesse caso é possivel criar um scalar. Que nada mais é que um tipo definido pelo usuario
    scalar Date

    type Usuario {
        id: ID!
        nome: String!  # ! indica que é um atributo obrigatório
        email: String!
        idade: Int
        salario: Float
        vip: Boolean 
    }

    type Produto {
        id: ID!
        nome: String!
        preco: Float!
        desconto: Float
        precoComDesconto: Float       
    }

    # Pontos de entrada da API
    type Query{
        ola: String!
        horaAtual: Date!
        usuarioLogado: Usuario
        produtoEmDestaque: Produto
        numerosMegaSena: [Int!]!  # Obrigatoriamente estaremos retornando um array, q tem obrigatóriamente numeros inteiros
        usuarios: [Usuario!]!

        # passando parametros
        usuario(id: ID): Usuario  #consulta que recebe um parametro ID e retorna um objeto usuario
    }
`

const resolvers = {
    Usuario:{
        salario(usuario){
            return usuario.salario_real
        }
    },
    Produto:{
        precoComDesconto(produto){
            if(produto.desconto){
                return produto.preco * (1 - produto.desconto)
            }else{
                return produto.preco
            }
        }
    },
    Query: {
        ola(){
            return 'Retornar uma string'
        },
        horaAtual(){
            return new Date
            // return `${new Date().toDateString()}`            
            // return data
            // return `${new Date}`
        },
        usuarioLogado(){
            /* Aqui está o conceito da flexibilidade. Pois apartir deste ponto eu posso utilizar várias formas para obter os dados do usuario, 
            sejam: um consulta a um banco de dados, uma consulta a outra Api, um hardcode, etc. Respeitando a forma como foi definido o retorno
            do tipo usuario.*/
            return {
                id: 1,
                nome: 'Ana na web',
                email: 'anaWeb@email.com',
                idade: 23,
                salario_real: 1234.56,
                vip: true
            }

        },
        produtoEmDestaque(){
            return {
                id: 1,
                nome: 'Cerveja ',
                preco: 2.90,
                desconto: 0.05                               
            }
        },
        numerosMegaSena(){
            // return [4,8,12,27,60,56]
            const crescente = (a,b) => a - b 
            return Array(6).fill(0)
                    .map( n => parseInt(Math.random() * 60 + 1))
                    .sort(crescente)
        },
        usuarios(){
            return usuarios
        },
        usuario(_,{id}){
            const sels = usuarios.filter(u => u.id == id)
            return sels ? sels[0] : null
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Executando em ${url}`)
})