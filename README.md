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

### Modo Scanner (OCR)

O **Modo Scanner** permite digitalizar as cartas do seu ônibus diretamente pela câmera do dispositivo, preenchendo a configuração automaticamente sem digitar nada.

- **Wizard passo a passo:** guia o jogador por cada etapa (Rota Diária → Perrengue → Melhorias → Motorista → Passageiros).
- **Reconhecimento por câmera:** usa Tesseract.js para OCR em tempo real diretamente no navegador, sem envio de dados a servidores.
- **Confirmação com checkboxes:** exibe as cartas identificadas com caixas de seleção para que o jogador confirme ou descarte resultados antes de avançar.
- **Captura múltipla:** nas etapas de Melhorias e Passageiros, é possível capturar várias cartas em sequência antes de finalizar a etapa.
- **Matching inteligente:**
  - Correspondência por nome, apelido e nome alternativo (manchete física da carta).
  - Stopwords de jogo (ex: "busão", "grandão") evitam falsos positivos causados por textos de efeito que citam outras cartas.
  - Quadrantes sobrepostos na leitura do frame evitam corte de palavras longas na borda dos quadrantes.
  - Matching fuzzy via distância de Levenshtein como fallback para OCR imperfeito.

## Como Usar

1. **Configure o Ônibus:** Na aba "Configuração", escolha o motorista e as melhorias utilizadas. Ative as expansões desejadas.
2. **Posicione os Passageiros:** Na aba "Assentos", clique em um assento no visual do busão ou na grade para abrir o seletor de carta.
3. **Cartas na Mão:** Informe o número de cartas que restaram na sua mão ao final do jogo.
4. **Acompanhe o Resultado:** O painel direito exibe a pontuação total e o detalhamento por assento em tempo real.
5. **Salve no Ranking:** Clique em "Salvar pontuação" para registrar o resultado.
6. Repita para os outros jogadores e veja quem foi o grande vencedor!

### Usando o Modo Scanner

1. Clique em **"Escanear Ônibus"** na aba Configuração.
2. Conceda permissão de câmera quando solicitado.
3. Siga o wizard: aponte a câmera para cada carta conforme indicado e clique em **Capturar**.
4. Confirme os resultados exibidos (desmarque eventuais falsos positivos) e avance.
5. Ao final, o ônibus é preenchido automaticamente com as cartas reconhecidas.

## Estrutura do Projeto

```
app-busao/
├── index.html               # Estrutura HTML e lógica do scanner (UI, wizard, callbacks)
├── css/
│   └── style.css            # Estilos da interface
├── js/
│   ├── script.js            # Dados do jogo: motoristas, melhorias, cartas e expansões
│   ├── main.js              # Lógica, UI, cálculo de pontuação e interatividade
│   └── GameLogic.js         # Motor de regras: validação de embarque e cálculo de pontos
├── src/
│   ├── vision/
│   │   ├── CameraHandler.js     # Acesso à câmera, wizard de scan e OCR por etapa
│   │   ├── cardDefinitions.js   # Coordenadas do playmat, zonas de foco e matching OCR
│   │   └── masterCardList.js    # Lista unificada de todas as cartas (usada pelo fuzzy matcher)
│   └── utils/
│       └── stringMatcher.js     # Matching fuzzy via Levenshtein + janela deslizante
├── documentos/
│   ├── Manual 5.0 reduzido.pdf
│   └── Listas de cartas com efeitos e pontuação.pdf
├── README.md
└── LICENSE
```

## Tecnologias Utilizadas

- **HTML5 / CSS3 / JavaScript (ES6+):** Estrutura, estilos e toda a lógica do jogo.
- **Tesseract.js:** OCR no navegador para o Modo Scanner — nenhum dado é enviado a servidores externos.
- **localStorage:** Persistência do ranking local.

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
