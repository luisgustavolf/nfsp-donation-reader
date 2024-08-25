
/**
 * Bootstrap method
 */
function main() {
  injectHtmlNewStructure();
  startWebcam();
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
        <video autoplay="true" id="injectedWebcam"></video>
        <canvas id="injectedCanvas"/>
      </div>
      <div>
        <button type="button" id="injectedRegisterBtn">Registrar Cupon</button>
      </div>
    </div>
  `
  const injectedWrapperEl = document.createElement('div')
  injectedWrapperEl.className = 'injectedWrapper'
  injectedWrapperEl.innerHTML = wrapperHtml

  currentContainerEl.parentNode.append(injectedWrapperEl)

  const injectedRegisterBtn = document.getElementById('injectedRegisterBtn')
  injectedRegisterBtn.onclick = handleRegisterCupon

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
 * Get snapshot from webcam
 * @returns {string}
 */
function getImageFromWebcam() {
  const video = getWebcamEl()
  const canvas = getCanvasEl()
  console.log(video.clientWidth, video.clientHeight)
  canvas.width = video.clientWidth
  canvas.height = video.clientHeight
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg');
}

/**
 * Sends request for the cupon processing
 * @param {string} base64Image 
 * @returns {Promise<string|null>}
 */
async function sendRequest(base64Image) {
  const formData = new FormData()
  formData.append('base64_image', base64Image)
  const url = 'http://localhost:8000/read_cupon'
  const request = await fetch(url, {
    method: 'post',
    body: formData
  })

  /** @type {{code: string | null}} */
  const json = await request.json()
  return json.code
}

/**
 * Handle capture click
 * @param {MouseEvent} evt 
 */
async function handleRegisterCupon(evt) {
  const base64Image = getImageFromWebcam()
  const code = await sendRequest(base64Image)
  console.log(code)
}

// ---------------------------------------
// ---------------------------------------
// Bootstrap

main()