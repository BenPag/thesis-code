function loadDZI() {
  viewer.open(`${dziPath}`)
}

async function onVerify(token) {
  const response = await fetch("/verifyCaptcha?token=" + token, { method: "PUT" })
  if (response.ok) {
    captchafox.remove()
    loadDZI()
  }
}

function renderCaptacha() {
  if (!window.captchafox) return setTimeout(renderCaptacha, 50)
  captchafox.render("#captcha", {
    sitekey: "sk_11111111000000001111111100000000",
    //sitekey: "sk_smAcl5dEJ4pz0xQOMs9sV4NrPruFR",
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
const dziPath = "dzi/DE_RMK_M6_FR-none/DE_RMK_M6_FR-none_2019_Overall"

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", load)
} else {
  load()
}
