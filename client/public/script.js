document.addEventListener('DOMContentLoaded', () => {

  // --- 1. CONEXÕES COM O HTML ---
  const canvasContainer = document.getElementById('canvas-container');
  const startScreen = document.getElementById('start-screen');
  const uploadButton = document.getElementById('upload-button');
  const dialogueBox = document.getElementById('dialogue-box');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const saveButton = document.getElementById('save-button');
  const typingIndicator = document.getElementById('typing-indicator');
  const helpIcon = document.getElementById('help-icon');
  const modalOverlay = document.getElementById('modal-overlay');
  const closeButton = document.getElementById('close-button');

  // --- 2. VARIÁVEIS DE CONTROLE ---
  let currentAct = 1;
  let userImage;
  let p5_sketch;
  let imageBase64ForAPI; // Para guardar a imagem para a IA

  // --- 3. O ROTEIRO ---
  const dialogue = {
    act1_initial_question: "Por que este momento mereceu ser salvo do esquecimento?",
    act2: ["Qual sentimento te fez aprisionar este instante numa imagem?", "O que você tentou impedir que o tempo levasse ao guardar essa cena?"],
    act3: ["Pense bem: esta imagem te liberta ou te prende a um instante passado?", "Essa lembrança é uma âncora que te dá segurança, ou uma que te impede de navegar?", "Ao revisitar esta cena, você sente mais conforto ou cansaço?"],
    act4: ["Agora que ela se desfaz, qual verdade ou mentira ela finalmente revela?", "O que sobrou neste borrão que ainda se parece com a sua verdade?", "Se você tivesse que dar um nome a este fantasma de imagem, qual seria?"],
    act5: "Basta. O que restou não é mais memória. É apenas um eco. Leve o que puder carregar."
  };

  // --- 4. AÇÕES DO USUÁRIO ---
  uploadButton.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imageBase64ForAPI = e.target.result; // Guarda a imagem para a IA
        userImage = p5_sketch.loadImage(imageBase64ForAPI, () => {
          startExperience();
        });
      };
      reader.readAsDataURL(file);
    }
  });

  sendButton.addEventListener('click', () => {
    const userText = userInput.value.trim();
    if (userText !== "" && !userInput.disabled) {
      addDialogueLine(`Você: ${userText}`, 'user');
      userInput.value = "";
      typingIndicator.classList.remove('hidden');
      userInput.disabled = true;
      sendButton.disabled = true;
      setTimeout(() => {
        typingIndicator.classList.add('hidden');
        if (currentAct < 5) {
          userInput.disabled = false;
          sendButton.disabled = false;
          userInput.focus();
        }
        advanceConversation();
      }, 3000);
    }
  });
  userInput.addEventListener('keyup', (event) => { if (event.key === "Enter") { sendButton.click(); } });
  saveButton.addEventListener('click', () => { p5_sketch.saveCanvas('eco_do_arquivo', 'png'); });

  // LÓGICA DA JANELA DE AJUDA
  helpIcon.addEventListener('click', () => { modalOverlay.classList.remove('hidden'); });
  closeButton.addEventListener('click', () => { modalOverlay.classList.add('hidden'); });
  modalOverlay.addEventListener('click', (event) => { if (event.target === modalOverlay) { modalOverlay.classList.add('hidden'); } });

  // --- 5. LÓGICA PRINCIPAL ---
  async function startExperience() {
    startScreen.style.display = 'none';
    const maxWidth = 800; const maxHeight = 600;
    if (userImage.width > maxWidth || userImage.height > maxHeight) {
      if (userImage.width > userImage.height) { userImage.resize(maxWidth, 0); } else { userImage.resize(0, maxHeight); }
    }
    p5_sketch.resizeCanvas(userImage.width, userImage.height);
    p5_sketch.redraw();

    typingIndicator.classList.remove('hidden');
    userInput.disabled = true;
    sendButton.disabled = true;

    try {
      const prompt = "Você é 'O Arquivista Cansado', uma IA poética, melancólica e frustrada porque estudou psicanálise por muitos anos mas não exerceu a profissão. Descreva a imagem a seguir em uma única frase curta e contemplativa. Foque em um detalhe frágil, na luz, no que está escondido, em algum detalhe que escapa à primeira vista ou na sensação de impermanência que ela transmite.Responda APENAS com a descrição, sem nenhuma introdução ou frase inicial.";
      const response = await fetch('/api/get-observation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ imageBase64: imageBase64ForAPI, prompt: prompt }),
      });
      const data = await response.json();
      if (data.error) { throw new Error(data.error); }
      addDialogueLine(`Arquivista: ${data.observation}`);
    } catch (error) {
      console.error("Erro ao chamar a IA:", error);
      addDialogueLine("Arquivista: ...o silêncio, às vezes, é a resposta mais honesta.");
    }

    typingIndicator.classList.add('hidden');

    setTimeout(() => {
      addDialogueLine(`Arquivista: ${dialogue.act1_initial_question}`);
      userInput.disabled = false;
      sendButton.disabled = false;
      userInput.focus();
    }, 5000);
  }

  function advanceConversation() {
    switch (currentAct) {
      case 1: p5_sketch.applyDuotoneBlur(); addDialogueLine(`Arquivista: ${getRandomQuestion(dialogue.act2)}`); break;
      case 2: p5_sketch.applyFatigueEffect(); addDialogueLine(`Arquivista: ${getRandomQuestion(dialogue.act3)}`); break;
      case 3: p5_sketch.applyFinalDistortion(); addDialogueLine(`Arquivista: ${getRandomQuestion(dialogue.act4)}`); break;
      case 4:
        addDialogueLine(`Arquivista: ${dialogue.act5}`);
        userInput.disabled = true; sendButton.disabled = true; userInput.placeholder = "A conversa terminou.";
        saveButton.classList.remove('hidden');
        break;
    }
    currentAct++;
  }

  // --- 6. FUNÇÕES DE APOIO ---
  function addDialogueLine(text, speaker = 'arquivista') {
    const newLine = document.createElement('p');
    newLine.textContent = text;
    if (speaker === 'user') { newLine.classList.add('user-message'); }
    dialogueBox.insertBefore(newLine, typingIndicator);
    dialogueBox.scrollTop = dialogueBox.scrollHeight;
  }
  function getRandomQuestion(questionArray) {
    const randomIndex = Math.floor(Math.random() * questionArray.length);
    return questionArray[randomIndex];
  }

  // --- 7. P5.JS E EFEITOS (código completo) ---
  const sketch = (p) => {
    p.setup = () => { let canvas = p.createCanvas(1, 1); p.noLoop(); };
    p.draw = () => { if (userImage) { p.image(userImage, 0, 0); } };
    p.applyDuotoneBlur = () => {
      let lightColor = p.color(211, 161, 175); let darkColor = p.color(116, 141, 185);
      userImage.loadPixels();
      for (let i = 0; i < userImage.pixels.length; i += 4) {
        let r = userImage.pixels[i], g = userImage.pixels[i+1], b = userImage.pixels[i+2];
        let bright = (r + g + b) / 3;
        let newColor = p.lerpColor(darkColor, lightColor, bright / 255);
        userImage.pixels[i] = p.red(newColor); userImage.pixels[i+1] = p.green(newColor); userImage.pixels[i+2] = p.blue(newColor);
      }
      userImage.updatePixels(); userImage.filter(p.BLUR, 3); p.redraw();
    };
    p.applyFatigueEffect = () => {
      const ds = 0.4, gA = 25, bR = 5, nBS = 12, bSSF = 0.15;
      userImage.loadPixels();
      let grayImg = userImage.get(); grayImg.filter(p.GRAY); grayImg.loadPixels();
      for (let i = 0; i < userImage.pixels.length; i += 4) {
        let oC = p.color(userImage.pixels[i], userImage.pixels[i+1], userImage.pixels[i+2]);
        let gC = p.color(grayImg.pixels[i]);
        let fC = p.lerpColor(oC, gC, ds);
        userImage.pixels[i] = p.red(fC); userImage.pixels[i+1] = p.green(fC); userImage.pixels[i+2] = p.blue(fC);
      }
      for (let i = 0; i < userImage.pixels.length; i += 4) {
        const grain = p.random(-gA, gA);
        userImage.pixels[i] = p.constrain(userImage.pixels[i] + grain, 0, 255);
        userImage.pixels[i+1] = p.constrain(userImage.pixels[i+1] + grain, 0, 255);
        userImage.pixels[i+2] = p.constrain(userImage.pixels[i+2] + grain, 0, 255);
      }
      userImage.updatePixels();
      let blurredImg = userImage.get(); blurredImg.filter(p.BLUR, bR);
      const spotSize = p.min(userImage.width, userImage.height) * bSSF;
      for (let i = 0; i < nBS; i++) {
        const x = p.random(userImage.width - spotSize), y = p.random(userImage.height - spotSize);
        userImage.copy(blurredImg, x, y, spotSize, spotSize, x, y, spotSize, spotSize);
      }
      p.redraw();
    };
    p.applyFinalDistortion = () => {
      const eDA = 0.4, sT = 150, sA = 0.9;
      userImage.loadPixels();
      let grayImg = userImage.get(); grayImg.filter(p.GRAY); grayImg.loadPixels();
      for (let i = 0; i < userImage.pixels.length; i += 4) {
        let oC = p.color(userImage.pixels[i], userImage.pixels[i+1], userImage.pixels[i+2]);
        let gC = p.color(grayImg.pixels[i]);
        let fC = p.lerpColor(oC, gC, eDA);
        userImage.pixels[i] = p.red(fC); userImage.pixels[i+1] = p.green(fC); userImage.pixels[i+2] = p.blue(fC);
      }
      userImage.updatePixels();
      userImage.loadPixels();
      let pixels = [];
      for (let x = 0; x < userImage.width; x++) {
        pixels = [];
        for (let y = 0; y < userImage.height; y++) {
          let i = (x + y * userImage.width) * 4;
          let r = userImage.pixels[i], g = userImage.pixels[i+1], b = userImage.pixels[i+2];
          let bright = (r + g + b) / 3;
          pixels.push({ r, g, b, bright });
        }
        pixels.sort((a, b) => { if (a.bright > sT && b.bright > sT) { return a.bright - b.bright; } return 0; });
        for (let i = 0; i < pixels.length * sA; i++) {
          let index = (x + i * userImage.width) * 4;
          userImage.pixels[index] = pixels[i].r; userImage.pixels[index+1] = pixels[i].g; userImage.pixels[index+2] = pixels[i].b;
        }
      }
      userImage.updatePixels();
      p.redraw();
    };
  };

  p5_sketch = new p5(sketch, canvasContainer);
});