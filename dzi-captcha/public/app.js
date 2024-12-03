function loadDZI() {
  viewer.open(`${dziPath}`)
}

async function onVerify(token) {
  const url = "/verifyCaptcha?token=" + token
  const response = await fetch(url, { method: "PUT" })
  if (response.ok) {
    captchafox.remove()
    loadDZI()
  }
}

function renderCaptacha() {
  if (!window.captchafox) return setTimeout(renderCaptacha, 50)
  captchafox.render("#captcha", {
    sitekey: "sk_11111111000000001111111100000000",
    onVerify,
  })
}

async function load() {
  viewer = new OpenSeadragon({
    id: "openSeaDragon",
    prefixUrl: "/openseadragon/images/",
  })
  
  const response = await fetch(dziPath)
  if (response.ok) return loadDZI()
  renderCaptacha()
}

var viewer;
const dziPath = "images/DE_RMK_M6_FR-none/01_Overall/DE_RMK_M6_FR-none_2019_Overall.dzi"

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", load)
} else {
  load()
}
