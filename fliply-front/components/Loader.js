export class Loader {
  show() {
    document.getElementById('loader').classList.add('active')
  }

  hide() {
    document.getElementById('loader').classList.remove('active')
  }
}
