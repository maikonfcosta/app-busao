# Busão - Calculador de Pontuação

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

Prepare-se para uma viagem estratégica, onde o caos das ruas é apenas o começo!

## Sobre o Jogo

**Busão** é um jogo de estratégia e equilíbrio onde os jogadores assumem o papel de motoristas de ônibus lotados. Sua missão? Circular pelas ruas, pegar passageiros e transportá-los com o objetivo de completar o trajeto com bons passageiros, evitando o caos e o desconforto a bordo.

Em cada rodada, você terá que gerenciar a entrada de passageiros e lidar com situações imprevisíveis, como brigas, confusão e o temido "aperto". Cada carta representa um passageiro com características, preferências e exigências únicas. Use sua estratégia para garantir a harmonia no ônibus e otimizar seu transporte. Mas cuidado! Se o clima ficar tenso ou o ônibus ficar superlotado, passageiros podem desembarcar antes da hora.

Prepare-se para decisões rápidas, jogadas criativas e muito jogo de cintura. O Busão está pegando fogo, e o destino dos passageiros está nas suas mãos!

## Sobre a Ferramenta

Este projeto é um **Calculador de Pontuação digital** criado para ser uma ferramenta de apoio ao jogo de tabuleiro "Busão". O objetivo é automatizar e simplificar a contagem de pontos ao final da partida, que pode se tornar complexa devido às múltiplas interações entre motoristas, melhorias e as diferentes características e efeitos dos passageiros.

Com esta aplicação, os jogadores podem focar na estratégia e na diversão, deixando que a ferramenta cuide da matemática!

## Funcionalidades

- **Gerenciamento de Jogadores:** Registre o nome do jogador e salve pontuações no ranking local.
- **Seleção de Setup:** Escolha o **Motorista** e até 3 **Melhorias** para o ônibus.
- **Expansões:** Ative individualmente as expansões disponíveis:
  - Cobradores, Os Apaixonados, Perrengues, Estou no Busão, Lendas Urbanas, Grupo de Pagode, Rotas Diárias.
- **Layout Visual do Ônibus:** Posicione cada passageiro em um dos 12 assentos de forma intuitiva via modal de seleção.
- **Validação de Regras:** Restrições de embarque aplicadas automaticamente (melhorias, adjacência, unicidade, etc.).
- **Cálculo Automático de Pontos:** Calculado em tempo real, considerando:
  - Bônus do Motorista e Melhorias.
  - Pontos base, habilidades e penalidades de cada Passageiro (incluindo adjacência).
  - Bônus de Apaixonados adjacentes, Grupo de Pagode completo, Perrengues e Rotas Diárias.
  - Penalidade por cartas restantes na mão.
- **Catálogo de Cartas:** Consulte todos os passageiros, motoristas, melhorias e expansões com busca por nome, tag ou efeito.
- **Regras & FAQ:** Resumo das regras e perguntas frequentes integrados na interface.
- **Ranking:** Acompanhe a classificação salva no navegador (localStorage).

## Como Usar

1. **Configure o Ônibus:** Na aba "Configuração", escolha o motorista e as melhorias utilizadas. Ative as expansões desejadas.
2. **Posicione os Passageiros:** Na aba "Assentos", clique em um assento no visual do busão ou na grade para abrir o seletor de carta.
3. **Cartas na Mão:** Informe o número de cartas que restaram na sua mão ao final do jogo.
4. **Acompanhe o Resultado:** O painel direito exibe a pontuação total e o detalhamento por assento em tempo real.
5. **Salve no Ranking:** Clique em "Salvar pontuação" para registrar o resultado.
6. Repita para os outros jogadores e veja quem foi o grande vencedor!

## Estrutura do Projeto

```
app-busao/
├── index.html          # Estrutura HTML da aplicação
├── css/
│   └── style.css       # Estilos da interface
├── js/
│   ├── script.js       # Dados do jogo: motoristas, melhorias, cartas e expansões
│   └── main.js         # Lógica, UI, cálculo de pontuação e interatividade
├── documentos/
│   ├── Manual 5.0 reduzido.pdf
│   └── Listas de cartas com efeitos e pontuação.pdf
├── README.md
└── LICENSE
```

## Tecnologias Utilizadas

- **HTML5:** Para a estrutura da página.
- **CSS3:** Estilos customizados com variáveis CSS e design responsivo.
- **JavaScript (ES6+):** Para toda a lógica do jogo, manipulação de regras e interatividade.

## Como Contribuir

Contribuições são sempre bem-vindas! Se você tiver ideias para novas funcionalidades, melhorias na interface ou correções de bugs, sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

1. Faça um *fork* do projeto.
2. Crie uma nova *branch* (`git checkout -b feature/sua-feature`).
3. Faça o *commit* das suas alterações (`git commit -m 'Adiciona sua-feature'`).
4. Faça o *push* para a *branch* (`git push origin feature/sua-feature`).
5. Abra um *Pull Request*.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
**Feito com café e muito caos de horário de pico!**
