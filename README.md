# 🚌 Busão - Calculador de Pontuação

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

Prepare-se para uma viagem estratégica, onde o caos das ruas é apenas o começo!

## Sobre o Jogo

**Busão** é um jogo de estratégia e equilíbrio onde os jogadores assumem o papel de motoristas de ônibus lotados. Sua missão? Circular pelas ruas, pegar passageiros e transportá-los com o objetivo de completar o trajeto com bons passageiros, evitando o caos e o desconforto a bordo.

Em cada rodada, você terá que gerenciar a entrada de passageiros e lidar com situações imprevisíveis, como brigas, confusão e o temido "aperto". Cada carta representa um passageiro com características, preferências e exigências únicas. Use sua estratégia para garantir a harmonia no ônibus e otimizar seu transporte. Mas cuidado! Se o clima ficar tenso ou o ônibus ficar superlotado, passageiros podem desembarcar antes da hora.

Prepare-se para decisões rápidas, jogadas criativas e muito jogo de cintura. O Busão está pegando fogo, e o destino dos passageiros está nas suas mãos!

## Sobre a Ferramenta

Este projeto é um **Calculador de Pontuação digital** criado para ser uma ferramenta de apoio ao jogo de tabuleiro "Busão". O objetivo é automatizar e simplificar a contagem de pontos ao final da partida, que pode se tornar complexa devido às múltiplas interações entre motoristas, melhorias e as diferentes características e efeitos dos passageiros.

Com esta aplicação, os jogadores podem focar na estratégia e na diversão, deixando que a ferramenta cuide da matemática!

## ✨ Funcionalidades

A aplicação oferece as seguintes funcionalidades:

* **Gerenciamento de Jogadores:** Adicione até 3 jogadores, registre suas pontuações e veja quem está na liderança.
* **Seleção de Setup:** Escolha o **Motorista** e até 3 **Melhorias** para o ônibus.
* **Layout Visual do Ônibus:** Posicione cada passageiro em um dos 12 assentos disponíveis de forma intuitiva.
* **Validação de Regras:** A ferramenta aplica restrições de embarque de certos passageiros baseadas nas melhorias selecionadas.
* **Cálculo Automático de Pontos:** Com um único clique, o sistema calcula a pontuação total, considerando:
    * Bônus do Motorista.
    * Bônus das Melhorias.
    * Pontos base e efeitos de cada Passageiro (incluindo bônus e penalidades por adjacência).
    * Penalidade por cartas restantes na mão.
* **Detalhamento da Pontuação:** Veja um resumo claro de onde vieram seus pontos.
* **Ranking em Tempo Real:** Acompanhe a classificação dos jogadores conforme as pontuações são registradas.

## 🚀 Como Usar

1.  **Adicione os Jogadores:** No início, insira o nome de cada jogador e clique em "Adicionar Jogador".
2.  **Selecione o Jogador Ativo:** Na seção de configuração, selecione o jogador cuja pontuação será calculada.
3.  **Configure o Ônibus:** Escolha o motorista e as melhorias que você usou na partida.
4.  **Posicione os Passageiros:** Primeiro, selecione um passageiro na lista "Selecione os Passageiros". Em seguida, clique em um assento vago no layout do busão para posicioná-lo.
5.  **Cartas na Mão:** Informe o número de cartas que restaram na sua mão ao final do jogo.
6.  **Calcule:** Clique no botão **"Calcular Pontuação"**.
7.  **Registre:** Após ver os resultados, clique em **"Registrar Pontuação para o Jogador"** para salvar os pontos e atualizar o ranking.
8.  Repita o processo para os outros jogadores e veja quem foi o grande vencedor!

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias web modernas e de fácil acesso:

* **HTML5:** Para a estrutura da página.
* **Tailwind CSS:** Para estilização rápida e responsiva.
* **JavaScript (ES6+):** Para toda a lógica do jogo, manipulação de regras e interatividade.

## Como Contribuir

Contribuições são sempre bem-vindas! Se você tiver ideias para novas funcionalidades, melhorias na interface ou correções de bugs, sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

1.  Faça um *fork* do projeto.
2.  Crie uma nova *branch* (`git checkout -b feature/sua-feature`).
3.  Faça o *commit* das suas alterações (`git commit -m 'Adiciona sua-feature'`).
4.  Faça o *push* para a *branch* (`git push origin feature/sua-feature`).
5.  Abra um *Pull Request*.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
**Feito com ☕ e muito caos de horário de pico!**
