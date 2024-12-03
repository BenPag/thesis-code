async function onVerify(token) {
  const imgSrc = await loadTestImg(token)
  if(imgSrc) {
    showImg(imgSrc)
    captchafox.remove()
  }
}

async function loadTestImg(token) {
  try {
    const response = await fetch("/loadTestImg",  {
      method: "POST",
      body: token
    })
    const base64Str = await response.text()
    return "data:image/png;base64," + base64Str
  } catch {
    return false
  }
}
  
function showImg(imgSrc) {
  const img = document.createElement("img")
  img.src = imgSrc
  img.width = img.height = 400
  document.getElementById("app").append(img)
}