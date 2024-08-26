/**
 * Bootstrap method
 */

let TESSERACT_WORKER;

async function main() {
  setupTesseractWorker();
  injectHtmlNewStructure();
  startWebcam();
}

async function setupTesseractWorker() {
  TESSERACT_WORKER = await Tesseract.createWorker('eng');
}

/**
 * Build the basic structure
 */
function injectHtmlNewStructure() {
  const currentContainerEl = document.querySelector('.containerConteudo')

  const wrapperHtml = `
    <div id='injectedCurrentContainer'>
    </div>
    <div id='injectedWebcamContainer'>
      <div>
        Posicione um cupon, com foco no número da Nota Fiscal, e pressione <b>Ler Imagem</b>. <br/>
        O código tem um formato como: "3524 0003 1856 5600 0114 6500 3000 0075 0410 3007 8012" <br />
        Se o código for encontrado, será automaticamente preenchido no campo "Chave de Acesso". <br />
        É sempre importante, verificar se o numero está bem focado e iluminado.
      </div>
      <div>
        <video autoplay="true" id="injectedWebcam"></video>
        <canvas id="injectedCanvas"/>
      </div>
      <div>
        <button type="button" id="injectedReadImageBtn">
          Ler Imagem
        </button>
      </div>
    </div>
  `
  const injectedWrapperEl = document.createElement('div')
  injectedWrapperEl.className = 'injectedWrapper'
  injectedWrapperEl.innerHTML = wrapperHtml

  currentContainerEl.parentNode.append(injectedWrapperEl)

  const injectedReadImageBtn = document.getElementById('injectedReadImageBtn')
  injectedReadImageBtn.onclick = handleRegisterCupon

  const injectedCurrentContainer = document.getElementById('injectedCurrentContainer')
  injectedCurrentContainer.appendChild(currentContainerEl)
}

/**
 * Starts webcam
 */
async function startWebcam() {
  var video = getWebcamEl();

  if (navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      video.srcObject = stream;
    } catch (error) {
      alert('Não foi possivel ativar a webcam.')
    }
  }
}

/**
 * Get Webcam Element
 * @returns {HTMLVideoElement | null}
 */
function getWebcamEl() {
  return document.getElementById("injectedWebcam");
}

/**
 * Get Canvas Element
 * @returns {HTMLCanvasElement | null}
 */
function getCanvasEl() {
  return document.getElementById("injectedCanvas");
}

/**
 * Get Input Element
 * @returns {HTMLInputElement | null}
 */
function getInputEl() {
  return document.querySelector('input[title*=Digite]')
}

/**
 * Get Input Element
 * @returns {HTMLButtonElement | null}
 */
function getSaveBtnEl() {
  return document.getElementById('btnSalvarNota')
}

/**
 * Get Read Cupon Button Element
 * @returns {HTMLButtonElement | null}
 */
function getReadCuponBtnEl() {
  return document.getElementById('injectedReadImageBtn')
}

/**
 * Get snapshot from webcam
 * @returns {string}
 */
function takeAVideoSnapshotOnCanvasElement() {
  const video = getWebcamEl()
  const canvas = getCanvasEl()
  canvas.width = video.clientWidth
  canvas.height = video.clientHeight
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas
}

/**
 * Handle capture click
 * @param {MouseEvent} evt 
 */
async function handleRegisterCupon(evt) {
  const readCuponBen = getReadCuponBtnEl()
  readCuponBen.disabled = true
  const recognizedText = await recognizeTextFromWebcam()
  const cupon = getCuponCodeFromText(recognizedText)
  readCuponBen.disabled = false
  
  if (!cupon) {
    alert('Codigo não encontrado')
    return
  } 

  getInputEl().value = cupon.replaceAll(' ', '-')
}


/**
 * Extract text from the video feedback
 * @returns {Promise<text>}
 */
async function recognizeTextFromWebcam() {
  const canvasEl = takeAVideoSnapshotOnCanvasElement()
  const { data: { text } } = await TESSERACT_WORKER.recognize(canvasEl);
  return text
}


/**
 * Extract a NFSP number from a text
 * @param {string} text
 * @returns {string | null} 
 */
function getCuponCodeFromText(text) {
  const pattern = /(\d{4}\s){10}\d{4}/
  const found = text.match(pattern)
  return !found ? null : found[0]
}

// ---------------------------------------
// ---------------------------------------
// Bootstrap

main()