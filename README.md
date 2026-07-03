# Funções Lógicas do T-Rex Game Clone

Este documento descreve as principais funções lógicas que serão implementadas no arquivo `script.js` para dar vida ao nosso clone do T-Rex Game. A ideia é manter a simplicidade e a leveza, replicando a mecânica do jogo original.

---

## 1. Inicialização e Configuração

### `initGame()`
Função principal que será chamada para configurar o jogo. Isso inclui:
* Obter o elemento `<canvas>` e seu contexto 2D.
* Carregar todas as imagens (assets) do jogo.
* Definir as variáveis de estado iniciais (pontuação, velocidade, estado do jogo - `running`, `gameOver`).
* Configurar os ouvintes de eventos (para o pulo do dinossauro e reinício do jogo).

---

## 2. Gerenciamento de Assets

### `loadImage(path)`
Uma função auxiliar para carregar uma imagem e retornar uma Promise. Isso garante que todas as imagens estejam prontas antes do jogo começar.

### `loadAllAssets()`
Orquestra o carregamento de todas as imagens do dinossauro, cactos, chão, nuvens e botão de reiniciar.

---

## 3. Entidades do Jogo (Objetos/Classes)

Embora possamos usar classes JavaScript para uma organização mais formal, para um jogo simples como este, podemos começar com objetos literais ou funções construtoras simples para representar:

### Dino
* **Propriedades:** `x`, `y`, `width`, `height`, `velocityY`, `isJumping`, `currentFrame` (para animação).
* **Métodos:** `draw()`, `jump()`, `update()` (para aplicar gravidade e animação).

### Cactus
* **Propriedades:** `x`, `y`, `width`, `height`, `type` (pequeno, grande).
* **Métodos:** `draw()`, `update()` (para mover para a esquerda).

### Ground
* **Propriedades:** `x1`, `x2` (para rolagem infinita), `y`, `width`, `height`.
* **Métodos:** `draw()`, `update()` (para mover para a esquerda e resetar posição).

### Cloud *(Opcional, para dar mais vida ao cenário)*
* **Propriedades:** `x`, `y`, `width`, `height`, `speed`.
* **Métodos:** `draw()`, `update()`.

---

## 4. Lógica do Jogo (Game Loop)

### `gameLoop()`
A função principal que será chamada repetidamente (usando `requestAnimationFrame`). Dentro dela:
* **`update()`**: Atualiza o estado de todas as entidades do jogo (posição do dinossauro, cactos, chão, nuvens).
* **`draw()`**: Desenha todas as entidades na tela.
* **`checkCollision()`**: Verifica se o dinossauro colidiu com algum cacto.
* **`updateScore()`**: Atualiza a pontuação do jogador.

---

## 5. Funções de Atualização e Desenho

### `update()`
* Atualiza a posição do dinossauro (aplicando gravidade e pulo).
* Move os cactos e o chão para a esquerda.
* Gera novos cactos e remove os que saem da tela.
* Atualiza a velocidade do jogo progressivamente.

### `draw()`
* Limpa o canvas.
* Desenha o chão.
* Desenha o dinossauro (com a animação correta).
* Desenha os cactos.
* Desenha as nuvens (se implementado).
* Exibe a pontuação atual.

---

## 6. Detecção de Colisão

### `checkCollision(dino, cactus)`
Uma função que verifica se as caixas delimitadoras (hitboxes) do dinossauro e de um cacto se sobrepõem. Se sim, o jogo termina.

---

## 7. Gerenciamento de Obstáculos

### `generateCactus()`
Cria um novo objeto `Cactus` em uma posição aleatória na borda direita da tela.

### `removeOffscreenCactus()`
Remove cactos que já passaram da tela para otimizar o desempenho.

---

## 8. Pontuação e Game Over

### `updateScore()`
Incrementa a pontuação a cada quadro ou a cada certa distância percorrida.

### `gameOver()`
* Para o `gameLoop`.
* Exibe a tela de "GAME OVER".
* Permite reiniciar o jogo.

---

## 9. Controles do Jogador

### `handleKeyDown(event)`
Função que responde a eventos de teclado (por exemplo, a tecla `Espaço` para pular).

### `restartGame()`
Reseta todas as variáveis de estado e inicia o `gameLoop` novamente.

---

Esta estrutura nos dará uma base sólida para construir o jogo. Cada uma dessas funções será desenvolvida passo a passo para garantir que o jogo funcione como esperado e seja fácil de manter.
