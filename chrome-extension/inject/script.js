
const INPUT_EL = document.querySelector('input[title*=Digite]')

function main() {
  injectWrapper();
  startWebcam();
}

function injectWrapper() {
  const currentContainerEl = document.querySelector('.containerConteudo')

  const wrapperHtml = `
    <div id='injectedCurrentContainer'>
    </div>
    <div id='injectedWebcamContainer'>
      <div>
        <video autoplay="true" id="injectedWebcam"></video>
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

async function startWebcam() {
  var video = document.getElementById("injectedWebcam");

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
 * 
 * @param {MouseEvent} evt 
 */
function handleRegisterCupon(evt) {
  evt.stopPropagation()
  alert('aopa')
}

// ---------------------------------------
// ---------------------------------------
// Bootstrap

main()