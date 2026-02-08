# 🍕 Pizzaria - Sistema Completo Full Stack

Um sistema completo de pizzaria desenvolvido com **Angular 19** no frontend e **.NET 9** no backend.

## 📋 Funcionalidades

### 🏠 Página Home
- Logotipo e apresentação da pizzaria
- Menu lateral com opções: Sobre empresa, Cardápio, Pedidos
- Menu superior direito: Login ou Cadastrar-se
- Redirecionamento para área do cliente após cadastro/login

### 👤 Autenticação
- **Cadastro**: Novo usuário com nome, email e senha
- **Login**: Autenticação com email e senha
- **Perfil**: Editar dados pessoais e gerenciar endereços de entrega

### 🍕 Cardápio
- Lista completa de pizzas com:
  - Nome, descrição, preço
  - Categorias (Salgada, Doce, Especial)
  - Imagens
- Carrinho de compras
- Adicionar/remover itens

### 🛒 Pedidos
- Histórico de pedidos com status
- Criar novo pedido
- Acompanhar status: Pendente, Confirmado, Em Preparo, Saiu para Entrega, Entregue
- Cancelar pedidos (apenas os pendentes)

### 📍 Endereços
- Gerenciar múltiplos endereços de entrega
- Editar informações de endereço
- Deletar endereços

### ℹ️ Sobre Empresa
- Informações sobre a pizzaria
- Missão, valores e história
- Contato

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Angular 19** - Framework frontend moderno
- **TypeScript** - Linguagem de programação
- **Signals** - State management do Angular
- **CSS3** - Estilização responsiva
- **Routing** - Navegação entre páginas

### Backend
- **.NET 9** - Framework backend
- **C#** - Linguagem de programação
- **Entity Framework Core** - ORM para banco de dados
- **SQLite** - Banco de dados
- **RESTful API** - Padrão de API

---

## 📁 Estrutura do Projeto

```
Pizzaria/
├── PizzariaApi/                 # Backend .NET
│   ├── Controllers/             # Controladores da API
│   │   ├── UsuarioController.cs
│   │   ├── PizzaController.cs
│   │   ├── PedidoController.cs
│   │   └── EnderecoController.cs
│   ├── Models/                  # Modelos de dados
│   │   ├── Usuario.cs
│   │   ├── Pizza.cs
│   │   ├── Pedido.cs
│   │   ├── ItemPedido.cs
│   │   └── Endereco.cs
│   ├── Data/                    # Contexto do banco de dados
│   │   └── AppDbContext.cs
│   ├── Migrations/              # Migrações do EF Core
│   ├── Program.cs               # Configuração da aplicação
│   └── appsettings.json         # Configurações
│
└── PizzariaFront/               # Frontend Angular
    ├── src/
    │   ├── app/
    │   │   ├── components/      # Componentes reutilizáveis
    │   │   │   ├── home/
    │   │   │   ├── login/
    │   │   │   ├── cardapio/
    │   │   │   ├── pedidos/
    │   │   │   ├── perfil/
    │   │   │   ├── sobre/
    │   │   │   ├── navbar/
    │   │   │   └── usuario-form/
    │   │   ├── models/          # Interfaces de dados
    │   │   ├── services/        # Serviços HTTP
    │   │   ├── app.routes.ts    # Rotas da aplicação
    │   │   ├── app.ts           # Componente raiz
    │   │   └── app.html         # Template raiz
    │   └── index.html           # HTML principal
    └── angular.json             # Configuração Angular
```

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v18+)
- .NET 9 SDK
- npm ou yarn

### Backend (.NET)

1. **Navegar para a pasta do projeto**
   ```bash
   cd PizzariaApi
   ```

2. **Restaurar dependências**
   ```bash
   dotnet restore
   ```

3. **Aplicar migrations (criar banco de dados)**
   ```bash
   dotnet ef database update
   ```

4. **Executar a aplicação**
   ```bash
   dotnet run
   ```

   A API estará disponível em: `http://localhost:5000` ou `https://localhost:5001`

### Frontend (Angular)

1. **Navegar para a pasta do projeto**
   ```bash
   cd PizzariaFront
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Executar em desenvolvimento**
   ```bash
   npm start
   ```

   A aplicação será aberta em: `http://localhost:4200`

4. **Build para produção**
   ```bash
   npm run build
   ```

---

## 📊 Modelos de Dados

### Usuario
- `id`: Identificador único
- `nome`: Nome do usuário
- `email`: Email (única)
- `senha`: Senha (hasheada)
- `telefone`: Telefone
- `dataCadastro`: Data do cadastro

### Pizza
- `id`: Identificador único
- `nome`: Nome da pizza
- `descricao`: Descrição
- `preco`: Preço
- `categoria`: Categoria (Salgada, Doce, Especial)
- `imagem`: URL da imagem
- `ativo`: Status (ativo/inativo)

### Pedido
- `id`: Identificador único
- `usuarioId`: FK para Usuario
- `dataPedido`: Data do pedido
- `total`: Valor total
- `status`: Status do pedido
- `enderecoEntregaId`: FK para Endereco
- `observacoes`: Observações

### ItemPedido
- `id`: Identificador único
- `pedidoId`: FK para Pedido
- `pizzaId`: FK para Pizza
- `quantidade`: Quantidade
- `precoUnitario`: Preço unitário

### Endereco
- `id`: Identificador único
- `usuarioId`: FK para Usuario
- `rua`: Nome da rua
- `numero`: Número do endereço
- `bairro`: Bairro
- `cidade`: Cidade
- `estado`: Estado
- `cep`: CEP
- `complemento`: Complemento
- `principal`: Se é endereço principal

---

## 🔌 Endpoints da API

### Usuários
- `POST /api/usuario` - Criar novo usuário
- `GET /api/usuario/{id}` - Obter dados do usuário
- `PUT /api/usuario/{id}` - Atualizar usuário
- `POST /api/usuario/login` - Login (implementar)

### Pizzas
- `GET /api/pizza` - Listar todas as pizzas
- `GET /api/pizza/{id}` - Obter pizza por ID
- `GET /api/pizza/categoria/{categoria}` - Listar por categoria
- `POST /api/pizza` - Criar pizza (admin)
- `PUT /api/pizza/{id}` - Atualizar pizza (admin)
- `DELETE /api/pizza/{id}` - Deletar pizza (admin)

### Pedidos
- `GET /api/pedido/usuario/{usuarioId}` - Listar pedidos do usuário
- `GET /api/pedido/{id}` - Obter detalhes do pedido
- `POST /api/pedido` - Criar novo pedido
- `PUT /api/pedido/{id}/status` - Atualizar status
- `DELETE /api/pedido/{id}` - Cancelar pedido

### Endereços
- `GET /api/endereco/usuario/{usuarioId}` - Listar endereços
- `GET /api/endereco/{id}` - Obter endereço
- `POST /api/endereco` - Criar endereço
- `PUT /api/endereco/{id}` - Atualizar endereço
- `DELETE /api/endereco/{id}` - Deletar endereço

---

## 🔐 Segurança (Implementar)

- [ ] **JWT Authentication** - Autenticação com tokens JWT
- [ ] **Password Hashing** - Hash de senhas (bcrypt)
- [ ] **Route Guards** - Proteger rotas autenticadas
- [ ] **CORS** - Configuração correta de CORS
- [ ] **Validação** - Validação de input no backend
- [ ] **Rate Limiting** - Limitador de requisições

---

## 📝 Rotas Frontend

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | HomeComponent | Página inicial |
| `/login` | LoginComponent | Fazer login |
| `/cadastro` | UsuarioFormComponent | Criar conta |
| `/cardapio` | CardapioComponent | Ver cardápio |
| `/sobre` | SobreComponent | Sobre a empresa |
| `/pedidos` | PedidosComponent | Meus pedidos |
| `/perfil` | PerfilComponent | Editar perfil |

---

## 🎨 Paleta de Cores

- **Primária**: `#667eea` (Azul Roxo)
- **Secundária**: `#764ba2` (Roxo)
- **Destaque**: `#d32f2f` (Vermelho)
- **Fundo**: `#f9f9f9` (Branco/Cinza claro)
- **Texto**: `#333333` (Cinza escuro)

---

## 🐛 Próximos Passos / TODO

### Backend
- [ ] Implementar autenticação JWT
- [ ] Hash de senhas com bcrypt
- [ ] Validação de dados
- [ ] Tratamento de erros customizado
- [ ] Seeding de dados de exemplo
- [ ] Testes unitários

### Frontend
- [ ] Integração com API (HttpClient)
- [ ] Service de autenticação
- [ ] Route Guards
- [ ] Validação de formulários
- [ ] Tratamento de erros
- [ ] Testes unitários
- [ ] página de carrinho
- [ ] Checkout

### Geral
- [ ] Hospedagem
- [ ] CI/CD
- [ ] Documentação Swagger
- [ ] Docker containerização

---

## 📞 Contato

Desenvolvido com ❤️ para pizzarias que querem entrar no digital.

---

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente.

---

**Criado em:** Fevereiro de 2026  
**Última atualização:** 02/02/2026
