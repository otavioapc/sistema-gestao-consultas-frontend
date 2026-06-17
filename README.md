# VestaPlan Web Panel 🎨🦷

Rico em design de interface e componentização, o **VestaPlan** é o painel de controle front-end desenvolvido em **Angular** para consumo da API clínica. A aplicação oferece uma experiência Single Page Application (SPA) fluida, reativa e totalmente integrada com políticas de segurança.

---

## 🛠️ Tecnologias e Recursos Front-End
* **Angular 19+** (Aproveitando componentes `standalone` e a nova sintaxe de fluxo de controle `@for` / `@if`)
* **TypeScript** (Tipagem forte para contratos de dados e interfaces)
* **Bootstrap 5 & Bootstrap Icons** (Visual moderno, limpo e responsivo)
* **Reactive Forms & FormBuilder** (Formulários reativos estruturados com validações assíncronas em tempo real)
* **RxJS** (Gerenciamento de fluxos de dados assíncronos via Observables)

---

## 🧠 Recursos e Fluxos de Destaque

### 1. Interceptador de Segurança HTTP (`auth.interceptor.ts`)
A aplicação conta com um interceptador global. Sempre que uma requisição HTTP é disparada para o backend, o interceptador captura automaticamente o token armazenado no `localStorage` e o injeta no cabeçalho da requisição (`Authorization: Bearer <token>`), eliminando a necessidade de tratar a segurança manualmente em cada componente.

### 🎭 2. Formulários Inteligentes e Máscaras Dinâmicas
* Validações visuais intuitivas que alertam o usuário antes do envio de payloads incompletos ou incorretos (ex: tamanho mínimo de strings, campos obrigatórios e formatos de e-mail).
* Utilitários utilitários de tratamento de texto (`TextoUtils`) que formatam dinamicamente strings complexas vindas brutas do banco de dados (ex: formatação de CPFs no padrão `000.000.000-00` em tempo real na listagem).

### 🔄 3. Sincronização Automática de Modais (CRUD)
Arquitetura reativa baseada em eventos onde a tabela de dados realiza um re-fetch automático (`carregarTodosOsDados()`) imediatamente após o encerramento bem-sucedido de um modal de cadastro ou edição, mantendo o estado da tela sempre atualizado com o banco sem necessidade de recarregar a página (`F5`).

---

## 📁 Estrutura de Diretórios Essenciais
* `/src/app/core/services`: Contém os serviços de comunicação HTTP (`AuthService`, `ConsultaService`, `PacienteService`, `DentistaService`, `UsuarioService`).
* `/src/app/paginas`: Componentes de visualização de tela (`ConsultasComponent`, `UsuariosComponent`, etc.).
* `/src/app/shared/utils`: Classes utilitárias compartilhadas, como formatadores de Strings.