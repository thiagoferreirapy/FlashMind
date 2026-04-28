# Fliply — MVP Completo do Projeto

## 1. Nome e proposta

- **Nome:** Fliply
- **Tipo:** aplicativo/plataforma de flashcards inteligentes

O Fliply é uma plataforma de estudos baseada em flashcards, desenvolvida para ajudar o usuário a memorizar conteúdos de forma prática, rápida e progressiva.

A proposta do sistema é unir:

- organização de conteúdo
- revisão inteligente
- acompanhamento de desempenho
- estímulos externos ao aplicativo

Com isso, o processo de aprendizagem se torna mais eficiente e constante.

---

## 2. Problema que o projeto resolve

Muitos usuários têm dificuldade em manter uma rotina de revisão consistente. Entre os principais problemas observados:

- esquecimento frequente de estudar
- perda de tempo revisando conteúdos já dominados
- dificuldade para identificar quais temas apresentam maior erro
- ausência de estímulos externos para manter a frequência de estudo
- falta de organização do conteúdo por assunto ou objetivo

O Fliply foi concebido para resolver esses pontos por meio de:

- flashcards
- revisão adaptativa
- lembretes
- estatísticas de desempenho
- desafios automáticos
- compartilhamento de conteúdo

---

## 3. Público-alvo

O sistema é direcionado principalmente para:

- estudantes em geral
- concurseiros
- pessoas que estudam idiomas
- usuários que desejam memorizar conceitos técnicos
- pessoas que preferem sessões curtas e objetivas de estudo no celular

---

## 4. Objetivo do MVP

O objetivo do MVP é entregar uma versão funcional, consistente e escalável da plataforma, permitindo que o usuário:

- organize conteúdos em decks
- crie cards personalizados
- estude com frente e verso
- registre seu desempenho
- receba revisões com base em dificuldade
- acompanhe sua evolução
- configure lembretes e preferências
- receba desafios via WhatsApp
- compartilhe decks com outros usuários

---

## 5. Funcionalidades do MVP

### 5.1 Onboarding

Tela inicial de apresentação para introduzir a proposta da plataforma e conduzir o usuário ao início da experiência.

### 5.2 Cadastro e autenticação online

O sistema deverá permitir:

- criação de conta
- login
- logout
- recuperação de senha
- edição de perfil
- vinculação de número de WhatsApp

Essa funcionalidade é essencial para viabilizar:

- sincronização em nuvem
- compartilhamento de decks
- envio de notificações e desafios automáticos

### 5.3 Gerenciamento de decks

O usuário poderá:

- criar decks
- editar decks
- excluir decks
- definir nome, ícone, cor e descrição
- organizar conteúdos por disciplina, tema ou objetivo

Os decks serão a principal estrutura de organização do conteúdo estudado.

### 5.4 Gerenciamento de cards

Cada deck poderá conter vários cards, com possibilidade de:

- criar card
- editar card
- excluir card
- cadastrar frente e verso

Formato adotado: flashcard simples (sem alternativas), centrado em pergunta e resposta.

### 5.5 Estudo com flashcards

Fluxo principal:

- abrir um deck
- exibir a pergunta
- rotacionar o card
- exibir a resposta
- registrar a percepção do usuário sobre seu desempenho

Classificação da resposta:

- acertei
- quase
- errei

### 5.6 Revisão inteligente

A revisão inteligente será uma das principais funcionalidades do sistema.

Lógica baseada no comportamento do usuário durante os estudos:

- perguntas erradas reaparecem em intervalos menores
- perguntas marcadas como “quase” retornam em prazo intermediário
- perguntas frequentemente acertadas tornam-se menos recorrentes
- a dificuldade do card é recalculada a cada interação
- o sistema define automaticamente o melhor momento para a próxima revisão

### 5.7 Dashboard e estatísticas

Área de acompanhamento de desempenho com indicadores como:

- quantidade de cards estudados
- total de respostas corretas
- número de decks criados
- número de sessões realizadas
- taxa global de acerto
- atividade recente
- perguntas mais erradas
- perguntas mais fáceis
- cards com revisão próxima

Objetivo: permitir que o usuário visualize sua evolução e identifique os principais pontos de dificuldade.

### 5.8 Lembretes de estudo

O sistema permitirá o cadastro de lembretes para reforçar a rotina de estudos.

Tipos de lembretes:

- **a) Lembrete geral:** lembra o usuário de estudar, sem vínculo com um deck específico.
    - Exemplo: “Hora de estudar”
- **b) Lembrete por deck:** associado a um deck específico.
    - Exemplo: “Revisar Inglês Básico às 19h”
- **c) Lembrete por revisão pendente:** prioriza conteúdos que precisam reaparecer com maior urgência.
    - Exemplos de foco:
        - cards vencidos
        - cards difíceis
        - revisão do dia

Além disso, os lembretes poderão incluir:

- definição de horário
- frequência diária ou recorrente
- ativação e desativação
- escolha do canal de envio
- associação a notificações push ou desafios via WhatsApp

### 5.9 Configurações

A área de configurações permitirá ao usuário personalizar o comportamento do aplicativo, incluindo:

- meta diária de estudos
- tamanho da sessão
- ativação da ordem inteligente
- habilitação de desafios via WhatsApp
- definição de horário preferido
- cadastro do número de WhatsApp
- gerenciamento de notificações

### 5.10 Desafio pelo WhatsApp

Possibilidade de envio de desafios automáticos pelo WhatsApp.

Fluxo previsto:

- o usuário habilita o recebimento de desafios
- informa seu número
- define um horário preferido
- o backend agenda os envios
- o sistema envia uma pergunta
- o usuário revela a resposta
- o usuário informa se acertou, quase acertou ou errou
- a resposta atualiza a lógica de revisão do card

### 5.11 Notificações nativas em background

O MVP contará com notificações reais em background, permitindo:

- lembretes de estudo
- aviso de revisão pendente
- alerta de desafio enviado
- estímulos de retorno ao aplicativo

### 5.12 Sincronização em nuvem

Todos os dados relevantes do usuário serão mantidos no servidor, garantindo:

- acesso em mais de um dispositivo
- recuperação de progresso
- continuidade de uso entre sessões
- persistência de preferências, lembretes e histórico

### 5.13 Compartilhamento de decks

O sistema permitirá o compartilhamento de decks entre usuários.

Possibilidades previstas:

- compartilhamento por link
- compartilhamento por código
- importação de deck compartilhado
- clonagem de deck para outra conta
- definição de visibilidade

Contribui para colaboração, reaproveitamento de conteúdo e crescimento orgânico da plataforma.

---

## 6. Funcionalidades complexas e simples

### 6.1 Funcionalidades complexas

- revisão inteligente com repetição espaçada
- integração real com WhatsApp para desafios automáticos
- compartilhamento online de decks
- sincronização em nuvem
- dashboard analítico com ranking de dificuldade

### 6.2 Funcionalidades mais simples

- gerenciamento de decks
- gerenciamento de cards
- estudo com flip card
- lembretes
- configurações do usuário

---

## 7. Entidades do sistema

### 7.1 Usuário

Representa a pessoa que utiliza a plataforma.

Campos principais:

- id
- nome
- email
- senha_hash
- telefone_whatsapp
- avatar_url
- fuso_horario
- created_at
- updated_at

### 7.2 Deck

Representa uma coleção de cards criada pelo usuário.

Campos principais:

- id
- user_id
- nome
- descricao
- icone
- cor
- is_public
- share_code
- allow_clone
- created_at
- updated_at

### 7.3 Card

Representa um flashcard individual.

Campos principais:

- id
- deck_id
- front
- back
- ordem
- created_at
- updated_at

### 7.4 Progresso do card por usuário

Armazena o desempenho individual do usuário em cada card.

Campos principais:

- id
- user_id
- card_id
- right_count
- wrong_count
- unsure_count
- streak
- difficulty_score
- review_after
- last_review_at
- total_reviews
- status

### 7.5 Sessão de estudo

Representa uma sessão completa realizada pelo usuário em determinado deck.

Campos principais:

- id
- user_id
- deck_id
- total_cards
- right_count
- wrong_count
- unsure_count
- started_at
- finished_at

### 7.6 Resposta de estudo

Representa cada resposta individual dada pelo usuário dentro de uma sessão.

Campos principais:

- id
- session_id
- card_id
- answer_type
- answered_at

### 7.7 Lembrete

Representa um agendamento de estudo.

Campos principais:

- id
- user_id
- title
- type
- deck_id
- horario
- frequencia
- ativo
- canal
- created_at
- updated_at

Observações:

- `type` define o tipo do lembrete:
    - general
    - deck_review
    - due_review
- `deck_id` é opcional e só será preenchido quando o lembrete estiver vinculado a um deck específico.
- `canal` representa o meio pelo qual o lembrete será entregue, como push notification, WhatsApp ou aviso interno.

### 7.8 Configuração do usuário

Armazena as preferências do usuário na plataforma.

Campos principais:

- id
- user_id
- daily_goal
- session_size
- smart_order
- whatsapp_enabled
- whatsapp_time
- notifications_enabled
- updated_at

### 7.9 Desafio WhatsApp

Representa os desafios enviados ao usuário fora do app.

Campos principais:

- id
- user_id
- card_id
- status
- sent_at
- opened_at
- answered_at
- answer_type
- provider_message_id

### 7.10 Compartilhamento de deck

Controla a disponibilização de decks para outros usuários.

Campos principais:

- id
- deck_id
- owner_user_id
- share_code
- share_slug
- is_public
- allow_clone
- expires_at
- created_at

### 7.11 Importação de deck

Registra quem importou ou clonou um deck compartilhado.

Campos principais:

- id
- share_id
- imported_by_user_id
- cloned_deck_id
- imported_at

---

## 8. Tabelas do banco de dados

### 8.1 Tabela `users`

| Campo | Tipo | Restrições | Observações |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | Identificador do usuário |
| name | VARCHAR(120) | NOT NULL | Nome do usuário |
| email | VARCHAR(150) | NOT NULL, UNIQUE | E-mail de login |
| password_hash | VARCHAR(255) | NOT NULL | Senha criptografada |
| whatsapp_phone | VARCHAR(20) | NULL | Número vinculado ao WhatsApp |
| avatar_url | VARCHAR(255) | NULL | Foto de perfil |
| timezone | VARCHAR(60) | NOT NULL | Ex.: `America/Sao_Paulo` |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de atualização |

---

### 8.2 Tabela `user_settings`

| Campo | Tipo | Restrições | Observações |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | Identificador da configuração |
| user_id | BIGINT | NOT NULL, UNIQUE, FK | Referência para `users.id` |
| daily_goal | INT | NOT NULL, DEFAULT 20 | Meta diária de cards |
| session_size | INT | NOT NULL, DEFAULT 10 | Quantidade padrão por sessão |
| smart_order | BOOLEAN | NOT NULL, DEFAULT TRUE | Ativa revisão inteligente |
| whatsapp_enabled | BOOLEAN | NOT NULL, DEFAULT FALSE | Permite desafios via WhatsApp |
| whatsapp_time | TIME | NULL | Horário preferido de envio |
| notifications_enabled | BOOLEAN | NOT NULL, DEFAULT TRUE | Permite notificações |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de atualização |

---

### 8.3 Tabela `decks`

| Campo | Tipo | Restrições | Observações |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | Identificador do deck |
| user_id | BIGINT | NOT NULL, FK | Referência para `users.id` |
| name | VARCHAR(120) | NOT NULL | Nome do deck |
| description | TEXT | NULL | Descrição opcional |
| icon | VARCHAR(20) | NULL | Emoji ou ícone do deck |
| color | VARCHAR(30) | NULL | Cor visual do deck |
| is_public | BOOLEAN | NOT NULL, DEFAULT FALSE | Define visibilidade pública |
| allow_clone | BOOLEAN | NOT NULL, DEFAULT TRUE | Permite clonagem por terceiros |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de atualização |

---

### 8.4 Tabela `cards`

| Campo | Tipo | Restrições | Observações |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | Identificador do card |
| deck_id | BIGINT | NOT NULL, FK | Referência para `decks.id` |
| front_text | TEXT | NOT NULL | Frente do card |
| back_text | TEXT | NOT NULL | Verso do card |
| position | INT | NOT NULL, DEFAULT 0 | Ordem do card no deck |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de atualização |

---

### 8.5 Tabela `card_progress`

| Campo | Tipo | Restrições | Observações |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | Identificador do progresso |
| user_id | BIGINT | NOT NULL, FK | Referência para `users.id` |
| card_id | BIGINT | NOT NULL, FK | Referência para `cards.id` |
| right_count | INT | NOT NULL, DEFAULT 0 | Total de acertos |
| wrong_count | INT | NOT NULL, DEFAULT 0 | Total de erros |
| unsure_count | INT | NOT NULL, DEFAULT 0 | Total de “quase” |
| streak | INT | NOT NULL, DEFAULT 0 | Sequência de acertos |
| difficulty_score | DECIMAL(5,2) | NOT NULL, DEFAULT 1.00 | Nível calculado de dificuldade |
| review_after | TIMESTAMP | NULL | Próxima revisão programada |
| last_review_at | TIMESTAMP | NULL | Última revisão realizada |
| total_reviews | INT | NOT NULL, DEFAULT 0 | Total de revisões do card |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'new' | Ex.: `new`, `learning`, `mastered` |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de atualização |

**Restrição recomendada:**

`UNIQUE (user_id, card_id)` para impedir duplicidade de progresso por usuário e card.

---

### 8.6 Tabela `study_sessions`

| Campo | Tipo | Restrições | Observações |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | Identificador da sessão |
| user_id | BIGINT | NOT NULL, FK | Referência para `users.id` |
| deck_id | BIGINT | NOT NULL, FK | Referência para `decks.id` |
| total_cards | INT | NOT NULL | Quantidade de cards estudados |
| right_count | INT | NOT NULL, DEFAULT 0 | Total de acertos na sessão |
| wrong_count | INT | NOT NULL, DEFAULT 0 | Total de erros na sessão |
| unsure_count | INT | NOT NULL, DEFAULT 0 | Total de “quase” na sessão |
| started_at | TIMESTAMP | NOT NULL | Início da sessão |
| finished_at | TIMESTAMP | NULL | Fim da sessão |

---

### 8.7 Tabela `study_answers`

| Campo | Tipo | Restrições | Observações |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | Identificador da resposta |
| session_id | BIGINT | NOT NULL, FK | Referência para `study_sessions.id` |
| card_id | BIGINT | NOT NULL, FK | Referência para `cards.id` |
| answer_type | VARCHAR(20) | NOT NULL | Ex.: `right`, `wrong`, `unsure` |
| answered_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Momento da resposta |

---

### 8.8 Tabela `reminders`

| Campo | Tipo | Restrições | Observações |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | Identificador do lembrete |
| user_id | BIGINT | NOT NULL, FK | Referência para `users.id` |
| title | VARCHAR(150) | NOT NULL | Título do lembrete |
| type | VARCHAR(30) | NOT NULL | `general`, `deck_review`, `due_review` |
| deck_id | BIGINT | NULL, FK | Referência para `decks.id`, quando aplicável |
| time_of_day | TIME | NOT NULL | Horário do lembrete |
| frequency | VARCHAR(30) | NOT NULL | Ex.: `daily`, `weekly`, `custom` |
| channel | VARCHAR(30) | NOT NULL | Ex.: `push`, `whatsapp`, `in_app` |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Define se o lembrete está ativo |
| last_triggered_at | TIMESTAMP | NULL | Última vez que foi disparado |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de atualização |

### Tipos de lembrete

- **general**: lembrete geral para estudar
- **deck_review**: lembrete vinculado a um deck específico
- **due_review**: lembrete focado em revisões pendentes ou cards difíceis

---

### 8.9 Tabela `whatsapp_challenges`

| Campo | Tipo | Restrições | Observações |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | Identificador do desafio |
| user_id | BIGINT | NOT NULL, FK | Referência para `users.id` |
| card_id | BIGINT | NOT NULL, FK | Referência para `cards.id` |
| reminder_id | BIGINT | NULL, FK | Referência para `reminders.id` |
| provider_message_id | VARCHAR(120) | NULL | ID retornado pela API/gateway |
| status | VARCHAR(30) | NOT NULL | Ex.: `queued`, `sent`, `opened`, `answered`, `failed` |
| sent_at | TIMESTAMP | NULL | Momento do envio |
| opened_at | TIMESTAMP | NULL | Momento da abertura |
| answered_at | TIMESTAMP | NULL | Momento da resposta |
| answer_type | VARCHAR(20) | NULL | `right`, `wrong`, `unsure` |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de atualização |

---

### 8.10 Tabela `deck_shares`

| Campo | Tipo | Restrições | Observações |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | Identificador do compartilhamento |
| deck_id | BIGINT | NOT NULL, FK | Referência para `decks.id` |
| owner_user_id | BIGINT | NOT NULL, FK | Referência para `users.id` |
| share_code | VARCHAR(50) | NOT NULL, UNIQUE | Código de compartilhamento |
| share_slug | VARCHAR(150) | NULL, UNIQUE | Slug amigável para URL |
| is_public | BOOLEAN | NOT NULL, DEFAULT FALSE | Define se o deck é público |
| allow_clone | BOOLEAN | NOT NULL, DEFAULT TRUE | Permite clonagem |
| expires_at | TIMESTAMP | NULL | Data limite de validade |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |

---

### 8.11 Tabela `deck_share_imports`

| Campo | Tipo | Restrições | Observações |
| --- | --- | --- | --- |
| id | BIGINT | PK, AUTO_INCREMENT | Identificador da importação |
| deck_share_id | BIGINT | NOT NULL, FK | Referência para `deck_shares.id` |
| imported_by_user_id | BIGINT | NOT NULL, FK | Referência para `users.id` |
| cloned_deck_id | BIGINT | NOT NULL, FK | Referência para `decks.id` |
| imported_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da importação |

---

## 9. Regras de negócio principais

### 9.1 Revisão inteligente

- se o usuário erra, o card reaparece mais cedo
- se marca “quase”, o card retorna em prazo intermediário
- se acerta várias vezes, o card passa a aparecer com menor frequência
- a dificuldade do card é recalculada a cada interação
- a próxima revisão é definida automaticamente pelo sistema

### 9.2 Dashboard

- utiliza o progresso acumulado do usuário
- exibe ranking das perguntas mais difíceis e mais fáceis
- destaca cards com revisão próxima
- apresenta histórico de atividade e evolução

### 9.3 Lembretes

- o usuário pode ter múltiplos lembretes
- os lembretes podem ser gerais, vinculados a deck ou voltados à revisão pendente
- lembretes podem ser ativados ou desativados
- podem gerar push notifications ou desafios no WhatsApp

### 9.4 Desafio por WhatsApp

- apenas usuários com telefone cadastrado e permissão ativa podem receber
- o sistema prioriza cards difíceis ou próximos da revisão
- a resposta enviada fora do app atualiza o desempenho do card normalmente

### 9.5 Compartilhamento de decks

- o proprietário pode gerar link ou código de compartilhamento
- decks podem ser públicos ou privados
- outro usuário pode clonar o deck
- somente o conteúdo do deck é compartilhado, não o histórico de desempenho

---

## 10. Funcionamento do compartilhamento de deck

### 10.1 Fluxo

- o usuário acessa um deck
- seleciona a opção de compartilhamento
- o backend gera um código ou link
- o sistema disponibiliza esse acesso
- outro usuário visualiza o deck compartilhado
- pode importá-lo para sua própria conta
- o sistema cria uma cópia do deck e de seus cards

### 10.2 O que é compartilhado

- nome do deck
- descrição
- cor
- ícone
- cards com frente e verso

### 10.3 O que não é compartilhado

- histórico de acertos e erros
- streak
- dificuldade
- agenda de revisão
- desempenho individual do criador

O compartilhamento envolve apenas o conteúdo, preservando o progresso pessoal de cada usuário.

---

## 11. Arquitetura sugerida

### 11.1 Frontend

- aplicativo mobile/web
- interface de decks, estudo, estatísticas, lembretes e configurações
- consumo de API
- possibilidade de cache local para uso parcial offline

### 11.2 Backend

- autenticação
- gerenciamento de usuários
- gerenciamento de decks
- gerenciamento de cards
- motor de revisão inteligente
- agendamento de lembretes
- compartilhamento de decks
- integração com WhatsApp
- envio de notificações
- processamento analítico

### 11.3 Banco de dados

- PostgreSQL

### 11.4 Integrações externas

- API do WhatsApp ou gateway compatível
- serviço de push notification
- scheduler/cron para lembretes e desafios automáticos

---

## 12. Escopo final do MVP

O MVP final do Fliply será composto por:

- onboarding
- cadastro e login
- gerenciamento de decks
- gerenciamento de cards
- estudo com frente e verso
- autoavaliação
- revisão inteligente
- dashboard com estatísticas
- lembretes gerais, por deck e por revisão pendente
- configurações
- sincronização em nuvem
- notificações reais
- desafio automático via WhatsApp
- compartilhamento de decks por link ou código

---

## 13. Conclusão

O Fliply é um produto de estudo digital centrado em memorização inteligente.

Seu diferencial está na união entre:

- organização por decks
- revisão adaptativa
- monitoramento de desempenho
- notificações
- desafios externos
- compartilhamento de conteúdo

O MVP proposto entrega uma base robusta, funcional e escalável, com potencial para evoluir tanto como ferramenta acadêmica quanto como produto real de mercado.