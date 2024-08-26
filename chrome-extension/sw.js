const URLS = [
  'http://localhost:3000/',
  'https://www.nfp.fazenda.sp.gov.br/EntidadesFilantropicas/ListagemNotaEntidade.aspx',
  'https://www.nfp.fazenda.sp.gov.br/EntidadesFilantropicas/CadastroNotaEntidade.aspx'
]

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'index.html' });
});

chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId, url }) => {
  if (!URLS.includes(url)) return;
  await chrome.scripting.executeScript({
    target: { tabId },
    files: [
      'inject/tesseract.min.js',
      'inject/script.js'
    ],
  });

  await chrome.scripting.insertCSS({
    files: ["inject/styles.css"],
    target: { tabId },
  });
});